import { create } from 'zustand';
import { FridgeItem } from '../types';

export interface CleanupItem extends FridgeItem {
  // 남긴(버릴) 수량 — 0 ~ remainingQuantity
  remainingAmount: number;
}

interface CleanupState {
  items: CleanupItem[];
  setSelectedItems: (items: FridgeItem[]) => void;
  setRemainingAmount: (id: number, amount: number) => void;
  removeItems: (ids: number[]) => void;
  reset: () => void;
}

const useCleanupStore = create<CleanupState>()((set) => ({
  items: [],
  setSelectedItems: (items) =>
    set({ items: items.map((item) => ({ ...item, remainingAmount: item.remainingQuantity })) }),
  setRemainingAmount: (id, amount) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, remainingAmount: amount } : item)),
    })),
  removeItems: (ids) => {
    const removedIds = new Set(ids);
    set((state) => ({ items: state.items.filter((item) => !removedIds.has(item.id)) }));
  },
  reset: () => set({ items: [] }),
}));

const { setSelectedItems, setRemainingAmount, removeItems, reset } = useCleanupStore.getState();

export const fridgeCleanupStore = {
  setSelectedItems,
  setRemainingAmount,
  removeItems,
  reset,
  getItems: () => useCleanupStore.getState().items,
};

export const useFridgeCleanupStore = () => {
  const items = useCleanupStore((state) => state.items);

  return {
    items,
    setSelectedItems,
    setRemainingAmount,
    removeItems,
    reset,
  };
};
