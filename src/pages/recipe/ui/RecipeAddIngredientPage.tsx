import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { RecipeAddIngredientPage as RecipeAddIngredientPageFeature } from '@/features/recipe';

export const RecipeAddIngredientPage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);

  return <RecipeAddIngredientPageFeature recipeId={recipeId} />;
};
