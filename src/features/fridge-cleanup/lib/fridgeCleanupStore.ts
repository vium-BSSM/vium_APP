import { useSyncExternalStore } from 'react';
import { FridgeItem } from '@/features/ingredient';

export interface CleanupItem extends FridgeItem {
  remainingPercent: number;
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
    items: items.map((item) => ({ ...item, remainingPercent: 100 })),
  };
  emit();
};

const setRemainingPercent = (id: number, percent: number) => {
  state = {
    items: state.items.map((item) =>
      item.id === id ? { ...item, remainingPercent: percent } : item
    ),
  };
  emit();
};

const reset = () => {
  state = { items: [] };
  emit();
};

export const fridgeCleanupStore = {
  setSelectedItems,
  setRemainingPercent,
  reset,
  getItems: () => state.items,
};

export const useFridgeCleanupStore = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    items: snapshot.items,
    setSelectedItems,
    setRemainingPercent,
    reset,
  };
};
