// 프론트엔드 도메인 타입
export type FridgeItemStatus = '위험' | '보통' | '양호';

export interface FridgeItem {
  id: number;
  title: string;
  subtitle: string;
  status: FridgeItemStatus;
  image?: string;
}

export interface FridgeItemDetail extends FridgeItem {
  quantity: string;
  price: string;
  registeredDate: string;
  expirationDate: string;
}

// 백엔드 API 응답 타입
export interface IngredientApiResponse {
  inventoryItemId: number;
  ingredientCatalogId: number;
  name: string;
  categoryName: string;
  initialQuantity: number;
  remainingQuantity: number;
  unitId: number;
  unit: string;
  statusCode: string;
  purchasedOn: string; // ISO date string
  expiresOn: string;   // ISO date string
}

export interface IngredientsListApiResponse {
  success: boolean;
  data: {
    ingredients: IngredientApiResponse[];
  };
  error: null | {
    code: string;
    message: string;
  };
}

// POST 요청 타입
export interface IngredientRegisterRequest {
  ingredientCatalogId?: number;
  customName?: string;
  quantity: number;
  unitId: number;
  storageMethodId?: number;
  purchasedOn?: string; // ISO date string
  expiresOn?: string;   // ISO date string
  amount?: number;
}

export interface IngredientRegisterApiResponse {
  success: boolean;
  data: {
    inventoryItemId: number;
    ingredientCatalogId: number;
    customName: string;
    initialQuantity: number;
    remainingQuantity: number;
    unitId: number;
    storageMethodId: number;
    statusCode: string;
    purchasedOn: string;
    expiresOn: string;
  };
  error: null | {
    code: string;
    message: string;
  };
}
