import { useSyncExternalStore } from 'react';
import { RecipeIngredient } from '../types';

export interface CookUsageItem extends RecipeIngredient {
  remainingPercent: number;
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
    items: ingredients.map((ingredient) => ({ ...ingredient, remainingPercent: 0 })),
  };
  emit();
};

const setRemainingPercent = (id: number, percent: number) => {
  state = {
    ...state,
    items: state.items.map((item) => (item.id === id ? { ...item, remainingPercent: percent } : item)),
  };
  emit();
};

const reset = () => {
  state = { recipeId: null, items: [] };
  emit();
};

export const recipeCookStore = {
  startCookCompletion,
  setRemainingPercent,
  reset,
  getState: () => state,
};

export const useRecipeCookStore = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    recipeId: snapshot.recipeId,
    items: snapshot.items,
    startCookCompletion,
    setRemainingPercent,
    reset,
  };
};
