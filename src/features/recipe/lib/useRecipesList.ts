import { RECIPE_LIST_FIXTURES } from './recipeFixtures';
import { RecipeCategory } from '../types';

// 레시피 API 연동 전까지는 임시 데이터로 화면을 보여줍니다.
export const useRecipesList = (category: RecipeCategory = '전체') => {
  const recipes = RECIPE_LIST_FIXTURES.filter(
    (recipe) => category === '전체' || recipe.category === category
  );

  return {
    recipes,
    isLoading: false,
    error: null as string | null,
  };
};
