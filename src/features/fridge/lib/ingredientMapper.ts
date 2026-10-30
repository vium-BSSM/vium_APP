import { FridgeItem, FridgeItemDetail, FridgeItemStatus } from '../types';
import { IngredientApiResponse, IngredientListItemApiResponse } from '../types';
import { getDaysDifference, formatDate, formatDateWithSuffix } from './dateUtils';
import { getIngredientImage } from './ingredientImageFixtures';

// 목록 카드에 필요한 필드만 매핑 — 목록·상세 응답 공통 필드만 사용
const mapIngredientToListItem = (
  ingredient: IngredientListItemApiResponse | IngredientApiResponse
): FridgeItem => {
  const daysLeft = getDaysDifference(ingredient.expiresOn);

  const status: FridgeItemStatus = daysLeft <= 5 ? '위험' : daysLeft <= 14 ? '보통' : '양호';

  const subtitle = daysLeft < 0
    ? `소비기한 D+${Math.abs(daysLeft)}`
    : daysLeft === 0
    ? '소비기한 D-Day'
    : `소비기한 D-${daysLeft}`;

  return {
    id: ingredient.inventoryItemId,
    title: ingredient.name,
    subtitle,
    status,
    remainingQuantity: ingredient.remainingQuantity,
    unit: ingredient.unit,
    storageMethodId: ingredient.storageMethodId,
    image: getIngredientImage(ingredient.name),
  };
};

export const mapIngredientToFridgeItem = (ingredient: IngredientApiResponse): FridgeItemDetail => {
  const quantity = `${ingredient.remainingQuantity}${ingredient.unit}`;
  const price = ingredient.amount != null ? `${ingredient.amount.toLocaleString('ko-KR')}원` : '-';

  return {
    ...mapIngredientToListItem(ingredient),
    quantity,
    price,
    registeredDate: formatDate(ingredient.purchasedOn),
    expirationDate: formatDateWithSuffix(ingredient.expiresOn),
  };
};

export const mapIngredientsToFridgeItems = (
  ingredients: IngredientListItemApiResponse[]
): FridgeItem[] => {
  return ingredients.map(mapIngredientToListItem);
};
