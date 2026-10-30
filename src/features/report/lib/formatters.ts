export const formatWon = (amount: number) => amount.toLocaleString('ko-KR');

export const formatCount = (count: number) => String(count).padStart(2, '0');

export const formatYear = (year: number) => `${year}년`;

export const formatMonth = (month: number) => `${String(month).padStart(2, '0')}월`;

export const formatYearMonth = (year: number, month: number) =>
  `${formatYear(year)} ${formatMonth(month)}`;

// 마지막 글자 받침 유무로 을/를 선택 (한글이 아니면 '를')
export const withObjectParticle = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const hasFinalConsonant = code >= 0 && code <= 11171 && code % 28 !== 0;
  return `${word}${hasFinalConsonant ? '을' : '를'}`;
};
