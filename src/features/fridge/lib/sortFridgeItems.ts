import { FridgeItem, FridgeSortType } from '../types';

const compareByExpiry = (a: FridgeItem, b: FridgeItem): number => {
  if (a.expiresOn < b.expiresOn) return -1;
  if (a.expiresOn > b.expiresOn) return 1;
  return b.id - a.id; 
};

const compareByRecent = (a: FridgeItem, b: FridgeItem): number => b.id - a.id;

export const sortFridgeItems = (items: FridgeItem[], sortType: FridgeSortType): FridgeItem[] => {
  return [...items].sort(sortType === 'expiry' ? compareByExpiry : compareByRecent);
};
