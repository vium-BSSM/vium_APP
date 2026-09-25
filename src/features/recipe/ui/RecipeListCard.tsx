import React from 'react';
import { Pressable, Text, View } from 'react-native';
import BackIcon from '@/../assets/icons/back-icon.svg';
import { RecipeListItem } from '../types';

interface RecipeListCardProps {
  recipe: RecipeListItem;
  onPress?: () => void;
}

export const RecipeListCard: React.FC<RecipeListCardProps> = ({ recipe, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="w-full bg-white border-2 border-neutral-100 rounded-lg p-5 gap-[34px]"
    >
      <View className="flex-row items-center justify-between w-full">
        <Text className="text-subtitle font-medium font-sans text-black">{recipe.title}</Text>
        <View className="w-6 h-6 items-center justify-center rotate-180">
          <BackIcon width={24} height={24} color="#242529" />
        </View>
      </View>

      <View className="gap-[7px]">
        <Text className="text-[13px] font-sans text-neutral-300">
          조리시간 <Text className="text-[14px] font-medium font-sans text-neutral-500">{recipe.cookTimeMinutes}분</Text>
        </Text>
        <View className="flex-row items-center gap-1">
          {recipe.tags.map((tag) => (
            <Text key={tag} className="text-[11px] font-sans text-neutral-400">
              {tag}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
};
