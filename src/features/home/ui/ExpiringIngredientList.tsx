import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { ExpiringIngredient } from '@/features/fridge';
import { SectionTitle } from './SectionTitle';

const BADGE_COLORS: Record<ExpiringIngredient['status'], string> = {
  위험: 'bg-status-danger-bg',
  보통: 'bg-status-normal-bg',
  양호: 'bg-status-good-bg',
};

const BADGE_TEXT_COLORS: Record<ExpiringIngredient['status'], string> = {
  위험: 'text-status-danger-text',
  보통: 'text-status-normal-text',
  양호: 'text-status-good-text',
};

interface ExpiringIngredientListProps {
  ingredients: ExpiringIngredient[];
  onTitlePress: () => void;
  onItemPress: (id: number) => void;
}

export const ExpiringIngredientList: React.FC<ExpiringIngredientListProps> = ({
  ingredients,
  onTitlePress,
  onItemPress,
}) => {
  return (
    <View className="w-full gap-5">
      <SectionTitle title="소비기한이 얼마 남지 않았어요" onPress={onTitlePress} />

      {ingredients.length === 0 ? (
        <Text className="text-text-200 text-text14 font-sans px-2.5">임박한 식재료가 없어요</Text>
      ) : (
        <View className="gap-1">
          {ingredients.map((ingredient, index) => (
            <View key={ingredient.id} className="gap-1">
              <Pressable
                onPress={() => onItemPress(ingredient.id)}
                className="bg-white p-2.5 flex-row items-center justify-between active:bg-neutral-10"
              >
                <View className="gap-1">
                  <Text className="text-text-100 text-text15 font-sans">{ingredient.name}</Text>
                  <Text className="text-text-200 text-text12 font-sans">{ingredient.untilLabel}</Text>
                </View>
                <View className={`px-2.5 py-[5px] rounded ${BADGE_COLORS[ingredient.status]}`}>
                  <Text className={`text-text10 font-sans ${BADGE_TEXT_COLORS[ingredient.status]}`}>
                    {ingredient.ddayLabel}
                  </Text>
                </View>
              </Pressable>
              {index < ingredients.length - 1 && <View className="h-[2px] mx-[11px] bg-neutral-50" />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
