import { useEffect, useState } from 'react';
import { getRecipes } from '../api/recipeApi';
import { RECIPE_LIST_FIXTURES } from './recipeFixtures';
import { RecipeCategory, RecipeListItem } from '../types';

export const useRecipesList = (category: RecipeCategory = '전체') => {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getRecipes(category);

      if (response.success && response.data) {
        setRecipes(response.data.recipes);
      } else {
        setError(response.error?.message || '레시피를 불러올 수 없습니다.');
      }
    } catch (err) {
      // 레시피 API 연동 전까지는 임시 데이터로 화면을 보여줍니다.
      console.error('Failed to load recipes:', err);
      setRecipes(RECIPE_LIST_FIXTURES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [category]);

  const filtered = recipes.filter((recipe) => category === '전체' || recipe.category === category);

  return {
    recipes: filtered,
    isLoading,
    error,
    refresh: loadRecipes,
  };
};
