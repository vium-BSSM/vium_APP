export type RecipeCategory = '전체' | '한식' | '양식' | '일식' | '디저트';

export interface RecipeIngredient {
  id: number;
  name: string;
  image?: string;
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
