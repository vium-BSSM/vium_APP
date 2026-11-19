import { useState } from 'react';
import { getErrorCode, getErrorMessage } from '@/shared/api/types';
import { updateIngredientStatus } from '../api/ingredientsApi';
import { notifyInventoryChanged } from './inventoryEvents';
import { IngredientStatusUpdateRequest } from '../types';

// 실패 시 서버가 보낸 사유(예: 게시물에 올라간 재고는 사용할 수 없습니다.)를 담는다
export type StatusUpdateResult = { ok: true } | { ok: false; message: string };

const FALLBACK_MESSAGE = '재료 상태를 변경하지 못했습니다.';

// 서버 에러 코드별로 사용자가 할 일을 알려주는 문구
const FRIENDLY_MESSAGES: Record<string, string> = {
  INVENTORY_LOCKED: '커뮤니티에 올린 재료예요. 게시물을 내린 뒤 정리해주세요.',
};

const toMessage = (code: string | null | undefined, serverMessage: string) =>
  (code && FRIENDLY_MESSAGES[code]) || serverMessage;

export const useIngredientStatusUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    ingredientId: number,
    request: IngredientStatusUpdateRequest
  ): Promise<StatusUpdateResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await updateIngredientStatus(ingredientId, request);

      if (response.success) {
        notifyInventoryChanged();
        return { ok: true };
      }
      const message = toMessage(response.error?.code, response.error?.message || FALLBACK_MESSAGE);
      setError(message);
      return { ok: false, message };
    } catch (err) {
      console.error('Failed to update ingredient status:', err);
      const message = toMessage(getErrorCode(err), getErrorMessage(err, '서버와 연결할 수 없습니다.'));
      setError(message);
      return { ok: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateStatus,
    isLoading,
    error,
  };
};

/** 실패한 재료를 "재료명: 사유" 줄로 묶는다 (같은 사유는 재료명만 이어 붙임) */
export const formatStatusFailures = (failures: { title: string; message: string }[]): string => {
  const byMessage = new Map<string, string[]>();
  failures.forEach(({ title, message }) => {
    byMessage.set(message, [...(byMessage.get(message) ?? []), title]);
  });
  return [...byMessage.entries()].map(([message, titles]) => `${titles.join(', ')}\n→ ${message}`).join('\n\n');
};
