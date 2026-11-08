import React from 'react';
import { View } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavBar } from './NavBar';

// 하단 탭을 보여줄 화면 (추가/정리/수정 같은 작업 화면에서는 숨김)
const VISIBLE_PATTERNS = [
  /^\/main$/,
  /^\/report$/,
  /^\/fridge$/,
  /^\/fridge\/\d+$/,
  /^\/recipe$/,
  /^\/mypage$/,
];

/**
 * (tabs) 레이아웃의 커스텀 tabBar
 * 화면 바닥에 붙는(docked) 디자인. 홈 인디케이터 영역(safe area)까지 흰 배경으로 채운다
 * absolute로 배치하므로 각 화면은 하단 여백으로 공간 확보
 */
export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  if (!VISIBLE_PATTERNS.some((pattern) => pattern.test(pathname))) return null;

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white"
      style={{ paddingBottom: insets.bottom }}
    >
      <NavBar />
    </View>
  );
};
