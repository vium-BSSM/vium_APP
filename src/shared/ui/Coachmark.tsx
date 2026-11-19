import React, { ReactNode, RefObject, useEffect, useState } from 'react';
import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';

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
// 강조 테두리 둥근 정도(rounded-2xl)와, 화면 끝까지 덮을 만큼의 어두운 테두리 두께
const SPOT_RADIUS = 16;
const DIM_SPREAD = 3000;

/**
 * 화면별 튜토리얼 말풍선 — 배경을 어둡게 깔고 강조 영역만 밝게 남긴 뒤
 * 캐릭터와 말풍선으로 설명. 단계마다 "다음", 마지막은 "알겠어"
 */
export const Coachmark: React.FC<CoachmarkProps> = ({ visible, steps, onFinish }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  // 강조 영역을 못 잰 경우(화면에 없음 등) — 말풍선만 가운데에 띄움
  const [isUnmeasurable, setIsUnmeasurable] = useState(false);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  // 단계가 바뀔 때마다 강조 영역 위치를 다시 잼 (레이아웃이 끝난 뒤 재도록 한 프레임 미룸)
  useEffect(() => {
    if (!visible || !step) return;
    setRect(null);
    setIsUnmeasurable(false);
    const frame = requestAnimationFrame(() => {
      const target = step.targetRef.current;
      if (!target) {
        setIsUnmeasurable(true);
        return;
      }
      target.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) setRect({ x, y, width, height });
        else setIsUnmeasurable(true);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, index, step, screenWidth, screenHeight]);

  useEffect(() => {
    if (!visible) setIndex(0);
  }, [visible]);

  if (!visible || !step) return null;

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
      <View className="flex-1">
        {spot ? (
          <>
            {/* 아주 두꺼운 테두리로 바깥을 어둡게 — 안쪽 구멍이 둥글어 모서리가 삐져나오지 않음 */}
            <View
              pointerEvents="none"
              className="absolute border-black/50"
              style={{
                left: spot.left - DIM_SPREAD,
                top: spot.top - DIM_SPREAD,
                width: spot.right - spot.left + DIM_SPREAD * 2,
                height: spot.bottom - spot.top + DIM_SPREAD * 2,
                borderWidth: DIM_SPREAD,
                borderRadius: SPOT_RADIUS + DIM_SPREAD,
              }}
            />
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
            {isUnmeasurable && <View className="flex-row items-end gap-1.5">{bubble}</View>}
          </View>
        )}
      </View>
    </Modal>
  );
};
