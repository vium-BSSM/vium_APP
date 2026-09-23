import React from 'react';
import { Text, View } from 'react-native';
import FireIcon from '@/../assets/icons/fire-icon.svg';
import { RecipeStep } from '../types';

interface RecipeStepCardProps {
  step: RecipeStep;
}

export const RecipeStepCard: React.FC<RecipeStepCardProps> = ({ step }) => {
  return (
    <View className="w-full bg-white border border-neutral-100 rounded-lg p-2.5 gap-[11px]">
      <View className="flex-row items-center gap-2">
        <FireIcon width={16} height={16} color="#151515" />
        <Text className="text-text16 font-medium font-sans text-neutral-800">Step {step.step}</Text>
      </View>
      <Text className="text-text14 font-sans text-neutral-700">{step.description}</Text>
    </View>
  );
};
