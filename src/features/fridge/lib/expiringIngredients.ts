import { useMemo } from 'react';
import { getDaysDifference } from './dateUtils';
import { useIngredientsList } from './useIngredientsList';
import { ExpiringIngredient, FridgeItem } from '../types';

const EXPIRING_LIMIT = 3;

const formatUntil = (expiresOn: string) => {
  const [, month, day] = expiresOn.split('T')[0].split('-').map(Number);
  return `${month}월 ${day}일까지`;
};

/** 소비기한이 지나지 않은 재료 중 가까운 순 N개 */
export const pickExpiringIngredients = (
  items: FridgeItem[],
  limit: number = EXPIRING_LIMIT
): ExpiringIngredient[] => {
  const today = new Date();
  return items
    .map((item) => ({ item, daysLeft: getDaysDifference(item.expiresOn, today) }))
    .filter(({ daysLeft }) => daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft || b.item.id - a.item.id)
    .slice(0, limit)
    .map(({ item, daysLeft }) => ({
      id: item.id,
      name: item.title,
      daysLeft,
      status: item.status,
      untilLabel: formatUntil(item.expiresOn),
      ddayLabel: daysLeft === 0 ? 'D-Day' : `D-${daysLeft}`,
    }));
};

// 받침 유무로 조사 선택 (한글이 아니면 받침 없음으로 처리)
const hasFinalConsonant = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
};

/** 예: '당근과 양파가 3일 남았어요' — 가장 임박한 날짜의 재료(최대 2개)로 문구 생성 */
export const formatExpiringTitle = (ingredients: ExpiringIngredient[]): string | null => {
  if (ingredients.length === 0) return null;
  const { daysLeft } = ingredients[0];
  const names = ingredients.filter((ingredient) => ingredient.daysLeft === daysLeft).slice(0, 2).map((i) => i.name);
  const subject =
    names.length === 2 ? `${names[0]}${hasFinalConsonant(names[0]) ? '과' : '와'} ${names[1]}` : names[0];
  const particle = hasFinalConsonant(subject) ? '이' : '가';
  return daysLeft === 0 ? `${subject}${particle} 오늘까지예요` : `${subject}${particle} ${daysLeft}일 남았어요`;
};

/** 홈 '소비기한이 얼마 남지 않았어요' 목록용 */
export const useExpiringIngredients = () => {
  const { items, isLoading, error } = useIngredientsList();
  const ingredients = useMemo(() => pickExpiringIngredients(items), [items]);
  return { ingredients, isLoading, error };
};
