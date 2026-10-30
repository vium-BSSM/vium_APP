import { getIngredients } from '../api/ingredientsApi';

export interface InventoryQuantity {
  remainingQuantity: number;
  unit: string;
}

/**
 * 내 냉장고 재고의 남은 수량/단위를 재고 id(inventoryItemId) 기준으로 조회
 * - 다른 기능(레시피 사용량 조사 등)에서 재고 수량이 필요할 때 사용
 */
export const getInventoryQuantities = async (): Promise<Map<number, InventoryQuantity>> => {
  const response = await getIngredients();
  if (!response.success || !response.data) {
    throw new Error(response.error?.message || '재고 수량을 불러오지 못했어요.');
  }

  return new Map(
    response.data.ingredients.map((ingredient) => [
      ingredient.inventoryItemId,
      { remainingQuantity: ingredient.remainingQuantity, unit: ingredient.unit },
    ])
  );
};
