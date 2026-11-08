import React from 'react';
import { View, Pressable } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import HomeIcon from '@/../assets/icons/home-icon.svg';
import ChefIcon from '@/../assets/icons/chef-icon.svg';
import ReportIcon from '@/../assets/icons/report-icon.svg';
import SettingsIcon from '@/../assets/icons/settings-icon.svg';

type NavItem = 'home' | 'recipe' | 'report' | 'settings';

// 아이콘 전용 탭 (라벨 없음) — 라벨은 스크린리더용 accessibilityLabel로만 둔다
// size: 40x40 viewBox 아이콘(chef/report)은 여백이 있어 조금 크게 그려야 시각 크기가 맞는다
const navItems: { key: NavItem; label: string; route: string; Icon: any; size: number }[] = [
  { key: 'home', label: '홈', route: '/main', Icon: HomeIcon, size: 32 },
  { key: 'recipe', label: '레시피', route: '/recipe', Icon: ChefIcon, size: 36 },
  { key: 'report', label: '리포트', route: '/report', Icon: ReportIcon, size: 36 },
  { key: 'settings', label: '계정', route: '/mypage', Icon: SettingsIcon, size: 32 },
];

const isRouteActive = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export const NavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (route: string) => {
    if (pathname === route) return;
    // Tabs 안에서는 navigate가 기존 탭으로 전환 (push는 화면을 계속 쌓음)
    router.navigate(route as any);
  };

  return (
    <View className="bg-white border-t border-neutral-50 px-3 pt-3 pb-2.5 flex-row items-center">
      {navItems.map((item) => {
        const isActive = isRouteActive(pathname, item.route);
        const { Icon } = item;
        return (
          <Pressable
            key={item.key}
            onPress={() => handlePress(item.route)}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isActive }}
            className="items-center justify-center flex-1 h-10"
          >
            <Icon
              width={item.size}
              height={item.size}
              color={isActive ? '#333333' : '#C0C0C0'}
            />
          </Pressable>
        );
      })}
    </View>
  );
};
