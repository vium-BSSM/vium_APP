import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/shared/api/types';
import { getNotifications, markNotificationRead } from '../api/notificationApi';
import { mapNotification } from './notificationMapper';
import { NotificationFilter } from '../types';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: ['notifications', 'list'] as const,
  expiryPopup: ['notifications', 'expiryPopup'] as const,
  consumptionCheck: ['notifications', 'consumptionCheck'] as const,
};

/** 알림 목록 — '안 읽음' 개수도 필요해서 전체를 받아 화면에서 거름 */
export const useNotifications = (filter: NotificationFilter, options?: { refetchInterval?: number | false }) => {
  const query = useQuery({
    queryKey: notificationKeys.list,
    queryFn: async () => unwrap(await getNotifications()).notifications.map(mapNotification),
    refetchInterval: options?.refetchInterval,
  });

  const all = useMemo(() => query.data ?? [], [query.data]);
  const unreadCount = all.filter((item) => item.unread).length;
  const items = filter === 'unread' ? all.filter((item) => item.unread) : all;

  return {
    items,
    unreadCount,
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
};

/** 읽음 처리 — 여러 개를 넘기면 한 번에 처리 ('모두 읽음'은 일괄 API가 없어 하나씩 호출) */
export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => Promise.all(ids.map((id) => markNotificationRead(id))),
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};
