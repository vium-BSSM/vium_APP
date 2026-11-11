import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { SPLASH_DURATION_MS } from '../lib/splashTimeline';
import { SplashArtboard, SplashScene } from './SplashScene';

// 애니메이션이 끝나면 아래 화면(시작 화면 또는 메인)으로 디졸브 (HANDOFF 4-G)
const DISSOLVE_MS = 300;
const EASE_OUT = Easing.bezier(0, 0, 0.58, 1);

/**
 * 앱 실행 시마다 한 번 재생되는 스플래시 애니메이션 (Figma splash 1236:1550).
 * 라우터 위에 덮어서 그리므로, 그동안 아래에서는 로그인 여부에 맞는 화면이 미리 준비됨.
 * 시스템 '동작 줄이기'가 켜져 있으면 건너뜀
 */
export const LaunchSplash = () => {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(!reduceMotion);
  const progress = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);

  useEffect(() => {
    if (!isVisible) return;
    progress.value = withTiming(1, { duration: SPLASH_DURATION_MS, easing: Easing.linear });
    overlayOpacity.value = withDelay(
      SPLASH_DURATION_MS,
      withTiming(0, { duration: DISSOLVE_MS, easing: EASE_OUT }, (finished) => {
        if (finished) scheduleOnRN(setIsVisible, false);
      })
    );
    // 처음 한 번만 재생
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  if (!isVisible) return null;

  return (
    // 화면 전체를 덮어 재생 중에는 아래 화면이 눌리지 않게 함 (Animated.View는 className의 inset이 적용되지 않아 style로 지정)
    <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
      <SplashArtboard>
        <SplashScene progress={progress} />
      </SplashArtboard>
    </Animated.View>
  );
};
