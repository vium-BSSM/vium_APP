export type RecipeCategory = '전체' | '한식' | '중식' | '양식' | '일식' | '디저트';

// 백엔드 카테고리 코드 (요청 파라미터·응답 모두 이 값을 사용)
export type RecipeCategoryCode = 'ALL' | 'KOREAN' | 'CHINESE' | 'WESTERN' | 'JAPANESE' | 'DESSERT';

export interface RecipeIngredient {
  id: number;
  name: string;
  image?: string;
  // 내 냉장고 재고 id — 냉장고에 없는 재료는 null (요리 완료 시 차감 대상에서 제외)
  inventoryId?: number | null;
  // 1인분 기준 분량 (자유 텍스트, 예: "1/2개(약 80g)") — 상세 보강 전에는 null
  amount?: string | null;
}

// 기본 양념 (소금·간장 등) — 냉장고 재료가 아니라 카탈로그 밖 자유 텍스트
export interface RecipeSeasoning {
  name: string;
  amount: string;
}

export interface RecipeStep {
  step: number;
  description: string;
}

export interface RecipeListItem {
  id: number;
  title: string;
  cookTimeMinutes: number;
  tags: string[];
  // 레시피에 쓰이는 내 보유 재료 이름 (홈 추천 카드의 재료 칩)
  ingredientNames: string[];
  category: RecipeCategory;
  image?: string;
}

export interface RecipeDetail extends RecipeListItem {
  ingredients: RecipeIngredient[];
  seasonings: RecipeSeasoning[];
  steps: RecipeStep[];
  // AI 상세 보강(분량·양념·6~12단계) 완료 여부 — false면 기본 생성분만 있음
  detailReady: boolean;
}

interface ApiError {
  code: string;
  message: string;
}

export interface RecommendedRecipesApiResponse {
  success: boolean;
  data: {
    recipes: {
      recipeId: number;
      title: string;
      category: RecipeCategoryCode;
      cookTime: number;
      usedIngredients: { ingredientCatalogId: number; name: string }[];
    }[];
  } | null;
  error: ApiError | null;
}

export interface RecipeDetailApiResponse {
  success: boolean;
  data: {
    recipeId: number;
    title: string;
    category: RecipeCategoryCode;
    cookTime: number;
    imageUrl: string | null;
    // 상세 최초 열람 시 서버가 AI로 분량·양념·단계를 보강 — 실패·다른 요청이 보강 중이면 false
    detailReady: boolean | null;
    ingredients: {
      ingredientCatalogId: number;
      inventoryId: number | null;
      name: string;
      unit: string | null;
      amount: string | null; // detailReady가 false면 null
    }[];
    seasonings: { name: string; amount: string }[] | null; // detailReady가 false면 빈 배열
    steps: { step: number; description: string }[];
  } | null;
  error: ApiError | null;
}

export interface RecipeCompleteRequest {
  // usageRate(0~100) 또는 usedQuantity 중 하나만 보냄
  // wasteQuantity: 사용한 양 중 버린 양 (일반 폐기와 같은 규칙, usedQuantity 이하)
  usages: {
    inventoryId: number;
    usageRate?: number;
    usedQuantity?: number;
    wasteQuantity?: number;
  }[];
}
