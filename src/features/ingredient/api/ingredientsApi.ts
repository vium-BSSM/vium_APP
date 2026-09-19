import { apiClient } from '@/shared/api/client';
import {
  IngredientsListApiResponse,
  IngredientRegisterRequest,
  IngredientRegisterApiResponse,
} from '../types';


export const getIngredients = async (expiringSoon: boolean = false): Promise<IngredientsListApiResponse> => {
  const response = await apiClient.get<IngredientsListApiResponse>('/api/me/ingredients', {
    params: { expiringSoon },
  });
  return response.data;
};


export const registerIngredient = async (
  request: IngredientRegisterRequest
): Promise<IngredientRegisterApiResponse> => {
  const response = await apiClient.post<IngredientRegisterApiResponse>('/api/me/ingredients', request);
  return response.data;
};
