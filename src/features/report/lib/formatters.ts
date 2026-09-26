export const formatWon = (amount: number) => amount.toLocaleString('ko-KR');

export const formatCount = (count: number) => String(count).padStart(2, '0');

export const formatYear = (year: number) => `${year}년`;

export const formatMonth = (month: number) => `${String(month).padStart(2, '0')}월`;

export const formatYearMonth = (year: number, month: number) =>
  `${formatYear(year)} ${formatMonth(month)}`;
