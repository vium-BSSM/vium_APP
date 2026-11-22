import React, { ReactNode, RefObject, useEffect, useState } from 'react';
import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getAppFrame } from '../lib/appFrame';

export interface CoachmarkStep {
  // 강조할 영역 — measureInWindow로 위치를 잼
  targetRef: RefObject<View | null>;
  // 말하는 캐릭터 이름 (예: '감자')
  speaker: string;
  message: string;
  // 말풍선 옆에 서 있는 캐릭터 그림
  character: ReactNode;
}

interface CoachmarkProps {
  visible: boolean;
  steps: CoachmarkStep[];
  // 끝까지 봤거나 건너뛰었을 때
  onFinish: () => void;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Figma Coachmark: 강조 영역 바깥 여백(좌우 12·상하 10), 말풍선과 간격 16
const SPOT_PAD_X = 12;
const SPOT_PAD_Y = 10;
const BUBBLE_GAP = 16;
const SIDE_MARGIN = 20;
// 강조 테두리 둥근 정도 (rounded-2xl)
const SPOT_RADIUS = 16;

// 화면 전체 사각형 + 강조 영역 둥근 사각형 (evenodd로 안쪽이 뚫림)
const dimPath = (
  width: number,
  height: number,
  spot: { left: number; top: number; right: number; bottom: number }
) => {
  const { left, top, right, bottom } = spot;
  const r = Math.min(SPOT_RADIUS, (right - left) / 2, (bottom - top) / 2);
  return [
    `M0 0H${width}V${height}H0Z`,
    `M${left + r} ${top}H${right - r}A${r} ${r} 0 0 1 ${right} ${top + r}`,
    `V${bottom - r}A${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `H${left + r}A${r} ${r} 0 0 1 ${left} ${bottom - r}`,
    `V${top + r}A${r} ${r} 0 0 1 ${left + r} ${top}Z`,
  ].join('');
};
type BoxReader = { getBoundingClientRect?: () => { x: number; y: number; width: number; height: number } };

// 창 기준 위치를 바로(동기) 읽음 — 새 아키텍처·웹 모두 getBoundingClientRect 지원
// measureInWindow는 콜백이 늦게 와서 어두운 배경만 깔리거나 튜토리얼이 늦게 뜨는 문제가 있었음
const measureTarget = (target: View | null): Rect | null => {
  const reader = target as unknown as BoxReader | null;
  if (!reader || typeof reader.getBoundingClientRect !== 'function') return null;
  const { x, y, width, height } = reader.getBoundingClientRect();
  return width > 0 && height > 0 ? { x, y, width, height } : null;
};

/**
 * 화면별 튜토리얼 말풍선 — 배경을 어둡게 깔고 강조 영역만 밝게 남긴 뒤
 * 캐릭터와 말풍선으로 설명. 단계마다 "다음", 마지막은 "알겠어"
 */
export const Coachmark: React.FC<CoachmarkProps> = ({ visible, steps, onFinish }) => {
  const windowSize = useWindowDimensions();
  const [index, setIndex] = useState(0);
  // 단계별 강조 영역 (오버레이 기준 좌표, 못 재면 null) — 다 잰 뒤에 모달을 띄움
  const [layout, setLayout] = useState<{ rects: (Rect | null)[]; width: number; height: number } | null>(null);

  // 모달을 띄우기 전에 모든 단계의 위치를 한 번에 잼
  // (앱에서 모달이 떠 있는 동안 재면 콜백이 늦게 와서 어두운 배경만 깔리고 터치해야 말풍선이 뜸)
  useEffect(() => {
    if (!visible) {
      setLayout(null);
      setIndex(0);
      return;
    }
    // 레이아웃이 끝난 뒤 재도록 한 프레임 미룸
    const raf = requestAnimationFrame(() => {
      const frame = getAppFrame(windowSize.width, windowSize.height);
      setLayout({
        rects: steps.map((item) => {
          const rect = measureTarget(item.targetRef.current);
          return rect && { ...rect, x: rect.x - frame.x, y: rect.y - frame.y };
        }),
        width: frame.width,
        height: frame.height,
      });
    });
    return () => cancelAnimationFrame(raf);
    // steps는 렌더마다 새 배열이라 길이만 의존
  }, [visible, steps.length, windowSize.width, windowSize.height]);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  if (!visible || !step || !layout) return null;

  const screenWidth = layout.width;
  const screenHeight = layout.height;
  const rect = layout.rects[index] ?? null;

  const handleNext = () => {
    if (isLast) {
      onFinish();
      return;
    }
    setIndex((prev) => prev + 1);
  };

  const spot = rect && {
    left: Math.max(rect.x - SPOT_PAD_X, 0),
    top: Math.max(rect.y - SPOT_PAD_Y, 0),
    right: Math.min(rect.x + rect.width + SPOT_PAD_X, screenWidth),
    bottom: Math.min(rect.y + rect.height + SPOT_PAD_Y, screenHeight),
  };
  // 강조 영역이 화면 위쪽에 있으면 말풍선을 아래에, 아니면 위에
  const placeBelow = spot ? (spot.top + spot.bottom) / 2 < screenHeight / 2 : true;

  const bubble = (
    <>
      <View className="w-[72px] h-[78px] items-center justify-end">{step.character}</View>
      <View className="flex-1 bg-white rounded-[18px] px-[18px] py-4 gap-2">
        <Text className="text-text12 font-medium font-sans text-primary-700">
          {step.speaker}
          {steps.length > 1 ? ` · ${index + 1}/${steps.length}` : ''}
        </Text>
        <Text className="text-text15 font-sans text-text-100 leading-[22px]">{step.message}</Text>
        <View className="flex-row items-center justify-end">
          {!isLast && (
            <Pressable onPress={onFinish} hitSlop={8} className="flex-1">
              <Text className="text-text13 font-sans text-text-300">건너뛰기</Text>
            </Pressable>
          )}
          <Pressable onPress={handleNext} className="bg-primary-500 rounded-full px-4 py-[7px]">
            <Text className="text-text13 font-medium font-sans text-text-100">
              {isLast ? '알겠어' : '다음'}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onFinish}>
      <View className="flex-1 overflow-hidden">
        {spot ? (
          <>
            {/* 화면 전체 어두운 사각형에서 강조 영역(둥근 사각형)만 뚫음 — 아주 큰 뷰는 iOS에서 그려지지 않아 SVG 사용 */}
            <Svg pointerEvents="none" width={screenWidth} height={screenHeight} style={{ position: 'absolute', left: 0, top: 0 }}>
              <Path d={dimPath(screenWidth, screenHeight, spot)} fill="black" fillOpacity={0.5} fillRule="evenodd" />
            </Svg>
            <View
              pointerEvents="none"
              className="absolute rounded-2xl border-[3px] border-primary-500"
              style={{ left: spot.left, top: spot.top, width: spot.right - spot.left, height: spot.bottom - spot.top }}
            />

            <View
              className="absolute flex-row items-end gap-1.5"
              style={
                placeBelow
                  ? { left: SIDE_MARGIN, right: SIDE_MARGIN, top: spot.bottom + BUBBLE_GAP }
                  : { left: SIDE_MARGIN, right: SIDE_MARGIN, bottom: screenHeight - spot.top + BUBBLE_GAP }
              }
            >
              {bubble}
            </View>
          </>
        ) : (
          <View className="flex-1 bg-black/50 justify-center px-5">
            <View className="flex-row items-end gap-1.5">{bubble}</View>
          </View>
        )}
      </View>
    </Modal>
  );
};
