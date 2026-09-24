import { RECIPE_FIXTURES } from './recipeFixtures';

// 레시피 API 연동 전까지는 임시 데이터로 화면을 보여줍니다.
export const useRecipeDetail = (recipeId: number) => {
  const recipe = RECIPE_FIXTURES.find((item) => item.id === recipeId) || RECIPE_FIXTURES[0];

  return {
    recipe,
    isLoading: false,
    error: null as string | null,
  };
};
