export interface YearMonth {
  year: number;
  month: number;
}

export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export const getCurrentYearMonth = (base: Date = new Date()): YearMonth => ({
  year: base.getFullYear(),
  month: base.getMonth() + 1,
});

export const isSameYearMonth = (a: YearMonth, b: YearMonth) =>
  a.year === b.year && a.month === b.month;

// 통계가 있는 달 + 이번 달(아직 통계가 없어도 기본으로 보여주는 달)만 선택 가능, 최신순
export const getSelectableMonths = (reportMonths: YearMonth[], base: Date = new Date()) => {
  const current = getCurrentYearMonth(base);
  const months = reportMonths.some((m) => isSameYearMonth(m, current))
    ? reportMonths
    : [current, ...reportMonths];
  return [...months].sort((a, b) => b.year - a.year || b.month - a.month);
};
