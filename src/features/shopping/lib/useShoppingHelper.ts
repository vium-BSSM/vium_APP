import { useCallback, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import {
  addShoppingListItem,
  deleteShoppingListItem,
  getShoppingHelper,
  getShoppingList,
  updateShoppingListItemCheck,
} from '../api/shoppingApi';
import { ManualShoppingItemInput, OwnedIngredient, ShoppingListItem, ShoppingSuggestion } from '../types';
import { mapOwnedIngredient, mapShoppingListItem, mapSuggestion, toIngredientKey } from './shoppingMapper';

const SUGGESTION_REASON = '리포트 기반 장보기 제안';
const MANUAL_PENDING_KEY = 'manual';

const getErrorMessage = (err: unknown, fallback: string) => {
  if (isAxiosError(err)) {
    return err.response?.data?.error?.message ?? fallback;
  }
  return fallback;
};

export const useShoppingHelper = () => {
  const [available, setAvailable] = useState(false);
  const [unavailableReason, setUnavailableReason] = useState<string | null>(null);
  const [reportMonth, setReportMonth] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ShoppingSuggestion[]>([]);
  const [alreadyHave, setAlreadyHave] = useState<OwnedIngredient[]>([]);
  const [listItems, setListItems] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const markPending = (key: string, pending: boolean) =>
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (pending) next.add(key);
      else next.delete(key);
      return next;
    });

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [helperRes, listRes] = await Promise.all([getShoppingHelper(), getShoppingList()]);

      if (helperRes.success && helperRes.data) {
        setAvailable(helperRes.data.available);
        setUnavailableReason(helperRes.data.reason);
        setReportMonth(helperRes.data.basedOnReportMonth);
        setSuggestions(helperRes.data.toBuy.map(mapSuggestion));
        setAlreadyHave(helperRes.data.alreadyHave.map(mapOwnedIngredient));
      } else {
        setError(helperRes.error?.message || '추천을 불러올 수 없습니다.');
      }

      if (listRes.success && listRes.data) {
        setListItems(listRes.data.items.map(mapShoppingListItem));
      }
    } catch (err) {
      console.error('Failed to load shopping helper:', err);
      setError(getErrorMessage(err, '서버와 연결할 수 없습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addSuggestion = async (suggestion: ShoppingSuggestion) => {
    const key = `s-${suggestion.key}`;
    markPending(key, true);
    try {
      // 목록 조회 응답에 카탈로그 재료명이 없어서 customName에도 이름을 함께 보냄
      const res = await addShoppingListItem({
        ingredientCatalogId: suggestion.ingredientCatalogId ?? undefined,
        customName: suggestion.name,
        suggestedQuantity: suggestion.suggestedQuantity,
        unitId: suggestion.unitId,
        reason: SUGGESTION_REASON,
      });
      if (res.success && res.data) {
        const added = mapShoppingListItem(res.data);
        // unitName은 아직 백엔드에서 null이라 제안의 단위 라벨로 보완
        setListItems((prev) => [...prev, { ...added, quantityLabel: suggestion.quantityLabel }]);
        return null;
      }
      return res.error?.message || '장보기 리스트에 담지 못했어요.';
    } catch (err) {
      console.error('Failed to add shopping list item:', err);
      return getErrorMessage(err, '장보기 리스트에 담지 못했어요.');
    } finally {
      markPending(key, false);
    }
  };

  const addManualItem = async (input: ManualShoppingItemInput) => {
    // 직접 입력 재료는 백엔드 중복 체크(카탈로그 ID 기준)에 걸리지 않아 이름으로 막음
    const isDuplicate = listItems.some((it) => !it.isChecked && it.name === input.name);
    if (isDuplicate) return '이미 장보기 리스트에 있는 재료예요.';

    markPending(MANUAL_PENDING_KEY, true);
    try {
      const res = await addShoppingListItem({
        customName: input.name,
        suggestedQuantity: input.quantity,
        unitId: input.unitId,
      });
      if (res.success && res.data) {
        const added = mapShoppingListItem(res.data);
        // unitName은 아직 백엔드에서 null이라 선택한 단위 라벨로 보완
        const quantityLabel = input.quantity != null ? `${input.quantity}${input.unitLabel ?? ''}` : '';
        setListItems((prev) => [...prev, { ...added, quantityLabel }]);
        return null;
      }
      return res.error?.message || '장보기 리스트에 추가하지 못했어요.';
    } catch (err) {
      console.error('Failed to add manual shopping list item:', err);
      return getErrorMessage(err, '장보기 리스트에 추가하지 못했어요.');
    } finally {
      markPending(MANUAL_PENDING_KEY, false);
    }
  };

  const toggleCheck = async (item: ShoppingListItem) => {
    const key = `i-${item.id}`;
    const nextChecked = !item.isChecked;
    const setChecked = (checked: boolean) =>
      setListItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, isChecked: checked } : it)));

    // 낙관적 업데이트 후 실패 시 되돌림
    setChecked(nextChecked);
    markPending(key, true);
    try {
      const res = await updateShoppingListItemCheck(item.id, { isChecked: nextChecked });
      if (!res.success) {
        setChecked(item.isChecked);
        return res.error?.message || '상태를 바꾸지 못했어요.';
      }
      return null;
    } catch (err) {
      console.error('Failed to update shopping list item:', err);
      setChecked(item.isChecked);
      return getErrorMessage(err, '상태를 바꾸지 못했어요.');
    } finally {
      markPending(key, false);
    }
  };

  const deleteItem = async (item: ShoppingListItem) => {
    const key = `i-${item.id}`;
    markPending(key, true);
    try {
      const res = await deleteShoppingListItem(item.id);
      if (!res.success) {
        return res.error?.message || '항목을 삭제하지 못했어요.';
      }
      setListItems((prev) => prev.filter((it) => it.id !== item.id));
      return null;
    } catch (err) {
      console.error('Failed to delete shopping list item:', err);
      return getErrorMessage(err, '항목을 삭제하지 못했어요.');
    } finally {
      markPending(key, false);
    }
  };

  const addedKeys = new Set(listItems.map((it) => toIngredientKey(it.ingredientCatalogId, it.name)));

  return {
    available,
    unavailableReason,
    reportMonth,
    suggestions,
    alreadyHave,
    listItems,
    addedKeys,
    isLoading,
    error,
    isSuggestionPending: (key: string) => pendingIds.has(`s-${key}`),
    isItemPending: (id: number) => pendingIds.has(`i-${id}`),
    isManualAdding: pendingIds.has(MANUAL_PENDING_KEY),
    refresh: load,
    addSuggestion,
    addManualItem,
    toggleCheck,
    deleteItem,
  };
};
