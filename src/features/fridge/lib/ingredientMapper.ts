import { FridgeItem, FridgeItemDetail, IngredientApiResponse } from '../types';
import { calculateStatus, formatDate, formatDateWithSuffix, formatDday, getDaysDifference } from './dateUtils';
import { getIngredientImage } from './ingredientImageFixtures';

// 목록 카드에 필요한 필드만 매핑 (상세 전용 포맷팅은 하지 않음)
const mapIngredientToListItem = (ingredient: IngredientApiResponse, baseDate: Date): FridgeItem => {
  const daysLeft = getDaysDifference(ingredient.expiresOn, baseDate);

  return {
    id: ingredient.inventoryItemId,
    title: ingredient.name,
    subtitle: formatDday(daysLeft),
    status: calculateStatus(daysLeft),
    remainingQuantity: ingredient.remainingQuantity,
    image: getIngredientImage(ingredient.name),
    expiresOn: ingredient.expiresOn,
  };
};

export const mapIngredientToFridgeItem = (
  ingredient: IngredientApiResponse,
  baseDate: Date = new Date()
): FridgeItemDetail => {
  const quantity = `${ingredient.remainingQuantity}${ingredient.unit}`;
  const price = ingredient.amount != null ? `${ingredient.amount.toLocaleString('ko-KR')}원` : '-';

  return {
    ...mapIngredientToListItem(ingredient, baseDate),
    quantity,
    price,
    registeredDate: formatDate(ingredient.purchasedOn),
    expirationDate: formatDateWithSuffix(ingredient.expiresOn),
  };
};

export const mapIngredientsToFridgeItems = (ingredients: IngredientApiResponse[]): FridgeItem[] => {
  // 기준일을 한 번만 구해 모든 재료에 동일하게 적용 (자정 경계에서 항목별 기준일이 달라지는 것 방지)
  const today = new Date();
  return ingredients.map((ingredient) => mapIngredientToListItem(ingredient, today));
};
