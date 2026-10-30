import {
  InventoryItemApiResponse,
  OwnedIngredient,
  ShoppingListItem,
  ShoppingListItemApiResponse,
  ShoppingSuggestion,
  SuggestionItemApiResponse,
} from '../types';

const formatQuantity = (quantity: number | null | undefined, unit: string | null | undefined) => {
  if (quantity == null) return '';
  // BigDecimal이 1.000 같은 형태로 올 수 있어 숫자로 정리
  return `${Number(quantity)}${unit ?? ''}`;
};

/** 카탈로그 재료는 ID, 직접 입력 재료는 이름으로 식별 */
export const toIngredientKey = (ingredientCatalogId: number | null, name: string) =>
  ingredientCatalogId != null ? `c-${ingredientCatalogId}` : `n-${name}`;

export const mapSuggestion = (item: SuggestionItemApiResponse): ShoppingSuggestion => ({
  key: toIngredientKey(item.ingredientCatalogId, item.ingredientName),
  ingredientCatalogId: item.ingredientCatalogId,
  name: item.ingredientName,
  quantityLabel: formatQuantity(item.suggestedQuantity, item.unit),
  suggestedQuantity: Number(item.suggestedQuantity),
  unitId: item.unitId,
});

export const mapOwnedIngredient = (item: InventoryItemApiResponse): OwnedIngredient => ({
  key: toIngredientKey(item.ingredientCatalogId, item.ingredientName),
  name: item.ingredientName,
  quantityLabel: formatQuantity(item.quantity, item.unit),
});

export const mapShoppingListItem = (item: ShoppingListItemApiResponse): ShoppingListItem => ({
  id: item.shoppingListItemId,
  ingredientCatalogId: item.ingredientCatalogId,
  name: item.customName ?? '이름 없는 재료',
  quantityLabel: formatQuantity(item.suggestedQuantity, item.unitName),
  reason: item.reason,
  isChecked: item.isChecked,
});

/** "2026-09" → "9월" */
export const formatReportMonth = (reportMonth: string | null) => {
  if (!reportMonth) return null;
  const month = Number(reportMonth.split('-')[1]);
  return Number.isNaN(month) ? null : `${month}월`;
};
