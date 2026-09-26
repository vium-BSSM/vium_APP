export interface YearMonth {
  year: number;
  month: number;
}

export const FIRST_REPORT_YEAR = 2020;

export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export const getCurrentYearMonth = (base: Date = new Date()): YearMonth => ({
  year: base.getFullYear(),
  month: base.getMonth() + 1,
});

// 아직 오지 않은 달은 리포트가 없으므로 선택할 수 없음
export const isFutureMonth = (year: number, month: number, base: Date = new Date()) => {
  const current = getCurrentYearMonth(base);
  return year > current.year || (year === current.year && month > current.month);
};
