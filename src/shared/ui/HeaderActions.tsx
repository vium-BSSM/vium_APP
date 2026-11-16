import React from 'react';
import { Pressable, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import BellIcon from '@/../assets/icons/bell-icon.svg';
import { Avatar } from './Avatar';

interface HeaderActionsProps {
  profileImageUrl?: string | null;
}

/** AppHeader 오른쪽 — 알림(→ /notifications)과 프로필(→ /mypage) */
export const HeaderActions: React.FC<HeaderActionsProps> = ({ profileImageUrl }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex-row items-center gap-2.5">
      <Pressable
        onPress={() => pathname !== '/notifications' && router.navigate('/notifications' as any)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="알림"
      >
        <BellIcon width={31} height={31} />
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
