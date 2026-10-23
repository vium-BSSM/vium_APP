import React from 'react';
import { Text, View } from 'react-native';
import FireIcon from '@/../assets/icons/fire-icon.svg';
import { RecipeStep } from '../types';

interface RecipeStepCardProps {
  step: RecipeStep;
}

export const RecipeStepCard: React.FC<RecipeStepCardProps> = ({ step }) => {
  return (
    <View className="w-full bg-neutral-10 rounded-lg p-2.5 gap-[11px]">
      <View className="flex-row items-center gap-2">
        <FireIcon width={16} height={16} color="#B2E194" />
        <Text className="text-text16 font-sans text-text-100">Step {step.step}</Text>
      </View>
      <Text className="text-text16 font-sans text-text-100">{step.description}</Text>
    </View>
  );
};
