export type FridgeItemStatus = '위험' | '보통' | '양호';

export type FridgeSortType = 'expiry' | 'recent';

// 'all' 또는 보관 방법 id (1 냉장, 2 냉동, 3 실온)
export type FridgeStorageFilter = 'all' | number;

export interface FridgeItem {
  id: number;
  title: string;
  subtitle: string;
  status: FridgeItemStatus;
  remainingQuantity: number;
  unit: string;
  // 보관 방법 id (1 냉장, 2 냉동, 3 실온), 보관 방법 없이 등록된 재료는 null
  storageMethodId: number | null;
  image?: string;
  expiresOn: string; // 원본 'YYYY-MM-DD', 소비기한 순 정렬 키
}

export interface ExpiringIngredient {
  id: number;
  name: string;
  daysLeft: number;
  status: FridgeItemStatus;
  untilLabel: string; // '10월 30일까지'
  ddayLabel: string; // 'D-3'
}

export interface FridgeItemDetail extends FridgeItem {
  quantity: string;
  price: string;
  registeredDate: string;
  expirationDate: string;
}

// GET /api/me/ingredients — 목록 카드에 필요한 필드만 내려옴
export interface IngredientListItemApiResponse {
  inventoryItemId: number;
  name: string;
  expiresOn: string;
  remainingQuantity: number;
  unitId: number;
  unit: string;
  storageMethodId: number | null;
  storageMethodName: string | null;
}

// GET /api/me/ingredients/{id}
export interface IngredientApiResponse {
  inventoryItemId: number;
  ingredientCatalogId: number | null;
  name: string;
  categoryName: string | null;
  initialQuantity: number;
  remainingQuantity: number;
  amount: number | null;
  unitId: number;
  unit: string;
  storageMethodId: number | null;
  storageMethodName: string | null;
  statusCode: string;
  purchasedOn: string;
  expiresOn: string;
}

export interface IngredientsListApiResponse {
  success: boolean;
  data: {
    ingredients: IngredientListItemApiResponse[];
  };
  error: null | {
    code: string;
    message: string;
  };
}

export interface IngredientDetailApiResponse {
  success: boolean;
  data: IngredientApiResponse | null;
  error: null | {
    code: string;
    message: string;
  };
}

export interface IngredientRegisterRequest {
  ingredientCatalogId?: number;
  customName?: string;
  quantity: number;
  unitId: number;
  storageMethodId?: number;
  purchasedOn?: string;
  expiresOn?: string;
  amount?: number;
}

export interface IngredientRegisterApiResponse {
  success: boolean;
  data: {
    inventoryItemId: number;
    ingredientCatalogId: number | null;
    customName: string | null;
    initialQuantity: number;
    remainingQuantity: number;
    unitId: number;
    storageMethodId: number | null;
    statusCode: string;
    purchasedOn: string;
    expiresOn: string;
  };
  error: null | {
    code: string;
    message: string;
  };
}

export type IngredientStatusCode = 'consumed' | 'disposed';

export interface IngredientStatusUpdateRequest {
  status: IngredientStatusCode;
  quantity: number;
  wasteQuantity?: number;
  wasteAmount?: number;
}

export interface IngredientStatusUpdateApiResponse {
  success: boolean;
  data: {
    inventoryItemId: number;
    statusCode: IngredientStatusCode;
    remainingQuantity: number;
    wasteQuantity?: number;
    wasteAmount?: number;
  };
  error: null | {
    code: string;
    message: string;
  };
}

export interface IngredientUpdateRequest {
  // 카탈로그 재료는 null이면 카탈로그 이름 사용, 직접 입력 재료는 필수
  customName: string | null;
  // 전체(최초) 수량. 남은 수량은 서버가 이미 소진·폐기한 양을 빼서 다시 계산
  quantity: number;
  unitId: number;
  storageMethodId: number;
  purchasedOn: string;
  expiresOn: string;
}

export interface IngredientUpdateApiResponse {
  success: boolean;
  data: {
    inventoryItemId: number;
    customName: string | null;
    quantity: number;
    unitId: number;
    storageMethodId: number;
    purchasedOn: string;
    expiresOn: string;
    statusCode: string;
  } | null;
  error: null | {
    code: string;
    message: string;
  };
}

export interface IngredientCatalogItem {
  ingredientCatalogId: number;
  name: string;
  categoryId: number;
  defaultUnitId: number;
}

export interface IngredientCatalogSearchApiResponse {
  success: boolean;
  data: {
    items: IngredientCatalogItem[];
  } | null;
  error: null | {
    code: string;
    message: string;
  };
}
