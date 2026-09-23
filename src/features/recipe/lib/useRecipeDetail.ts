import { useEffect, useState } from 'react';
import { getRecipeDetail } from '../api/recipeApi';
import { RECIPE_FIXTURES } from './recipeFixtures';
import { RecipeDetail } from '../types';

export const useRecipeDetail = (recipeId: number) => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipeDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRecipeDetail(recipeId);

      if (response.success && response.data) {
        setRecipe(response.data);
      } else {
        setError(response.error?.message || '레시피를 불러올 수 없습니다.');
      }
    } catch (err) {
      // 레시피 API 연동 전까지는 임시 데이터로 화면을 보여줍니다.
      console.error('Failed to load recipe detail:', err);
      const fallback = RECIPE_FIXTURES.find((item) => item.id === recipeId) || RECIPE_FIXTURES[0];
      setRecipe(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipeDetail();
  }, [recipeId]);

  return {
    recipe,
    isLoading,
    error,
    refresh: loadRecipeDetail,
  };
};
