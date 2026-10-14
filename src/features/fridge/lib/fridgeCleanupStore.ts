import { useSyncExternalStore } from 'react';
import { FridgeItem } from '../types';

export interface CleanupItem extends FridgeItem {
  // 남긴(버릴) 수량 — 0 ~ remainingQuantity
  remainingAmount: number;
}

interface CleanupState {
  items: CleanupItem[];
}

let state: CleanupState = { items: [] };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

const setSelectedItems = (items: FridgeItem[]) => {
  state = {
    items: items.map((item) => ({ ...item, remainingAmount: item.remainingQuantity })),
  };
  emit();
};

const setRemainingAmount = (id: number, amount: number) => {
  state = {
    items: state.items.map((item) =>
      item.id === id ? { ...item, remainingAmount: amount } : item
    ),
  };
  emit();
};

const removeItems = (ids: number[]) => {
  state = {
    items: state.items.filter((item) => !ids.includes(item.id)),
  };
  emit();
};

const reset = () => {
  state = { items: [] };
  emit();
};

export const fridgeCleanupStore = {
  setSelectedItems,
  setRemainingAmount,
  removeItems,
  reset,
  getItems: () => state.items,
};

export const useFridgeCleanupStore = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    items: snapshot.items,
    setSelectedItems,
    setRemainingAmount,
    removeItems,
    reset,
  };
};
