export type RecipeCategory = '전체' | '한식' | '중식' | '양식' | '일식' | '디저트';

// 백엔드 카테고리 코드 (요청 파라미터·응답 모두 이 값을 사용)
export type RecipeCategoryCode = 'ALL' | 'KOREAN' | 'CHINESE' | 'WESTERN' | 'JAPANESE' | 'DESSERT';

export interface RecipeIngredient {
  id: number;
  name: string;
  image?: string;
  // 내 냉장고 재고 id — 냉장고에 없는 재료는 null (요리 완료 시 차감 대상에서 제외)
  inventoryId?: number | null;
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
  category: RecipeCategory;
  image?: string;
}

export interface RecipeDetail extends RecipeListItem {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
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
    ingredients: { ingredientCatalogId: number; inventoryId: number | null; name: string }[];
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
