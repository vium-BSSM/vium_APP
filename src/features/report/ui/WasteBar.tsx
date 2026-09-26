import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface WasteBarProps {
  label: string;
  height: number;
  isHighlighted: boolean;
  index: number;
  // 값이 바뀌면 막대가 0부터 다시 자라남 (예: 선택한 월)
  animationKey: string;
}

const BAR_STAGGER_MS = 90;
const BAR_DURATION_MS = 700;

export const WasteBar: React.FC<WasteBarProps> = ({
  label,
  height,
  isHighlighted,
  index,
  animationKey,
}) => {
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = 0;
    animatedHeight.value = withDelay(
      index * BAR_STAGGER_MS,
      withTiming(height, { duration: BAR_DURATION_MS, easing: Easing.out(Easing.cubic) })
    );
  }, [animationKey, height, index]);

  const animatedStyle = useAnimatedStyle(() => ({ height: animatedHeight.value }));

  return (
    <View className="items-center gap-[15px]">
      {/* 막대가 자라는 동안 차트 높이가 흔들리지 않도록 영역 높이를 고정 */}
      <View className="h-[153px] justify-end">
        <Animated.View style={animatedStyle}>
          <View className={`flex-1 w-[49px] rounded-lg ${isHighlighted ? 'bg-primary-600' : 'bg-neutral-50'}`} />
        </Animated.View>
      </View>
      <Text className="text-text14 font-sans text-text-100">{label}</Text>
    </View>
  );
};
