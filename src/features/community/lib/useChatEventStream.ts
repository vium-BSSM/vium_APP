import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, refreshAccessTokenOnce } from '@/shared/api/client';
import { connectSse, SseConnection } from '@/shared/lib/sse';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { communityKeys } from './queryKeys';
import { useChatStreamStore } from './chatStreamStore';

const EVENTS_PATH = '/api/me/events';
// 서버 heartbeat(ping)가 25초 간격 — 두 번 넘게 못 받으면 끊긴 것으로 보고 다시 연결
const WATCHDOG_MS = 60 * 1000;
const MAX_RETRY_MS = 30 * 1000;

// 함수로 매번 다시 읽음 (await 전후 값이 달라질 수 있음)
const isBackground = () => AppState.currentState === 'background';

interface ChatMessageEventData {
  chatRoomId: number;
  messageId: number;
}

/**
 * 사용자 이벤트 스트림(GET /api/me/events)에 연결해 새 채팅 메시지가 오면 해당 방 메시지와 채팅 목록을 다시 불러옴.
 * 앱이 앞에 있을 때만 연결하고, 서버가 연결을 닫으면(최대 수명 30분 등) 자동으로 다시 붙음.
 */
export const useChatEventStream = () => {
  const queryClient = useQueryClient();
  const setConnected = useChatStreamStore((state) => state.setConnected);

  useEffect(() => {
    let connection: SseConnection | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;
    let disposed = false;
    let connecting = false;
    // 재발급 직후에도 401이면 더 시도하지 않음 (refresh token이 1회용이라 무한 회전 방지)
    let authRetried = false;

    const clearTimers = () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (watchdogTimer) clearTimeout(watchdogTimer);
      retryTimer = null;
      watchdogTimer = null;
    };

    const disconnect = () => {
      clearTimers();
      connection?.close();
      connection = null;
      setConnected(false);
    };

    const scheduleReconnect = (delay: number) => {
      if (disposed || retryTimer) return;
      retryTimer = setTimeout(() => {
        retryTimer = null;
        connect();
      }, delay);
    };

    const nextDelay = () => Math.min(1000 * 2 ** attempt++, MAX_RETRY_MS);

    const resetWatchdog = () => {
      if (watchdogTimer) clearTimeout(watchdogTimer);
      watchdogTimer = setTimeout(() => {
        disconnect();
        scheduleReconnect(nextDelay());
      }, WATCHDOG_MS);
    };

    const handleChatMessage = (raw: string) => {
      let chatRoomId: unknown;
      try {
        chatRoomId = (JSON.parse(raw) as Partial<ChatMessageEventData>).chatRoomId;
      } catch {
        chatRoomId = undefined;
      }
      // 형식이 다르면 어느 방인지 모르므로 열려 있는 채팅방 메시지를 모두 갱신
      queryClient.invalidateQueries({
        queryKey: typeof chatRoomId === 'number' ? communityKeys.chatMessages(chatRoomId) : ['chatMessages'],
      });
      queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms });
    };

    const connect = async () => {
      if (disposed || connection || connecting || isBackground()) return;
      connecting = true;
      const token = await tokenStorage.getAccessToken();
      connecting = false;
      // 토큰을 읽는 사이 백그라운드로 갔거나 정리됐을 수 있으므로 다시 확인
      if (disposed || connection || !token || isBackground()) return;

      connection = connectSse(`${API_BASE_URL}${EVENTS_PATH}`, { Authorization: `Bearer ${token}` }, {
        onOpen: () => {
          attempt = 0;
          authRetried = false;
          setConnected(true);
          resetWatchdog();
          // 끊겨 있던 동안 온 메시지를 놓치지 않도록 한 번 맞춤
          queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms });
          queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
        },
        onEvent: (event, data) => {
          resetWatchdog();
          if (event === 'chat-message') handleChatMessage(data);
        },
        onClose: async (status) => {
          connection = null;
          clearTimers();
          setConnected(false);
          if (disposed) return;

          if (status === 401) {
            // 토큰 만료 — 한 번만 재발급 후 다시 연결, 그래도 401이거나 재발급 실패면 포기
            // (로그아웃 처리는 axios 인터셉터가 담당, 다음 포그라운드 복귀 때 다시 시도)
            if (authRetried) return;
            authRetried = true;
            const newToken = await refreshAccessTokenOnce();
            if (newToken) scheduleReconnect(0);
            return;
          }
          scheduleReconnect(nextDelay());
        },
      });
    };

    connect();

    const subscription = AppState.addEventListener('change', (state) => {
      // iOS는 알림센터·Face ID·전화 수신 때 잠깐 inactive가 되므로 background일 때만 끊음
      if (state === 'active') {
        attempt = 0;
        authRetried = false;
        connect();
      } else if (state === 'background') {
        disconnect();
      }
    });

    return () => {
      disposed = true;
      subscription.remove();
      disconnect();
    };
  }, [queryClient, setConnected]);
};
