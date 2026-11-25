import { apiClient } from '@/shared/api/client';
import { EstimateExpiryApiResponse, IngredientCatalogSearchApiResponse } from '../types';

export const searchIngredientCatalog = async (keyword: string): Promise<IngredientCatalogSearchApiResponse> => {
  const response = await apiClient.get<IngredientCatalogSearchApiResponse>('/api/ingredient-catalogs', {
    params: { keyword },
  });
  return response.data;
};

/** 재료·보관방법·구매일로 소비기한 기본값 추정 (보관방법·구매일은 생략 가능, 구매일은 미래 불가) */
export const estimateExpiry = async (params: {
  ingredientCatalogId: number;
  storageMethodId?: number;
  purchasedOn?: string;
}): Promise<EstimateExpiryApiResponse> => {
  const response = await apiClient.get<EstimateExpiryApiResponse>('/api/ingredients/estimate-expiry', { params });
  return response.data;
};
