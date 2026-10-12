interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: null | {
    code: string;
    message: string;
  };
}

// ── GET /api/me/shopping-helper ──
export interface InventoryItemApiResponse {
  ingredientCatalogId: number | null;
  ingredientName: string;
  quantity: number;
  unitId: number;
  unit: string;
}

export interface SuggestionItemApiResponse {
  ingredientCatalogId: number | null;
  ingredientName: string;
  suggestedQuantity: number;
  unitId: number;
  unit: string;
}

export interface ShoppingHelperApiData {
  available: boolean;
  reason: string | null;
  basedOnReportMonth: string | null;
  alreadyHave: InventoryItemApiResponse[];
  toBuy: SuggestionItemApiResponse[];
}

export type ShoppingHelperApiResponse = ApiEnvelope<ShoppingHelperApiData>;

// ── /api/me/shopping-list-items ──
export interface ShoppingListItemApiResponse {
  shoppingListItemId: number;
  ingredientCatalogId: number | null;
  customName: string | null;
  suggestedQuantity: number | null;
  unitId: number | null;
  unitName: string | null;
  reason: string | null;
  isChecked: boolean;
  createdAt: string;
}

export type ShoppingListApiResponse = ApiEnvelope<{ items: ShoppingListItemApiResponse[] }>;
export type ShoppingListItemSingleApiResponse = ApiEnvelope<ShoppingListItemApiResponse>;
export type ShoppingListItemDeleteApiResponse = ApiEnvelope<null>;

export interface ShoppingListItemCreateRequest {
  ingredientCatalogId?: number;
  customName?: string;
  suggestedQuantity?: number;
  unitId?: number;
  reason?: string;
}

export interface ShoppingListItemUpdateRequest {
  isChecked: boolean;
}

// ── UI models ──
export interface ShoppingSuggestion {
  /** 카탈로그 ID가 없는(직접 입력) 재료도 있어서 화면용 고유 키를 따로 둠 */
  key: string;
  ingredientCatalogId: number | null;
  name: string;
  quantityLabel: string;
  suggestedQuantity: number;
  unitId: number;
}

export interface OwnedIngredient {
  key: string;
  name: string;
  quantityLabel: string;
}

/** 장보기 리스트 직접 추가 폼 입력값 */
export interface ManualShoppingItemInput {
  name: string;
  quantity?: number;
  unitId?: number;
  unitLabel?: string;
}

export interface ShoppingListItem {
  id: number;
  ingredientCatalogId: number | null;
  name: string;
  quantityLabel: string;
  reason: string | null;
  isChecked: boolean;
}
