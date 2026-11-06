import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Alert } from '@/shared/lib/alert';
import { confirmPurchase } from '../api/purchaseApi';
import { notifyInventoryChanged } from './inventoryEvents';
import { PurchaseConfirmItem, PurchaseDetail, PurchaseItemDraft } from '../types';

// 재료를 못 찾은 품목은 소비기한이 없으면 서버가 400으로 거절
export const canConfirmItem = (item: PurchaseItemDraft) =>
  item.ingredientCatalogId !== null || item.expiresOn !== null;

const toConfirmItem = (item: PurchaseItemDraft): PurchaseConfirmItem => ({
  purchaseItemId: item.purchaseItemId,
  ingredientCatalogId: item.ingredientCatalogId,
  customName: item.ingredientName ?? item.rawName,
  quantity: item.quantity,
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

  const confirmItems = async (purchase: PurchaseDetail, items: PurchaseItemDraft[]): Promise<boolean> => {
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

      Alert.alert('오류', response.error?.message || '재료 등록에 실패했습니다.');
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
      Alert.alert('오류', serverMessage || '재료 등록에 실패했습니다.');
      return false;
    } finally {
      setIsConfirming(false);
    }
  };

  return { confirmItems, isConfirming };
};
