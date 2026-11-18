import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line, Path } from 'react-native-svg';
import BackgroundCircle from '@/../assets/splash/background-circle.svg';
import CharacterTomato from '@/../assets/splash/character-tomato.svg';
import ShadowTomato from '@/../assets/splash/shadow-tomato.svg';

// Figma '토마토 진화' 프레임 기준 무대 크기 — 아래 좌표는 모두 이 무대 기준
const STAGE_WIDTH = 340;
const STAGE_HEIGHT = 400;

// 토마토 그룹 박스 (Figma 3006:625와 같은 크기). SVG는 테두리 두께만큼 박스보다 살짝 큼
const TOMATO = { left: 97, top: 150, width: 146.379, height: 156.405 };
const TOMATO_SVG = { left: 93.4, top: 147.17, width: 152.647, height: 162.504 };

// 단계별 머무는 시간(ms) — 1단계 → 2단계 → 3단계 → 다시 1단계로 줄어들며 반복
const STAGE_1_HOLD = 700;
const STAGE_2_HOLD = 1000;
const STAGE_3_HOLD = 1300;
const SHRINK_DURATION = 450;

const BOUNCY = { damping: 9, stiffness: 140, mass: 0.8 };

const GREEN = '#3CAB8E';
const DARK = '#3D3D3D';

// 알통 팔 (오른팔 기준). 어깨는 박스 안 (4, 100) 지점
const ARM_PATH =
  'M 0 82 C 2 30 58 22 60 64 L 56 34 C 50 12 64 0 78 2 C 96 4 102 20 96 36 L 94 84 C 96 106 80 116 60 112 C 40 118 15 116 0 110 Z';
const CURL_PATH = 'M 22 70 C 26 54 42 50 50 62';
const ARM_BOX = { width: 110, height: 126 };
const SHOULDER = { x: 4, y: 100 };

// 3단계(근육) 기준 어깨 위치와, 단계별로 어깨가 이동하는 거리·팔 크기
const ARMS = {
  right: {
    left: 242.6 - SHOULDER.x,
    top: 199 - SHOULDER.y,
    dx: [-42.6, -11.2, 0],
    dy: [16, 17.6, 0],
    mirror: false,
  },
  left: {
    left: 97.4 - (ARM_BOX.width - SHOULDER.x),
    top: 199 - SHOULDER.y,
    dx: [42.6, 11.6, 0],
    dy: [16, 17.6, 0],
    mirror: true,
  },
} as const;
const ARM_SCALE = [0.3, 0.55, 1];

const SWEAT_PATH = 'M 8 0 C 8 0 16 11 16 16 C 16 21 12.4 24 8 24 C 3.6 24 0 21 0 16 C 0 11 8 0 8 0 Z';
const SWEATS = [
  { left: 262, top: 140, scale: 1 },
  { left: 282, top: 172, scale: 0.7 },
];

const SPARKLE_PATH = 'M 50 0 L 62 38 L 100 50 L 62 62 L 50 100 L 38 62 L 0 50 L 38 38 Z';
const SPARKLES = [
  { left: 30, top: 70, size: 22 },
  { left: 300, top: 60, size: 18 },
  { left: 285, top: 300, size: 14 },
  { left: 40, top: 260, size: 16 },
];

const STEPS = [0, 1, 2];

const ArmShape: React.FC<{ mirror: boolean }> = ({ mirror }) => (
  <Svg width={ARM_BOX.width} height={ARM_BOX.height} viewBox="-4 -4 110 126">
    <Path
      d={ARM_PATH}
      fill="#FFFFFF"
      stroke={GREEN}
      strokeWidth={7}
      strokeLinejoin="round"
      transform={mirror ? 'translate(102 0) scale(-1 1)' : undefined}
    />
    <Path
      d={CURL_PATH}
      stroke={GREEN}
      strokeWidth={5}
      strokeLinecap="round"
      fill="none"
      transform={mirror ? 'translate(102 0) scale(-1 1)' : undefined}
    />
  </Svg>
);

const Arm: React.FC<{ side: keyof typeof ARMS; step: SharedValue<number> }> = ({ side, step }) => {
  const arm = ARMS[side];
  const originX = arm.mirror ? ARM_BOX.width - SHOULDER.x : SHOULDER.x;
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(step.value, [0, 0.6], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateX: interpolate(step.value, STEPS, arm.dx) },
      { translateY: interpolate(step.value, STEPS, arm.dy) },
      { scale: interpolate(step.value, STEPS, ARM_SCALE, Extrapolation.CLAMP) },
    ],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: arm.left,
          top: arm.top,
          width: ARM_BOX.width,
          height: ARM_BOX.height,
          transformOrigin: `${originX}px ${SHOULDER.y}px`,
        },
        style,
      ]}
    >
      <ArmShape mirror={arm.mirror} />
    </Animated.View>
  );
};

const Sweat: React.FC<{ index: number; step: SharedValue<number> }> = ({ index, step }) => {
  const sweat = SWEATS[index];
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(step.value, STEPS, [0, 1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(step.value, STEPS, [20, 0, 20], Extrapolation.CLAMP) }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: sweat.left, top: sweat.top }, style]}
    >
      <Svg width={16 * sweat.scale + 4} height={24 * sweat.scale + 4} viewBox="-2 -2 20 28">
        <Path d={SWEAT_PATH} fill="#C7EBFF" stroke="#59A6E6" strokeWidth={3} strokeLinejoin="round" />
      </Svg>
    </Animated.View>
  );
};

const Sparkle: React.FC<{ index: number; step: SharedValue<number> }> = ({ index, step }) => {
  const sparkle = SPARKLES[index];
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(step.value, [1.4, 2], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(step.value, [1.4, 2], [0, 1], Extrapolation.CLAMP) }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', left: sparkle.left, top: sparkle.top, width: sparkle.size, height: sparkle.size },
        style,
      ]}
    >
      <Svg width="100%" height="100%" viewBox="-8 -8 116 116">
        <Path d={SPARKLE_PATH} fill="#FFD94D" stroke="#ED9E1A" strokeWidth={12} strokeLinejoin="round" />
      </Svg>
    </Animated.View>
  );
};

interface TomatoEvolutionLoaderProps {
  message?: string;
}

/**
 * 레시피 상세 로딩 화면 — 토마토가 근육 토마토로 진화하는 연출을 로딩이 끝날 때까지 반복
 * (Figma '토마토 진화 / 1~3')
 */
export const TomatoEvolutionLoader: React.FC<TomatoEvolutionLoaderProps> = ({
  message = '레시피를 준비하고 있어요',
}) => {
  const step = useSharedValue(0);

  useEffect(() => {
    step.value = withRepeat(
      withSequence(
        withDelay(STAGE_1_HOLD, withSpring(1, BOUNCY)),
        withDelay(STAGE_2_HOLD, withSpring(2, BOUNCY)),
        withDelay(STAGE_3_HOLD, withTiming(0, { duration: SHRINK_DURATION })),
      ),
      -1,
    );
    return () => cancelAnimation(step);
  }, [step]);

  // 몸통은 발밑(그림자 위치)을 기준으로 옆으로 더 많이 부풂
  const tomatoStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: interpolate(step.value, STEPS, [1, 1, 1.22]) },
      { scaleY: interpolate(step.value, STEPS, [1, 1, 1.15]) },
    ],
  }));
  const browStyle = useAnimatedStyle(() => ({
    opacity: interpolate(step.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(step.value, [0, 1], [6, 0], Extrapolation.CLAMP) }],
  }));

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <View style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}>
          <View style={{ position: 'absolute', left: 25, top: 40 }}>
            <BackgroundCircle width={290} height={290} />
          </View>
          <View style={{ position: 'absolute', left: 115, top: 296 }}>
            <ShadowTomato width={110} height={16} />
          </View>

          {/* 팔은 몸통 뒤에서 튀어나오도록 토마토보다 먼저 그림 */}
          <Arm side="left" step={step} />
          <Arm side="right" step={step} />

          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                left: TOMATO.left,
                top: TOMATO.top,
                width: TOMATO.width,
                height: TOMATO.height,
                transformOrigin: 'bottom',
              },
              tomatoStyle,
            ]}
          >
            <View
              style={{
                position: 'absolute',
                left: TOMATO_SVG.left - TOMATO.left,
                top: TOMATO_SVG.top - TOMATO.top,
              }}
            >
              <CharacterTomato width={TOMATO_SVG.width} height={TOMATO_SVG.height} />
            </View>
            <Animated.View style={[{ position: 'absolute', left: 0, top: 0 }, browStyle]}>
              <Svg width={TOMATO.width} height={TOMATO.height}>
                <Line x1={33} y1={33} x2={53} y2={41} stroke={DARK} strokeWidth={7} strokeLinecap="round" />
                <Line x1={93} y1={36} x2={113} y2={28} stroke={DARK} strokeWidth={7} strokeLinecap="round" />
              </Svg>
            </Animated.View>
          </Animated.View>

          {SWEATS.map((_, i) => (
            <Sweat key={`sweat-${i}`} index={i} step={step} />
          ))}
          {SPARKLES.map((_, i) => (
            <Sparkle key={`sparkle-${i}`} index={i} step={step} />
          ))}
          <View className="absolute left-0 right-0 top-[340px] items-center gap-2">
            <Text className="text-text18 font-medium font-sans text-text-100 text-center">{message}</Text>
            <Text className="text-text14 font-sans text-text-300 text-center">잠시만 기다려 주세요</Text>
          </View>
      </View>
    </View>
  );
};
