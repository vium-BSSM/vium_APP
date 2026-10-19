import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getIngredients } from '../api/ingredientsApi';
import { mapIngredientsToFridgeItems } from './ingredientMapper';
import { sortFridgeItems } from './sortFridgeItems';
import { FridgeItem, FridgeSortType } from '../types';

export const useIngredientsList = () => {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<FridgeSortType>('expiry');
  const hasLoaded = useRef(false);

  const loadIngredients = useCallback(async (expiringSoon: boolean = false) => {
    try {
      // 이미 목록이 있으면 로딩 화면 없이 갱신 (탭 전환·수정 후 복귀 시 깜빡임 방지)
      if (!hasLoaded.current) setIsLoading(true);
      setError(null);
      const response = await getIngredients(expiringSoon);

      if (response.success && response.data) {
        setItems(mapIngredientsToFridgeItems(response.data.ingredients));
      } else {
        setError(response.error?.message || '재료를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to load ingredients:', err);
      setError('서버와 연결할 수 없습니다.');
    } finally {
      hasLoaded.current = true;
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadIngredients();
    }, [loadIngredients])
  );

  // 조회 결과나 정렬 기준이 바뀔 때만 재정렬
  const sortedItems = useMemo(() => sortFridgeItems(items, sortType), [items, sortType]);

  return {
    items: sortedItems,
    sortType,
    setSortType,
    isLoading,
    error,
    refresh: loadIngredients,
  };
};
