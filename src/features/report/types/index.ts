export interface WasteCategoryStat {
  category: string;
  wastedAmount: number;
}

export interface WastedItemRank {
  rank: number;
  name: string;
  lossAmount: number;
  purchaseAmount: number;
  wastePercent: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  totalSpent: number;
  totalWasted: number;
  registeredCount: number;
  consumedCount: number;
  expiredCount: number;
  wasteCategories: WasteCategoryStat[];
  topWastedItems: WastedItemRank[];
}
