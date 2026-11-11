import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { RecipeStep } from '../types';
import { RecipeStepCard } from './RecipeStepCard';

interface RecipeStepListProps {
  steps: RecipeStep[];
}

/**
 * 조리 단계 타임라인. 순서대로만 완료할 수 있다.
 * - 지금 단계를 누르면 완료 → 다음 단계가 강조됨
 * - 완료한 단계를 누르면 그 단계부터 다시 진행 (뒤 단계 완료도 해제)
 * - 아직 차례가 아닌 단계는 누를 수 없음
 * 완료 상태는 화면 안에서만 유지 (서버 저장 없음).
 * 단계 목록이 바뀌면(기본 → AI 보강) 부모에서 key를 바꿔 초기화한다.
 */
export const RecipeStepList: React.FC<RecipeStepListProps> = ({ steps }) => {
  // 앞에서부터 완료한 단계 수 (= 지금 단계의 index)
  const [doneCount, setDoneCount] = useState(0);

  const handlePress = (index: number) => {
    if (index < doneCount) setDoneCount(index);
    else if (index === doneCount) setDoneCount(index + 1);
  };

  return (
    <View className="gap-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-text14 font-sans text-text-300">단계를 누르면 완료로 표시돼요</Text>
        <Text className="text-text14 font-medium font-sans text-primary-700">
          {doneCount}/{steps.length}
        </Text>
      </View>

      <View>
        {steps.map((step, index) => (
          <RecipeStepCard
            key={step.step}
            step={step}
            isDone={index < doneCount}
            isCurrent={index === doneCount}
            isLast={index === steps.length - 1}
            onPress={() => handlePress(index)}
          />
        ))}
      </View>
    </View>
  );
};
