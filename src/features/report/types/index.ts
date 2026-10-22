export interface WasteCategoryStat {
  category: string;
  wastedAmount: number;
}

export interface WastedItemRank {
  rank: number;
  name: string;
  lossAmount: number;
  purchaseAmount: number | null;
  wastePercent: number | null;
}

export interface MonthlyReport {
  year: number;
  month: number;
  // 식비 합계는 백엔드 미제공 — 제공 전까지 null
  totalSpent: number | null;
  totalWasted: number;
  registeredCount: number;
  consumedCount: number;
  expiredCount: number;
  wasteCategories: WasteCategoryStat[];
  topWastedItems: WastedItemRank[];
}

interface ApiError {
  code: string;
  message: string;
}

export interface TopWastedItemApiResponse {
  rank: number;
  name: string;
  lossAmount: number;
  purchaseAmount: number | null;
  // 0~1 소수
  wasteRatio: number | null;
}

export interface WasteReportApiResponse {
  wasteReportId: number;
  periodStart: string; // YYYY-MM-DD (해당 월 1일)
  periodEnd: string;
  totalWastedAmount: number;
  totalSavedAmount: number;
  registeredCount: number;
  consumedCount: number;
  expiredCount: number;
  topWastedItems: TopWastedItemApiResponse[];
}

export interface WasteReportsApiResponse {
  success: boolean;
  data: {
    reports: WasteReportApiResponse[];
  } | null;
  error: ApiError | null;
}
