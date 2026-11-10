import { apiClient } from '@/shared/api/client';
import {
  RecipeCategoryCode,
  RecipeCompleteRequest,
  RecipeDetailApiResponse,
  RecommendedRecipesApiResponse,
} from '../types';

// AI 생성으로 수 초 걸리지만, 응답이 끝내 오지 않으면 진행 중 요청이 영원히 남아 다시 요청하지 못하므로 제한
const RECOMMEND_TIMEOUT_MS = 60 * 1000;

export const getRecommendedRecipes = async (
  category: RecipeCategoryCode = 'ALL'
): Promise<RecommendedRecipesApiResponse> => {
  const response = await apiClient.get<RecommendedRecipesApiResponse>('/api/me/recipes/recommended', {
    params: { category },
    timeout: RECOMMEND_TIMEOUT_MS,
  });
  return response.data;
};

// 상세 최초 열람 시 서버가 AI로 분량·양념·단계를 보강하느라 수 초 걸릴 수 있음
const DETAIL_TIMEOUT_MS = 60 * 1000;

export const getRecipeDetail = async (recipeId: number): Promise<RecipeDetailApiResponse> => {
  const response = await apiClient.get<RecipeDetailApiResponse>(`/api/me/recipes/${recipeId}`, {
    timeout: DETAIL_TIMEOUT_MS,
  });
  return response.data;
};

export const completeRecipe = async (recipeId: number, request: RecipeCompleteRequest): Promise<void> => {
  await apiClient.post(`/api/me/recipes/${recipeId}/complete`, request);
};
