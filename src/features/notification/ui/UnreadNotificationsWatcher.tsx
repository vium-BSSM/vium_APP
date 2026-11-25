import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useHeaderBadgeStore } from '@/shared/lib/headerBadgeStore';
import { subscribeUserEvents, useUserEventStreamStore } from '@/shared/lib/userEventStream';
import { notificationKeys, useNotifications } from '../lib/useNotifications';

// 실시간 스트림(SSE)이 끊겨 있을 때만 쓰는 대체 폴링 주기
const FALLBACK_POLL_MS = 60 * 1000;

/**
 * 헤더 종 아이콘의 빨간 점(readAt == null 개수 > 0)을 맞춤 (화면에는 아무것도 그리지 않음).
 * SSE notification 이벤트가 오거나 (재)연결되면 알림 목록·팝업 대상을 다시 조회.
 * 서버가 30분마다 연결을 끊으므로 재연결(onOpen) 때 놓친 알림을 맞춘다.
 */
export const UnreadNotificationsWatcher = () => {
  const queryClient = useQueryClient();
  const streamConnected = useUserEventStreamStore((state) => state.connected);
  const { unreadCount } = useNotifications('all', {
    refetchInterval: streamConnected ? false : FALLBACK_POLL_MS,
  });
  const setHasUnread = useHeaderBadgeStore((state) => state.setHasUnreadNotifications);

  useEffect(() => {
    setHasUnread(unreadCount > 0);
  }, [unreadCount, setHasUnread]);

  useEffect(() => {
    // 알림 목록뿐 아니라 소비기한 팝업·소진 확인 대상도 같은 배치에서 바뀜
    const refresh = () => queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    return subscribeUserEvents({
      onOpen: refresh,
      onEvent: (event) => {
        if (event === 'notification') refresh();
      },
    });
  }, [queryClient]);

  return null;
};
