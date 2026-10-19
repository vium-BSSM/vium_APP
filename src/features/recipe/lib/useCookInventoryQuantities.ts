import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getInventoryQuantities } from '@/features/fridge';
import { recipeCookStore } from './recipeCookStore';

/**
 * 사용량 조사 화면 진입 시 냉장고 재고를 한 번 불러와 재료별 슬라이더 최대 수량을 채움
 * TODO: 레시피 상세 API가 재료별 remainingQuantity/unit을 내려주면 recipeMapper에서 채우고 이 훅은 제거
 */
export const useCookInventoryQuantities = (enabled: boolean) => {
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const quantities = await getInventoryQuantities();
        if (active) recipeCookStore.applyInventoryQuantities(quantities);
      } catch (err) {
        console.error('Failed to load inventory quantities:', err);
        if (!active) return;
        // 수량을 못 불러와도 사용량은 기록할 수 있도록 0~100% 슬라이더로 대체
        recipeCookStore.applyInventoryQuantities(new Map());
        Alert.alert('알림', '재료 수량을 불러오지 못해 비율(%)로 표시할게요.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [enabled]);

  return { isLoading };
};
