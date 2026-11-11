import React from 'react';
import { Pressable, Text, View } from 'react-native';
import CheckIcon from '@/../assets/icons/check-icon.svg';
import { RecipeStep } from '../types';

interface RecipeStepCardProps {
  step: RecipeStep;
  isDone: boolean;
  /** 지금 할 단계 (완료 안 한 첫 단계) */
  isCurrent: boolean;
  isLast: boolean;
  onPress: () => void;
}

// 번호 원과 체크 아이콘을 같은 크기로 맞춤 (w-8은 네이티브에서 rem 기준이라 32px가 아닐 수 있음)
const MARKER_SIZE = 32;

/** 조리 단계 타임라인 한 줄: 왼쪽 번호 원 + 세로 연결선 */
export const RecipeStepCard: React.FC<RecipeStepCardProps> = ({
  step,
  isDone,
  isCurrent,
  isLast,
  onPress,
}) => {
  const circleClass = isCurrent ? 'bg-primary-600' : 'bg-primary-200';
  const numberClass = isCurrent ? 'text-white' : 'text-primary-700';
  // 굵기를 바꾸면 글자 폭이 달라져 줄바꿈·높이가 변하므로 색으로만 구분
  const textClass = isDone ? 'text-text-300' : isCurrent ? 'text-text-100' : 'text-text-200';

  return (
    <Pressable
      onPress={onPress}
      disabled={!isDone && !isCurrent}
      className="w-full flex-row gap-4"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone, disabled: !isDone && !isCurrent }}
      accessibilityLabel={`${step.step}단계`}
    >
      <View className="items-center w-[32px]">
        {isDone ? (
          <CheckIcon width={MARKER_SIZE} height={MARKER_SIZE} />
        ) : (
          <View className={`w-[32px] h-[32px] rounded-full items-center justify-center ${circleClass}`}>
            <Text className={`text-text15 font-semibold font-sans ${numberClass}`}>{step.step}</Text>
          </View>
        )}
        {!isLast && (
          <View className={`flex-1 w-0.5 my-1 rounded-full ${isDone ? 'bg-primary-500' : 'bg-neutral-50'}`} />
        )}
      </View>

      <View className={`flex-1 pt-1 ${isLast ? '' : 'pb-7'}`}>
        <Text className={`text-text16 leading-body font-sans ${textClass}`}>{step.description}</Text>
      </View>
    </Pressable>
  );
};
