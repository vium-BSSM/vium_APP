import { useState } from 'react';
import { Alert } from '@/shared/lib/alert';
import { isAxiosError } from 'axios';
import { completeRecipe } from '../api/recipesApi';
import { RecipeCompleteRequest } from '../types';
import { CookUsageItem } from './recipeCookStore';
import { recipeListCache } from './recipeListCache';

type CookUsage = RecipeCompleteRequest['usages'][number];
type CookInventoryItem = CookUsageItem & { inventoryId: number; maxQuantity: number };

/**
 * 냉장고 정리와 같은 규칙: 남은 재고는 전부 사용 처리하고, 슬라이더의 남긴 수량만큼 폐기로 기록
 * - 0: 전부 먹음 → 폐기 없음
 * - 최대값: 전부 버림 → 서버가 disposed로 종료
 */
const toUsage = (item: CookInventoryItem): CookUsage => {
  // 재고 수량을 못 불러와 비율(%) 슬라이더로 대체된 경우 — 수량을 몰라 폐기는 기록 못 하고 전부 사용만 처리
  if (item.unit === '%') {
    return { inventoryId: item.inventoryId, usageRate: 100 };
  }

  const usedQuantity = item.maxQuantity;
  // 슬라이더 값의 부동소수점 오차 제거 (서버는 소수 3자리까지만 허용)
  const wasteQuantity = Math.min(Math.round(item.remainingAmount * 1000) / 1000, usedQuantity);
  return wasteQuantity > 0
    ? { inventoryId: item.inventoryId, usedQuantity, wasteQuantity }
    : { inventoryId: item.inventoryId, usedQuantity };
};

/**
 * 요리 완료 — 재료별 사용량·폐기량을 재고에서 차감
 * 냉장고에 없는 재료(inventoryId 없음)는 차감할 재고가 없어 제외
 */
export const useRecipeComplete = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const complete = async (recipeId: number, items: CookUsageItem[]): Promise<boolean> => {
    const usages = items
      .filter(
        (item): item is CookInventoryItem =>
          item.inventoryId != null && item.maxQuantity != null && item.maxQuantity > 0
      )
      .map(toUsage);

    if (usages.length === 0) return true;

    try {
      setIsSubmitting(true);
      await completeRecipe(recipeId, { usages });
      // 재고가 바뀌어 추천 결과도 달라지므로 다음 목록 진입 때 새로 받음
      recipeListCache.invalidate();
      return true;
    } catch (err) {
      console.error('Failed to complete recipe:', err);
      const message =
        isAxiosError(err) && err.response
          ? err.response.data?.error?.message || '재료 사용량을 저장하지 못했어요.'
          : '서버와 연결할 수 없습니다.';
      Alert.alert('오류', message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { complete, isSubmitting };
};
