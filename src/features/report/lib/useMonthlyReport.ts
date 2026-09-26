import { MONTHLY_REPORT_FIXTURE } from './reportFixtures';

// 리포트 API 연동 전까지는 선택한 월과 상관없이 임시 데이터로 화면을 보여줍니다.
export const useMonthlyReport = (year: number, month: number) => {
  return {
    report: { ...MONTHLY_REPORT_FIXTURE, year, month },
    isLoading: false,
    error: null as string | null,
  };
};
