import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { RecipeWastePage as RecipeWastePageFeature } from '@/features/recipe';
import { BottomNavigation } from '@/widgets';

export const RecipeWastePage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);

  return (
    <View className="flex-1 bg-white">
      <RecipeWastePageFeature recipeId={recipeId} />
      <BottomNavigation />
    </View>
  );
};
