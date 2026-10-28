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
  statusCode: string;
  purchasedOn: string;
  expiresOn: string;
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

// ===== 영수증·온라인 주문 인식 (구매 내역) =====

export type PurchaseType = 'RECEIPT' | 'ONLINE_ORDER';

// DRAFT: 확인 대기 (아직 재고 미등록), CONFIRMED: 재고 등록 완료
export type PurchaseStatus = 'DRAFT' | 'CONFIRMED';

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

// 좌표는 회전이 반영된 원본 이미지 픽셀 기준 (shared/lib/textRecognition 결과 그대로)
export interface PurchaseScanRequest {
  imageId?: number;
  imageWidth: number;
  imageHeight: number;
  lines: {
    text: string;
    left: number;
    top: number;
    right: number;
    bottom: number;
  }[];
}

export interface PurchaseItemDraft {
  purchaseItemId: number;
  rawName: string;
  // null이면 재료를 못 찾은 품목 (비식품일 수 있어 확인 화면에서 기본 해제)
  ingredientCatalogId: number | null;
  ingredientName: string | null;
  quantity: number;
  unitId: number;
  storageMethodId: number | null;
  unitPrice: number | null;
  amount: number | null;
  expiresOn: string | null; // 'YYYY-MM-DD'
}

export interface PurchaseDetail {
  purchaseId: number;
  type: PurchaseType;
  status: PurchaseStatus;
  imageId: number | null;
  purchaseSourceId: number | null;
  purchaseSourceName: string | null;
  purchasedAt: string; // ISO OffsetDateTime
  totalAmount: number | null;
  items: PurchaseItemDraft[];
  createdAt: string;
}

export interface PurchaseSummary {
  purchaseId: number;
  type: PurchaseType;
  status: PurchaseStatus;
  purchaseSourceName: string | null;
  purchasedAt: string;
  totalAmount: number | null;
  itemCount: number;
}

export interface PurchaseListParams {
  type?: PurchaseType;
  status?: PurchaseStatus;
  from?: string; // 'YYYY-MM-DD'
  to?: string;
}

export interface PurchaseConfirmItem {
  // 인식된 품목을 수정하면 유지, 새로 추가한 품목은 null
  purchaseItemId: number | null;
  ingredientCatalogId: number | null;
  customName?: string;
  quantity: number;
  unitId: number;
  storageMethodId?: number;
  amount?: number;
  // 재료(ingredientCatalogId)를 지정하지 않은 품목은 필수 (없으면 400)
  expiresOn?: string;
}

export interface PurchaseConfirmRequest {
  // 항상 보내기 (빼면 구매처가 지워짐)
  purchaseSourceId: number | null;
  purchasedAt: string; // ISO OffsetDateTime
  // 최종 목록 전체 (빠진 품목은 등록 안 됨), 1~100개
  items: PurchaseConfirmItem[];
}

export interface PurchaseConfirmResult {
  purchaseId: number;
  status: PurchaseStatus;
  ingredients: {
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
  }[];
}

export interface ReceiptImageUploadResult {
  imageId: number;
  purpose: 'RECEIPT';
  visibility: string;
  contentType: string;
  sizeBytes: number;
  url: string;
  createdAt: string;
}

export type PurchaseScanApiResponse = ApiResponse<PurchaseDetail>;
export type PurchaseDetailApiResponse = ApiResponse<PurchaseDetail>;
export type PurchaseListApiResponse = ApiResponse<{ purchases: PurchaseSummary[] }>;
export type PurchaseConfirmApiResponse = ApiResponse<PurchaseConfirmResult>;
export type PurchaseDeleteApiResponse = ApiResponse<null>;
export type ReceiptImageUploadApiResponse = ApiResponse<ReceiptImageUploadResult>;
