import { MonthlyReport, TopWastedItemApiResponse, WasteReportApiResponse, WastedItemRank } from '../types';

const mapTopWastedItem = (item: TopWastedItemApiResponse): WastedItemRank => ({
  rank: item.rank,
  name: item.name,
  lossAmount: item.lossAmount,
  purchaseAmount: item.purchaseAmount,
  wastePercent: item.wasteRatio === null ? null : Math.round(item.wasteRatio * 100),
});

// periodStart(YYYY-MM-DD)에서 연·월만 사용 (Date로 파싱하면 시간대에 따라 월이 밀릴 수 있음)
export const getReportYearMonth = (report: WasteReportApiResponse) => {
  const [year, month] = report.periodStart.split('-').map(Number);
  return { year, month };
};

export const mapWasteReport = (report: WasteReportApiResponse): MonthlyReport => ({
  ...getReportYearMonth(report),
  totalSpent: null,
  totalWasted: report.totalWastedAmount,
  registeredCount: report.registeredCount,
  consumedCount: report.consumedCount,
  expiredCount: report.expiredCount,
  // 월별 카테고리 통계는 백엔드 미제공
  wasteCategories: [],
  topWastedItems: report.topWastedItems.map(mapTopWastedItem),
});

// 폐기 기록이 없는 달은 리포트가 내려오지 않으므로 빈 리포트로 표시
export const createEmptyReport = (year: number, month: number): MonthlyReport => ({
  year,
  month,
  totalSpent: null,
  totalWasted: 0,
  registeredCount: 0,
  consumedCount: 0,
  expiredCount: 0,
  wasteCategories: [],
  topWastedItems: [],
});
