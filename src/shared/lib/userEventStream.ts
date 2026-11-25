import { useEffect } from 'react';
import { AppState } from 'react-native';
import { create } from 'zustand';
import { API_BASE_URL, refreshAccessTokenOnce } from '@/shared/api/client';
import { connectSse, SseConnection } from './sse';
import { tokenStorage } from './tokenStorage';

const EVENTS_PATH = '/api/me/events';
// 서버 heartbeat(ping)가 25초 간격 — 두 번 넘게 못 받으면 끊긴 것으로 보고 다시 연결
const WATCHDOG_MS = 60 * 1000;
const MAX_RETRY_MS = 30 * 1000;

// 함수로 매번 다시 읽음 (await 전후 값이 달라질 수 있음)
const isBackground = () => AppState.currentState === 'background';

export interface UserEventListener {
  /** 연결(재연결 포함)이 열림 — 끊겨 있던 동안 놓친 데이터를 다시 맞출 때 사용 */
  onOpen?: () => void;
  onEvent?: (event: string, data: string) => void;
}

const listeners = new Set<UserEventListener>();

/** 사용자 이벤트 스트림 구독 (chat-message, notification 등). 해제 함수를 돌려줌 */
export const subscribeUserEvents = (listener: UserEventListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// 스트림이 붙어 있는 동안에는 각 기능의 대체 폴링을 끔
interface UserEventStreamState {
  connected: boolean;
}

export const useUserEventStreamStore = create<UserEventStreamState>()(() => ({ connected: false }));

const setConnected = (connected: boolean) => useUserEventStreamStore.setState({ connected });

/**
 * 사용자 이벤트 스트림(GET /api/me/events)에 연결해 받은 이벤트를 구독자에게 전달.
 * 연결은 하나만 유지하도록 로그인 후 레이아웃에서 한 번만 호출한다.
 * 앱이 앞에 있을 때만 연결하고, 서버가 연결을 닫으면(최대 수명 30분 등) 자동으로 다시 붙음.
 * 백엔드가 Authorization 헤더만 받으므로 헤더를 붙일 수 있는 XHR 기반 SSE(connectSse)를 씀.
 */
export const useUserEventStream = () => {
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
          listeners.forEach((listener) => listener.onOpen?.());
        },
        onEvent: (event, data) => {
          resetWatchdog();
          listeners.forEach((listener) => listener.onEvent?.(event, data));
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
  }, []);
};
