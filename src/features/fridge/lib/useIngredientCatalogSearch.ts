import { useEffect, useState } from 'react';
import { searchIngredientCatalog } from '../api/ingredientCatalogApi';
import { IngredientCatalogItem } from '../types';

const SEARCH_DELAY_MS = 300;

interface SearchResult {
  keyword: string;
  items: IngredientCatalogItem[];
}

/**
 * 재료 이름 입력에 맞춰 카탈로그 후보를 검색 (입력이 멈추면 검색, 늦게 도착한 이전 결과는 무시)
 * @param enabled false면 검색하지 않음 (예: 이미 카탈로그 재료를 고른 경우)
 */
export const useIngredientCatalogSearch = (keyword: string, enabled: boolean = true) => {
  const [result, setResult] = useState<SearchResult | null>(null);
  const trimmed = keyword.trim();
  const isSearchable = enabled && trimmed.length > 0;

  useEffect(() => {
    if (!isSearchable) return;

    let active = true;
    const timer = setTimeout(async () => {
      let items: IngredientCatalogItem[] = [];
      try {
        const response = await searchIngredientCatalog(trimmed);
        items = response.success && response.data ? response.data.items : [];
      } catch (err) {
        // 검색 실패 시 후보만 비우고 직접 입력 등록은 그대로 가능
        console.warn('Failed to search ingredient catalog:', err);
      }
      if (active) setResult({ keyword: trimmed, items });
    }, SEARCH_DELAY_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [trimmed, isSearchable]);

  // 새 검색어 결과가 오기 전까지는 이전 후보를 그대로 보여줌
  return {
    items: isSearchable ? (result?.items ?? []) : [],
    isLoading: isSearchable && result?.keyword !== trimmed,
  };
};
