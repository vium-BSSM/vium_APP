import React from 'react';
import { Pressable, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import BellIcon from '@/../assets/icons/bell-icon.svg';
import { useHeaderBadgeStore } from '@/shared/lib/headerBadgeStore';
import { Avatar } from './Avatar';

interface HeaderActionsProps {
  profileImageUrl?: string | null;
}

/** AppHeader 오른쪽 — 알림(→ /notifications)과 프로필(→ /mypage) */
export const HeaderActions: React.FC<HeaderActionsProps> = ({ profileImageUrl }) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasUnread = useHeaderBadgeStore((state) => state.hasUnreadNotifications);

  return (
    <View className="flex-row items-center gap-2.5">
      <Pressable
        onPress={() => pathname !== '/notifications' && router.navigate('/notifications' as any)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={hasUnread ? '알림, 안 읽은 알림 있음' : '알림'}
      >
        <BellIcon width={31} height={31} />
        {hasUnread && (
          // 원래 아이콘에 그려져 있던 점과 같은 자리·크기 (31px 아이콘 기준 오른쪽 위 7px)
          <View className="absolute top-[4px] right-[4px] w-[7px] h-[7px] rounded-full bg-status-danger" />
        )}
      </Pressable>
      <Pressable
        onPress={() => router.navigate('/mypage' as any)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="마이페이지"
      >
        <Avatar uri={profileImageUrl} size={30} />
      </Pressable>
    </View>
  );
};
