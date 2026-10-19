import { useSyncExternalStore } from 'react';
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
}

let state: CookState = { recipeId: null, items: [] };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

const startCookCompletion = (recipeId: number, ingredients: RecipeIngredient[]) => {
  state = {
    recipeId,
    items: ingredients.map((ingredient) => ({ ...ingredient, remainingAmount: 0, maxQuantity: null, unit: '' })),
  };
  emit();
};

/**
 * 재고 수량을 슬라이더 최대값으로 반영
 * 재고를 찾지 못했거나 수량이 0이면 기존처럼 0~100% 슬라이더로 대체
 */
const applyInventoryQuantities = (quantities: Map<number, InventoryQuantity>) => {
  state = {
    ...state,
    items: state.items.map((item) => {
      const quantity = item.inventoryId != null ? quantities.get(item.inventoryId) : undefined;
      return quantity && quantity.remainingQuantity > 0
        ? { ...item, remainingAmount: 0, maxQuantity: quantity.remainingQuantity, unit: quantity.unit }
        : { ...item, remainingAmount: 0, maxQuantity: 100, unit: '%' };
    }),
  };
  emit();
};

const setRemainingAmount = (id: number, amount: number) => {
  state = {
    ...state,
    items: state.items.map((item) => (item.id === id ? { ...item, remainingAmount: amount } : item)),
  };
  emit();
};

const reset = () => {
  state = { recipeId: null, items: [] };
  emit();
};

export const recipeCookStore = {
  startCookCompletion,
  applyInventoryQuantities,
  setRemainingAmount,
  reset,
  getState: () => state,
};

export const useRecipeCookStore = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    recipeId: snapshot.recipeId,
    items: snapshot.items,
    startCookCompletion,
    applyInventoryQuantities,
    setRemainingAmount,
    reset,
  };
};
