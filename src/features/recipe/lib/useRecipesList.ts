import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { recipeListCache, RecipeListResult } from './recipeListCache';
import { RecipeCategory } from '../types';

export const useRecipesList = (category: RecipeCategory = '전체') => {
  const [result, setResult] = useState<RecipeListResult | undefined>(() => recipeListCache.getCached(category));
  const [isLoading, setIsLoading] = useState(!result);

  const loadRecipes = async (target: RecipeCategory, force: boolean, isActive: () => boolean = () => true) => {
    const cached = force ? undefined : recipeListCache.getCached(target);
    if (cached) {
      setResult(cached);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const next = await recipeListCache.load(target, force);
    if (!isActive()) return;
    setResult(next);
    setIsLoading(false);
  };

  // 탭 화면은 마운트된 채 유지되므로 포커스될 때마다 캐시를 확인 (재고 변경으로 무효화됐으면 새로 요청)
  // 카테고리를 빠르게 바꿀 때 이전 요청 결과가 늦게 도착해 덮어쓰지 않도록 무시
  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadRecipes(category, false, () => active);
      return () => {
        active = false;
      };
    }, [category])
  );

  return {
    recipes: result?.status === 'success' ? result.recipes : [],
    isLoading,
    error: result?.status === 'error' ? result.message : null,
    needsCatalogIngredients: result?.status === 'needsCatalogIngredients',
    refresh: () => loadRecipes(category, true),
  };
};
