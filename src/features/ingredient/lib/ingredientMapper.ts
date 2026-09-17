import { FridgeItemDetail } from '../types';
import { IngredientApiResponse } from '../types';
import { calculateStatus, formatDday, formatDate, formatDateWithSuffix } from './dateUtils';

/**
 * 백엔드 API 응답을 프론트엔드 FridgeItemDetail 형태로 변환
 */
export const mapIngredientToFridgeItem = (ingredient: IngredientApiResponse): FridgeItemDetail => {
  const status = calculateStatus(ingredient.expiresOn);
  const subtitle = formatDday(ingredient.expiresOn);

  // 수량 + 단위 결합
  const quantity = `${ingredient.remainingQuantity}${ingredient.unit}`;

  // TODO: 가격 필드가 백엔드에 추가되면 수정 필요
  const price = '3,000원';

  return {
    id: ingredient.inventoryItemId,
    title: ingredient.name,
    subtitle,
    status,
    quantity,
    price,
    registeredDate: formatDate(ingredient.purchasedOn),
    expirationDate: formatDateWithSuffix(ingredient.expiresOn),
  };
};

/**
 * 여러 재료를 한 번에 변환
 */
export const mapIngredientsToFridgeItems = (
  ingredients: IngredientApiResponse[]
): FridgeItemDetail[] => {
  return ingredients.map(mapIngredientToFridgeItem);
};
