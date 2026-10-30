import { create } from 'zustand';
import { InventoryQuantity } from '@/features/fridge';
import { RecipeIngredient } from '../types';

export interface CookUsageItem extends RecipeIngredient {
  // 남긴 수량 — 0 ~ maxQuantity
  remainingAmount: number;
  // 슬라이더 최대값 — 재고 수량을 불러오기 전에는 null
  maxQuantity: number | null;
  unit: string;
}

interface CookState {
  recipeId: number | null;
  items: CookUsageItem[];
  startCookCompletion: (recipeId: number, ingredients: RecipeIngredient[]) => void;
  applyInventoryQuantities: (quantities: Map<number, InventoryQuantity>) => void;
  setRemainingAmount: (id: number, amount: number) => void;
  reset: () => void;
}

const useCookStore = create<CookState>()((set) => ({
  recipeId: null,
  items: [],
  startCookCompletion: (recipeId, ingredients) =>
    set({
      recipeId,
      items: ingredients.map((ingredient) => ({ ...ingredient, remainingAmount: 0, maxQuantity: null, unit: '' })),
    }),
  /**
   * 재고 수량을 슬라이더 최대값으로 반영
   * 재고를 찾지 못했거나 수량이 0이면 기존처럼 0~100% 슬라이더로 대체
   */
  applyInventoryQuantities: (quantities) =>
    set((state) => ({
      items: state.items.map((item) => {
        const quantity = item.inventoryId != null ? quantities.get(item.inventoryId) : undefined;
        return quantity && quantity.remainingQuantity > 0
          ? { ...item, remainingAmount: 0, maxQuantity: quantity.remainingQuantity, unit: quantity.unit }
          : { ...item, remainingAmount: 0, maxQuantity: 100, unit: '%' };
      }),
    })),
  setRemainingAmount: (id, amount) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, remainingAmount: amount } : item)),
    })),
  reset: () => set({ recipeId: null, items: [] }),
}));

const { startCookCompletion, applyInventoryQuantities, setRemainingAmount, reset } = useCookStore.getState();

export const recipeCookStore = {
  startCookCompletion,
  applyInventoryQuantities,
  setRemainingAmount,
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
    applyInventoryQuantities,
    setRemainingAmount,
    reset,
  };
};
