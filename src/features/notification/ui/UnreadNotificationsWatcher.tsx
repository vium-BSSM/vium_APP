import { useEffect } from 'react';
import { useHeaderBadgeStore } from '@/shared/lib/headerBadgeStore';
import { useNotifications } from '../lib/useNotifications';

// 안 읽은 알림 확인 주기 (앱이 앞에 있을 때)
const POLL_INTERVAL_MS = 60 * 1000;

/** 안 읽은 알림이 있는지 주기적으로 확인해 헤더 종 아이콘의 빨간 점을 켬 (화면에는 아무것도 그리지 않음) */
export const UnreadNotificationsWatcher = () => {
  const { unreadCount } = useNotifications('all', { refetchInterval: POLL_INTERVAL_MS });
  const setHasUnread = useHeaderBadgeStore((state) => state.setHasUnreadNotifications);

  useEffect(() => {
    setHasUnread(unreadCount > 0);
  }, [unreadCount, setHasUnread]);

  return null;
};
