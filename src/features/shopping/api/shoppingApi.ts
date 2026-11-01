import { apiClient } from '@/shared/api/client';
import {
  ShoppingHelperApiResponse,
  ShoppingListApiResponse,
  ShoppingListItemDeleteApiResponse,
  ShoppingListItemCreateRequest,
  ShoppingListItemSingleApiResponse,
  ShoppingListItemUpdateRequest,
} from '../types';

export const getShoppingHelper = async (): Promise<ShoppingHelperApiResponse> => {
  const response = await apiClient.get<ShoppingHelperApiResponse>('/api/me/shopping-helper');
  return response.data;
};

export const getShoppingList = async (): Promise<ShoppingListApiResponse> => {
  const response = await apiClient.get<ShoppingListApiResponse>('/api/me/shopping-list-items');
  return response.data;
};

export const addShoppingListItem = async (
  request: ShoppingListItemCreateRequest
): Promise<ShoppingListItemSingleApiResponse> => {
  const response = await apiClient.post<ShoppingListItemSingleApiResponse>('/api/me/shopping-list-items', request);
  return response.data;
};

export const updateShoppingListItemCheck = async (
  itemId: number,
  request: ShoppingListItemUpdateRequest
): Promise<ShoppingListItemSingleApiResponse> => {
  const response = await apiClient.patch<ShoppingListItemSingleApiResponse>(
    `/api/me/shopping-list-items/${itemId}`,
    request
  );
  return response.data;
};

export const deleteShoppingListItem = async (itemId: number): Promise<ShoppingListItemDeleteApiResponse> => {
  const response = await apiClient.delete<ShoppingListItemDeleteApiResponse>(`/api/me/shopping-list-items/${itemId}`);
  return response.data;
};
