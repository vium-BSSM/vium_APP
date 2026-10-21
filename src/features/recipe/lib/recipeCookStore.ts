import { createStore } from '@/shared/lib/createStore';
import { RecipeIngredient } from '../types';

export interface CookUsageItem extends RecipeIngredient {
  remainingPercent: number;
}

interface CookState {
  recipeId: number | null;
  items: CookUsageItem[];
}

const store = createStore<CookState>({ recipeId: null, items: [] });

const startCookCompletion = (recipeId: number, ingredients: RecipeIngredient[]) => {
  store.setState({
    recipeId,
    items: ingredients.map((ingredient) => ({ ...ingredient, remainingPercent: 0 })),
  });
};

const setRemainingPercent = (id: number, percent: number) => {
  const state = store.getState();
  store.setState({
    ...state,
    items: state.items.map((item) => (item.id === id ? { ...item, remainingPercent: percent } : item)),
  });
};

const reset = () => {
  store.setState({ recipeId: null, items: [] });
};

export const recipeCookStore = {
  startCookCompletion,
  setRemainingPercent,
  reset,
  getState: store.getState,
};

export const useRecipeCookStore = () => {
  const { recipeId, items } = store.useStore();

  return {
    recipeId,
    items,
    startCookCompletion,
    setRemainingPercent,
    reset,
  };
};
