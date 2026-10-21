import { createStore } from '@/shared/lib/createStore';
import { FridgeItem } from '../types';

export interface CleanupItem extends FridgeItem {
  remainingPercent: number;
}

interface CleanupState {
  items: CleanupItem[];
}

const store = createStore<CleanupState>({ items: [] });

const setSelectedItems = (items: FridgeItem[]) => {
  store.setState({
    items: items.map((item) => ({ ...item, remainingPercent: 100 })),
  });
};

const setRemainingPercent = (id: number, percent: number) => {
  store.setState({
    items: store.getState().items.map((item) =>
      item.id === id ? { ...item, remainingPercent: percent } : item
    ),
  });
};

const removeItems = (ids: number[]) => {
  const removedIds = new Set(ids);
  store.setState({
    items: store.getState().items.filter((item) => !removedIds.has(item.id)),
  });
};

const reset = () => {
  store.setState({ items: [] });
};

export const fridgeCleanupStore = {
  setSelectedItems,
  setRemainingPercent,
  removeItems,
  reset,
  getItems: () => store.getState().items,
};

export const useFridgeCleanupStore = () => {
  const { items } = store.useStore();

  return {
    items,
    setSelectedItems,
    setRemainingPercent,
    removeItems,
    reset,
  };
};
