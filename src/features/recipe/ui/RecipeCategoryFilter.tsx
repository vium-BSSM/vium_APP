import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { RecipeCategory } from '../types';

const CATEGORIES: RecipeCategory[] = ['전체', '한식', '양식', '일식', '디저트'];

interface RecipeCategoryFilterProps {
  selected: RecipeCategory;
  onSelect: (category: RecipeCategory) => void;
}

export const RecipeCategoryFilter: React.FC<RecipeCategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {CATEGORIES.map((category) => {
        const isActive = category === selected;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            className={`h-8 px-4 items-center justify-center rounded-2xl border-[3px] border-neutral-50 ${
              isActive ? 'bg-neutral-100' : 'bg-neutral-50'
            }`}
          >
            <Text className="text-text14 font-sans text-neutral-400">{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
