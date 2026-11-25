import { apiClient } from '@/shared/api/client';
import {
  IngredientsListApiResponse,
  IngredientDetailApiResponse,
  IngredientRegisterRequest,
  IngredientRegisterApiResponse,
  IngredientStatusUpdateRequest,
  IngredientStatusUpdateApiResponse,
  IngredientUpdateRequest,
  IngredientUpdateApiResponse,
  IngredientImageUploadApiResponse,
} from '../types';


export const getIngredients = async (expiringSoon: boolean = false): Promise<IngredientsListApiResponse> => {
  const response = await apiClient.get<IngredientsListApiResponse>('/api/me/ingredients', {
    params: { expiringSoon },
  });
  return response.data;
};


export const getIngredientDetail = async (ingredientId: number): Promise<IngredientDetailApiResponse> => {
  const response = await apiClient.get<IngredientDetailApiResponse>(`/api/me/ingredients/${ingredientId}`);
  return response.data;
};


export const registerIngredient = async (
  request: IngredientRegisterRequest
): Promise<IngredientRegisterApiResponse> => {
  const response = await apiClient.post<IngredientRegisterApiResponse>('/api/me/ingredients', request);
  return response.data;
};


export const updateIngredientStatus = async (
  ingredientId: number,
  request: IngredientStatusUpdateRequest
): Promise<IngredientStatusUpdateApiResponse> => {
  const response = await apiClient.patch<IngredientStatusUpdateApiResponse>(
    `/api/me/ingredients/${ingredientId}/status`,
    request
  );
  return response.data;
};


export const updateIngredient = async (
  ingredientId: number,
  request: IngredientUpdateRequest
): Promise<IngredientUpdateApiResponse> => {
  const response = await apiClient.patch<IngredientUpdateApiResponse>(
    `/api/me/ingredients/${ingredientId}`,
    request
  );
  return response.data;
};


/** 재료 사진 업로드. 받은 imageId를 등록·수정 요청에 같이 보냄 */
export const uploadIngredientImage = async (uri: string): Promise<IngredientImageUploadApiResponse> => {
  const formData = new FormData();
  // React Native FormData는 { uri, name, type } 객체로 파일을 받음
  formData.append('file', { uri, name: 'ingredient.jpg', type: 'image/jpeg' } as unknown as Blob);
  formData.append('purpose', 'INGREDIENT');

  const response = await apiClient.post<IngredientImageUploadApiResponse>('/api/me/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
