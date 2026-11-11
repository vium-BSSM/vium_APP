import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Button } from '@/shared/ui';
import { SplashArtboard, SplashScene } from '../ui/SplashScene';

/**
 * 로그인 전 시작 화면 (Figma splash2 104:1606).
 * 실행 애니메이션의 마지막 장면과 같은 배치라, 애니메이션이 끝나면 버튼만 새로 나타나는 것처럼 이어짐.
 * Figma에서 화면 전체가 링크라 아무 데나 눌러도 시작
 */
export const SplashPage = () => {
  // 애니메이션 끝 상태로 고정
  const finalProgress = useSharedValue(1);
  const handleStart = () => router.push('/login');

  return (
    <Pressable className="flex-1" onPress={handleStart} accessibilityRole="button" accessibilityLabel="눌러서 시작하기">
      <SplashArtboard>
        <SplashScene progress={finalProgress} withIntro={false} />
        {/* Figma 기준 위치: x 51.5, y 755.8 */}
        <View className="absolute left-[51.5px] top-[755.8px]">
          <Button onPress={handleStart}>눌러서 시작하기</Button>
        </View>
      </SplashArtboard>
    </Pressable>
  );
};
