import { useQuery } from '@tanstack/react-query';
import { unwrap } from '@/shared/api/types';
import { getPurchaseSuggestions } from '../api/shoppingApi';
import { PurchaseSuggestion, PurchaseSuggestionItemApiResponse } from '../types';

const mapItem = (item: PurchaseSuggestionItemApiResponse): PurchaseSuggestion => ({
  // 서버는 카탈로그 ID + 단위 ID로 품목을 구분
  key: `${item.ingredientCatalogId}-${item.unitId}`,
  name: item.ingredientName,
  // BigDecimal이 1.000 같은 형태로 올 수 있어 숫자로 정리
  suggestedLabel: `${Number(item.suggestedQuantity)}${item.unit}`,
  wastePercent: Math.round(Number(item.wasteRatio) * 100),
  adjustment: item.adjustment,
  message: item.message,
});

/** 'YYYY-MM-DD' 두 개 → '10.1 ~ 10.31' */
const formatPeriod = (start: string | null, end: string | null) => {
  if (!start || !end) return null;
  const short = (date: string) => {
    const [, month, day] = date.split('T')[0].split('-').map(Number);
    return `${month}.${day}`;
  };
  return `${short(start)} ~ ${short(end)}`;
};

export const usePurchaseSuggestions = () => {
  const query = useQuery({
    queryKey: ['purchaseSuggestions'],
    queryFn: async () => unwrap(await getPurchaseSuggestions()),
  });

  const data = query.data;
  return {
    // available=false면 '아직 데이터 없음' 화면
    available: data?.available ?? false,
    periodLabel: data ? formatPeriod(data.basedOnPeriodStart, data.basedOnPeriodEnd) : null,
    // 서버 정렬(줄여야 할 품목이 위) 그대로 사용
    items: data?.items.map(mapItem) ?? [],
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
};
