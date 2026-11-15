import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Alert } from '@/shared/lib/alert';
import { confirmPurchase } from '../api/purchaseApi';
import { notifyInventoryChanged } from './inventoryEvents';
import { PurchaseConfirmItem, PurchaseDetail, PurchaseItemDraft } from '../types';

/** 확인 모달에서 수정 중인 품목 (인식 결과로 시작) */
export interface ReceiptItemForm {
  purchaseItemId: number;
  rawName: string;
  name: string;
  // 이름을 직접 고치면 null (카탈로그 후보를 다시 고르면 채워짐)
  ingredientCatalogId: number | null;
  quantity: string;
  unitId: number;
  storageMethodId: number | null;
  amount: number | null;
  expiresOn: string | null; // 'YYYY-MM-DD'
  // 재료는 찾았지만 소비기한 자동 계산에 실패한 품목 (날짜를 직접 정해야 서버가 받아줌)
  needsExpiry: boolean;
}

export const toReceiptItemForm = (item: PurchaseItemDraft): ReceiptItemForm => ({
  purchaseItemId: item.purchaseItemId,
  rawName: item.rawName,
  name: item.ingredientName ?? item.rawName,
  ingredientCatalogId: item.ingredientCatalogId,
  quantity: String(item.quantity),
  unitId: item.unitId,
  storageMethodId: item.storageMethodId,
  amount: item.amount,
  expiresOn: item.expiresOn,
  needsExpiry: item.ingredientCatalogId !== null && item.expiresOn === null,
});

/** 소비기한을 직접 정해야 하는 품목인지 (목록에 없는 재료 또는 자동 계산 실패) */
export const requiresExpiry = (item: ReceiptItemForm) => item.ingredientCatalogId === null || item.needsExpiry;

const formatMonthDay = (dateString: string) => {
  const [, month, day] = dateString.split('-');
  return `${Number(month)}/${Number(day)}`;
};

/**
 * 품목을 등록할 수 없는 이유 (등록 가능하면 null)
 * 서버가 400으로 거절하는 조건을 미리 걸러 어느 품목이 왜 막혔는지 보여줌
 * @param purchasedOn 구매일 'YYYY-MM-DD' (소비기한은 이보다 빠를 수 없음)
 */
export const getBlockReason = (item: ReceiptItemForm, purchasedOn: string): string | null => {
  if (item.name.trim() === '') return '이름을 입력해주세요.';
  if (!(parseFloat(item.quantity) > 0)) return '수량을 입력해주세요.';
  if (item.expiresOn === null) {
    if (item.ingredientCatalogId === null) return '목록에 없는 재료라 소비기한을 정해주세요.';
    if (item.needsExpiry) return '소비기한을 자동으로 계산할 수 없어요. 직접 정해주세요.';
  }
  if (item.expiresOn !== null && item.expiresOn < purchasedOn) {
    return `소비기한이 구매일(${formatMonthDay(purchasedOn)})보다 빨라요.`;
  }
  return null;
};

/** ISO OffsetDateTime → 'YYYY-MM-DD' (서버가 준 시간대 기준 날짜) */
export const toPurchasedOn = (purchasedAt: string) => purchasedAt.split('T')[0];

// 서버의 개발자용 오류 문구를 사용자용 문구로 변환
const SERVER_MESSAGE_MAP: [string, string][] = [
  ['소비기한을 추정할 수 없습니다', '소비기한을 자동으로 계산할 수 없는 품목이 있어요. 소비기한을 직접 정해주세요.'],
  ['expiresOn은 purchasedOn보다', '소비기한이 구매일보다 빠른 품목이 있어요.'],
  ['요청 본문의 형식', '입력한 내용 중 형식이 잘못된 값이 있어요.'],
];

const toUserMessage = (serverMessage: string | undefined) => {
  if (!serverMessage) return '재료 등록에 실패했습니다.';
  return SERVER_MESSAGE_MAP.find(([key]) => serverMessage.includes(key))?.[1] ?? serverMessage;
};

const toConfirmItem = (item: ReceiptItemForm): PurchaseConfirmItem => ({
  purchaseItemId: item.purchaseItemId,
  ingredientCatalogId: item.ingredientCatalogId,
  customName: item.name.trim(),
  quantity: parseFloat(item.quantity),
  unitId: item.unitId,
  storageMethodId: item.storageMethodId ?? undefined,
  amount: item.amount ?? undefined,
  expiresOn: item.expiresOn ?? undefined,
});

/**
 * 영수증 인식(DRAFT) 구매 내역에서 고른 품목만 재고에 등록
 * 고르지 않은 품목은 등록되지 않음
 */
export const useReceiptConfirm = () => {
  const [isConfirming, setIsConfirming] = useState(false);

  const confirmItems = async (purchase: PurchaseDetail, items: ReceiptItemForm[]): Promise<boolean> => {
    try {
      setIsConfirming(true);

      const response = await confirmPurchase(purchase.purchaseId, {
        purchaseSourceId: purchase.purchaseSourceId,
        purchasedAt: purchase.purchasedAt,
        items: items.map(toConfirmItem),
      });

      if (response.success) {
        notifyInventoryChanged();
        Alert.alert('성공', `${response.data?.ingredients.length ?? items.length}개 재료가 등록되었습니다.`);
        return true;
      }

      Alert.alert('오류', toUserMessage(response.error?.message));
      return false;
    } catch (err) {
      console.error('Failed to confirm purchase:', err);

      if (isAxiosError(err) && err.response?.data?.error?.code === 'PURCHASE_ALREADY_CONFIRMED') {
        Alert.alert('알림', '이미 등록된 영수증이에요.');
        return true;
      }

      if (isAxiosError(err) && !err.response) {
        Alert.alert('오류', '서버와 연결할 수 없습니다.');
        return false;
      }

      const serverMessage = isAxiosError(err) ? err.response?.data?.error?.message : undefined;
      Alert.alert('오류', toUserMessage(serverMessage));
      return false;
    } finally {
      setIsConfirming(false);
    }
  };

  return { confirmItems, isConfirming };
};
