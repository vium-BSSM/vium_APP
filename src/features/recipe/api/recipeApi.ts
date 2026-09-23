import { apiClient } from '@/shared/api/client';
import {
  RecipeListApiResponse,
  RecipeDetailApiResponse,
  RecipeCookCompleteRequest,
  RecipeCategory,
} from '../types';

export const getRecipes = async (category: RecipeCategory = '전체'): Promise<RecipeListApiResponse> => {
  const response = await apiClient.get<RecipeListApiResponse>('/api/me/recipes', {
    params: { category },
  });
  return response.data;
};

export const getRecipeDetail = async (recipeId: number): Promise<RecipeDetailApiResponse> => {
  const response = await apiClient.get<RecipeDetailApiResponse>(`/api/me/recipes/${recipeId}`);
  return response.data;
};

export const addRecipeIngredient = async (
  recipeId: number,
  ingredientCatalogId: number
): Promise<RecipeDetailApiResponse> => {
  const response = await apiClient.post<RecipeDetailApiResponse>(
    `/api/me/recipes/${recipeId}/ingredients`,
    { ingredientCatalogId }
  );
  return response.data;
};

export const completeRecipeCooking = async (
  recipeId: number,
  request: RecipeCookCompleteRequest
): Promise<{ success: boolean; error: null | { code: string; message: string } }> => {
  const response = await apiClient.post(`/api/me/recipes/${recipeId}/complete`, request);
  return response.data;
};
