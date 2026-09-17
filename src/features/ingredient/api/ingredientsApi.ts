import { apiClient } from '@/shared/api/client';
import {
  IngredientsListApiResponse,
  IngredientRegisterRequest,
  IngredientRegisterApiResponse,
} from '../types';

/**
 * GET /api/me/ingredients
 * 사용자의 냉장고 재료 목록 조회
 */
export const getIngredients = async (expiringSoon: boolean = false): Promise<IngredientsListApiResponse> => {
  const response = await apiClient.get<IngredientsListApiResponse>('/api/me/ingredients', {
    params: { expiringSoon },
  });
  return response.data;
};

/**
 * POST /api/me/ingredients
 * 새 재료 등록
 */
export const registerIngredient = async (
  request: IngredientRegisterRequest
): Promise<IngredientRegisterApiResponse> => {
  const response = await apiClient.post<IngredientRegisterApiResponse>('/api/me/ingredients', request);
  return response.data;
};
