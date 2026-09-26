import { MonthlyReport } from '../types';

/**
 * 리포트 API 연동 전까지 사용하는 임시 데이터입니다.
 * 백엔드 리포트 API 연동이 완료되면 제거하세요.
 */
export const MONTHLY_REPORT_FIXTURE: MonthlyReport = {
  year: 2026,
  month: 8,
  totalSpent: 243560,
  totalWasted: 30000,
  registeredCount: 32,
  consumedCount: 24,
  expiredCount: 8,
  wasteCategories: [
    { category: '냉동식품', wastedAmount: 9200 },
    { category: '유제품', wastedAmount: 6100 },
    { category: '채소류', wastedAmount: 15000 },
    { category: '고기류', wastedAmount: 1100 },
  ],
  topWastedItems: [
    { rank: 1, name: '냉동 치즈볼', lossAmount: 7200, purchaseAmount: 8000, wastePercent: 90 },
    { rank: 2, name: '샤브샤브 밀키트', lossAmount: 7200, purchaseAmount: 8000, wastePercent: 90 },
    { rank: 3, name: '아스파라거스', lossAmount: 7200, purchaseAmount: 8000, wastePercent: 90 },
  ],
};
