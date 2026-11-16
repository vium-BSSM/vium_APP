import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { AppHeader, BackHeader, Chip, HeaderActions } from '@/shared/ui';
import { useMyProfile } from '@/features/account';
import { NotificationRow } from '../ui/NotificationRow';
import { NotificationFilter, NotificationItem } from '../types';

export const NotificationsPage = () => {
  const { profile } = useMyProfile();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  // TODO(API): GET /api/me/notifications 연결 (feature/community-api 브랜치)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const unreadCount = notifications.filter((item) => item.unread).length;
  const items = filter === 'unread' ? notifications.filter((item) => item.unread) : notifications;

  // TODO(API): PATCH /api/me/notifications/{id}/read
  const markRead = (ids: number[]) =>
    setNotifications((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, unread: false } : item)));

  return (
    <View className="flex-1 bg-white">
      <View className="mb-2">
        <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      </View>
      <BackHeader
        title="알림"
        actionLabel="모두 읽음"
        onActionPress={() => markRead(notifications.filter((item) => item.unread).map((item) => item.id))}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NotificationRow item={item} onPress={() => item.unread && markRead([item.id])} />}
        // 하단 탭(약 140)에 가리지 않도록 아래 여백 확보
        contentContainerClassName="px-screen md:px-10 lg:px-20 pt-[9px] pb-[140px]"
        ListHeaderComponent={
          <View className="flex-row gap-2 mb-[22px]">
            <Chip label="전체" selected={filter === 'all'} onPress={() => setFilter('all')} />
            <Chip
              label={unreadCount > 0 ? `안 읽음 ${unreadCount}` : '안 읽음'}
              selected={filter === 'unread'}
              onPress={() => setFilter('unread')}
            />
          </View>
        }
        ListEmptyComponent={
          <Text className="text-text14 font-sans text-text-300 text-center mt-10">
            {filter === 'unread' ? '안 읽은 알림이 없어요' : '받은 알림이 없어요'}
          </Text>
        }
      />
    </View>
  );
};
