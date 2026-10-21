import { create } from 'zustand';
import { RecipeIngredient } from '../types';

export interface CookUsageItem extends RecipeIngredient {
  remainingPercent: number;
}

interface CookState {
  recipeId: number | null;
  items: CookUsageItem[];
  startCookCompletion: (recipeId: number, ingredients: RecipeIngredient[]) => void;
  setRemainingPercent: (id: number, percent: number) => void;
  reset: () => void;
}

const useCookStore = create<CookState>()((set) => ({
  recipeId: null,
  items: [],
  startCookCompletion: (recipeId, ingredients) =>
    set({
      recipeId,
      items: ingredients.map((ingredient) => ({ ...ingredient, remainingPercent: 0 })),
    }),
  setRemainingPercent: (id, percent) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, remainingPercent: percent } : item)),
    })),
  reset: () => set({ recipeId: null, items: [] }),
}));

const { startCookCompletion, setRemainingPercent, reset } = useCookStore.getState();

export const recipeCookStore = {
  startCookCompletion,
  setRemainingPercent,
  reset,
  getState: () => {
    const { recipeId, items } = useCookStore.getState();
    return { recipeId, items };
  },
};

export const useRecipeCookStore = () => {
  const recipeId = useCookStore((state) => state.recipeId);
  const items = useCookStore((state) => state.items);

  return {
    recipeId,
    items,
    startCookCompletion,
    setRemainingPercent,
    reset,
  };
};
