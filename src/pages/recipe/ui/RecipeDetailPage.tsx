import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { RecipeDetailPage as RecipeDetailPageFeature } from '@/features/recipe';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);

  return <RecipeDetailPageFeature recipeId={recipeId} />;
};
