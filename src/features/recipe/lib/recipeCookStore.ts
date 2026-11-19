import { create } from 'zustand';
import { InventoryQuantity } from '@/features/fridge';
import { RecipeIngredient } from '../types';

export interface CookUsageItem extends RecipeIngredient {
  // 요리에 쓴 수량(재고에서 빠지는 양) — 0 ~ maxQuantity, 나머지는 냉장고에 남음
  usedAmount: number;
  // 쓴 수량 중 버린 양 — 0 ~ usedAmount
  wasteAmount: number;
  // 슬라이더 최대값 — 재고 수량을 불러오기 전에는 null
  maxQuantity: number | null;
  unit: string;
}

interface CookState {
  recipeId: number | null;
  items: CookUsageItem[];
  startCookCompletion: (recipeId: number, ingredients: RecipeIngredient[]) => void;
  applyInventoryQuantities: (quantities: Map<number, InventoryQuantity>) => void;
  setUsedAmount: (id: number, amount: number) => void;
  setWasteAmount: (id: number, amount: number) => void;
  reset: () => void;
}

const useCookStore = create<CookState>()((set) => ({
  recipeId: null,
  items: [],
  startCookCompletion: (recipeId, ingredients) =>
    set({
      recipeId,
      items: ingredients.map((ingredient) => ({ ...ingredient, usedAmount: 0, wasteAmount: 0, maxQuantity: null, unit: '' })),
    }),
  /**
   * 재고 수량을 슬라이더 최대값으로 반영
   * 재고를 찾지 못했거나 수량이 0이면 기존처럼 0~100% 슬라이더로 대체
   * 기본값은 전부 사용·폐기 없음 — 남긴 만큼 사용량을 줄이면 그만큼 냉장고에 남음
   */
  applyInventoryQuantities: (quantities) =>
    set((state) => ({
      items: state.items.map((item) => {
        const quantity = item.inventoryId != null ? quantities.get(item.inventoryId) : undefined;
        return quantity && quantity.remainingQuantity > 0
          ? {
              ...item,
              usedAmount: quantity.remainingQuantity,
              wasteAmount: 0,
              maxQuantity: quantity.remainingQuantity,
              unit: quantity.unit,
            }
          : { ...item, usedAmount: 100, wasteAmount: 0, maxQuantity: 100, unit: '%' };
      }),
    })),
  // 사용량을 줄이면 폐기량도 사용량 이하로 맞춤
  setUsedAmount: (id, amount) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, usedAmount: amount, wasteAmount: Math.min(item.wasteAmount, amount) } : item
      ),
    })),
  setWasteAmount: (id, amount) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, wasteAmount: Math.min(amount, item.usedAmount) } : item
      ),
    })),
  reset: () => set({ recipeId: null, items: [] }),
}));

const { startCookCompletion, applyInventoryQuantities, setUsedAmount, setWasteAmount, reset } =
  useCookStore.getState();

export const recipeCookStore = {
  startCookCompletion,
  applyInventoryQuantities,
  setUsedAmount,
  setWasteAmount,
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
    setUsedAmount,
    setWasteAmount,
    reset,
  };
};
