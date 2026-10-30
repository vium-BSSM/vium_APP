import { FridgeItem, FridgeItemDetail, IngredientApiResponse, IngredientListItemApiResponse } from '../types';
import { calculateStatus, formatDate, formatDateWithSuffix, formatDday, getDaysDifference } from './dateUtils';
import { getIngredientImage } from './ingredientImageFixtures';

// 목록 카드에 필요한 필드만 매핑 — 목록·상세 응답 공통 필드만 사용
const mapIngredientToListItem = (
  ingredient: IngredientListItemApiResponse | IngredientApiResponse,
  baseDate: Date
): FridgeItem => {
  const daysLeft = getDaysDifference(ingredient.expiresOn, baseDate);

  return {
    id: ingredient.inventoryItemId,
    title: ingredient.name,
    subtitle: formatDday(daysLeft),
    status: calculateStatus(daysLeft),
    remainingQuantity: ingredient.remainingQuantity,
    unit: ingredient.unit,
    storageMethodId: ingredient.storageMethodId,
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

export const mapIngredientsToFridgeItems = (
  ingredients: IngredientListItemApiResponse[]
): FridgeItem[] => {
  // 기준일을 한 번만 구해 모든 재료에 동일하게 적용 (자정 경계에서 항목별 기준일이 달라지는 것 방지)
  const today = new Date();
  return ingredients.map((ingredient) => mapIngredientToListItem(ingredient, today));
};
