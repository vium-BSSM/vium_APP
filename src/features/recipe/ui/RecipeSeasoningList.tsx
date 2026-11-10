import React from 'react';
import { Text, View } from 'react-native';
import { RecipeSeasoning } from '../types';

interface RecipeSeasoningListProps {
  seasonings: RecipeSeasoning[];
}

/** 기본 양념 칩 목록 (이름 + 1인분 분량) */
export const RecipeSeasoningList: React.FC<RecipeSeasoningListProps> = ({ seasonings }) => (
  <View className="flex-row flex-wrap gap-2">
    {seasonings.map((seasoning, index) => (
      <View
        key={`${seasoning.name}-${index}`}
        className="flex-row items-center gap-1.5 rounded-full bg-neutral-10 px-3 py-1.5"
      >
        <Text className="text-text12 font-sans text-text-100">{seasoning.name}</Text>
        <Text className="text-text12 font-sans text-text-300">{seasoning.amount}</Text>
      </View>
    ))}
  </View>
);
