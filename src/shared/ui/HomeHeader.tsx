import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from './AppHeader';
import { HeaderActions } from './HeaderActions';

export type HomeTab = 'recommend' | 'fridge';

const TABS: { key: HomeTab; label: string; route: string }[] = [
  { key: 'recommend', label: '오늘의 추천', route: '/main' },
  { key: 'fridge', label: '내 식재료', route: '/fridge' },
];

interface HomeHeaderProps {
  activeTab: HomeTab;
  profileImageUrl?: string | null;
}

/**
 * 홈(/main)과 냉장고(/fridge) 공통 상단 — 로고·알림·프로필 + '오늘의 추천 / 내 식재료' 탭
 * 두 화면은 각각 별도 탭이라 탭 전환은 navigate로 처리
 */
export const HomeHeader: React.FC<HomeHeaderProps> = ({ activeTab, profileImageUrl }) => {
  const router = useRouter();

  return (
    <View className="gap-[34px]">
      <AppHeader right={<HeaderActions profileImageUrl={profileImageUrl} />} />

      <View className="px-screen md:px-10 lg:px-20 flex-row items-center gap-4">
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => tab.key !== activeTab && router.navigate(tab.route as any)}
            hitSlop={8}
          >
            <Text
              className={`text-text16 font-sans ${tab.key === activeTab ? 'text-text-100' : 'text-text-300'}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
