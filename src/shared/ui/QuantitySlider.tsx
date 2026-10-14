import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import TooltipArrowIcon from '@/../assets/icons/tooltip-arrow-icon.svg';

interface QuantitySliderProps {
  value: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
}

// 네이티브 슬라이더 thumb 지름 — 트랙 양 끝이 thumb 반지름만큼 안쪽에서 시작함
const THUMB_SIZE = Platform.OS === 'ios' ? 31 : 20;
const TOOLTIP_WIDTH = 40;
// 손을 뗀 뒤 말풍선을 보여주는 시간
const TOOLTIP_VISIBLE_MS = 1500;

// 수량이 적으면 0.5 단위, 많으면 1 단위로 조정
const getStep = (max: number) => (max <= 10 ? 0.5 : 1);

const formatNumber = (value: number) => Number(value.toFixed(2)).toString();

export const QuantitySlider: React.FC<QuantitySliderProps> = ({ value, max, unit = '', onChange }) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = getStep(max);
  const ratio = max > 0 ? value / max : 0;
  const thumbCenter = THUMB_SIZE / 2 + ratio * (trackWidth - THUMB_SIZE);

  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  const showTooltip = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = null;
    Animated.timing(tooltipOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  // 조작이 끝나고 1.5초 뒤 서서히 사라짐 (다시 조작하면 타이머 초기화)
  const hideTooltipLater = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      Animated.timing(tooltipOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }, TOOLTIP_VISIBLE_MS);
  };

  // 최대 수량이 step 배수가 아니어도 끝까지 갈 수 있도록 slider step은 쓰지 않고 직접 반올림
  const handleValueChange = (raw: number) => {
    showTooltip();
    onChange(raw >= max ? max : Math.min(max, Math.round(raw / step) * step));
  };

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-text12 font-sans text-neutral-400">0</Text>
        <Text className="text-text12 font-sans text-neutral-400">
          {formatNumber(max)}
          {unit}
        </Text>
      </View>
      <View onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}>
        {trackWidth > 0 && (
          <View
            pointerEvents="none"
            className="absolute bottom-full"
            style={{ left: thumbCenter - TOOLTIP_WIDTH / 2, width: TOOLTIP_WIDTH, transform: [{ translateY: 6 }] }}
          >
            <Animated.View style={{ opacity: tooltipOpacity }}>
              <View className="items-center">
                <View className="z-10 w-full items-center rounded bg-neutral-500 px-[5px] py-1.5">
                  <Text className="text-text12 font-sans text-text-400">{formatNumber(value)}</Text>
                </View>
                <View className="-mt-[3px] rotate-180">
                  <TooltipArrowIcon width={11.5} height={10.25} />
                </View>
              </View>
            </Animated.View>
          </View>
        )}
        <Slider
          minimumValue={0}
          maximumValue={max}
          value={value}
          disabled={max <= 0}
          minimumTrackTintColor="#A2CD87"
          maximumTrackTintColor="#EBEBEB"
          thumbTintColor="#EBEBEB"
          onSlidingStart={showTooltip}
          onValueChange={handleValueChange}
          onSlidingComplete={hideTooltipLater}
        />
      </View>
    </View>
  );
};
