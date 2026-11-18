import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { AppHeader, BackHeader, Chip, HeaderActions } from '@/shared/ui';
import { useMyProfile } from '@/features/account';
import { useMarkNotificationsRead, useNotifications } from '../lib/useNotifications';
import { NotificationRow } from '../ui/NotificationRow';
import { NotificationFilter, NotificationItem } from '../types';

export const NotificationsPage = () => {
  const { profile } = useMyProfile();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const { items, unreadCount, isLoading, error } = useNotifications(filter);
  const { mutate: markRead } = useMarkNotificationsRead();

  const handleMarkAllRead = () => {
    const unreadIds = items.filter((item) => item.unread).map((item) => item.id);
    if (unreadIds.length > 0) markRead(unreadIds);
  };

  const handlePress = (item: NotificationItem) => {
    if (item.unread) markRead([item.id]);
    // TODO: 알림 응답에 대상 id(게시물·거래·채팅방·재고)가 없어 해당 화면으로 이동하지 못함 — BE에 필드 추가 요청
  };

  return (
    <View className="flex-1 bg-white">
      {/* BackHeader(높이 52)가 위쪽에 약 14px 여백을 품고 있어 +20px이면 홈과 같은 34px */}
      <View className="mb-5">
        <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      </View>
      <BackHeader title="알림" actionLabel="모두 읽음" onActionPress={handleMarkAllRead} />

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NotificationRow item={item} onPress={() => handlePress(item)} />}
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
          isLoading ? (
            <ActivityIndicator className="mt-10" color="#A2CD87" />
          ) : (
            <Text className="text-text14 font-sans text-text-300 text-center mt-10">
              {error ?? (filter === 'unread' ? '안 읽은 알림이 없어요' : '받은 알림이 없어요')}
            </Text>
          )
        }
      />
    </View>
  );
};
