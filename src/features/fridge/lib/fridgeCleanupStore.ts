import { create } from 'zustand';
import { FridgeItem } from '../types';

export interface CleanupItem extends FridgeItem {
  remainingPercent: number;
}

interface CleanupState {
  items: CleanupItem[];
  setSelectedItems: (items: FridgeItem[]) => void;
  setRemainingPercent: (id: number, percent: number) => void;
  removeItems: (ids: number[]) => void;
  reset: () => void;
}

const useCleanupStore = create<CleanupState>()((set) => ({
  items: [],
  setSelectedItems: (items) => set({ items: items.map((item) => ({ ...item, remainingPercent: 100 })) }),
  setRemainingPercent: (id, percent) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, remainingPercent: percent } : item)),
    })),
  removeItems: (ids) => {
    const removedIds = new Set(ids);
    set((state) => ({ items: state.items.filter((item) => !removedIds.has(item.id)) }));
  },
  reset: () => set({ items: [] }),
}));

const { setSelectedItems, setRemainingPercent, removeItems, reset } = useCleanupStore.getState();

export const fridgeCleanupStore = {
  setSelectedItems,
  setRemainingPercent,
  removeItems,
  reset,
  getItems: () => useCleanupStore.getState().items,
};

export const useFridgeCleanupStore = () => {
  const items = useCleanupStore((state) => state.items);

  return {
    items,
    setSelectedItems,
    setRemainingPercent,
    removeItems,
    reset,
  };
};
