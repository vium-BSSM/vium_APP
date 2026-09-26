export const formatWon = (amount: number) => amount.toLocaleString('ko-KR');

export const formatCount = (count: number) => String(count).padStart(2, '0');

export const formatYearMonth = (year: number, month: number) =>
  `${year}년 ${String(month).padStart(2, '0')}월`;
