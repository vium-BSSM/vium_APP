import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { Button, Check } from '@/shared/ui';
import { canConfirmItem } from '../lib/useReceiptConfirm';
import { PurchaseDetail, PurchaseItemDraft } from '../types';

interface ReceiptConfirmModalProps {
  purchase: PurchaseDetail | null;
  isConfirming: boolean;
  onClose: () => void;
  onConfirm: (items: PurchaseItemDraft[]) => void;
}

/**
 * 영수증 인식 품목을 골라 등록하는 임시 모달
 * TODO: 확인 화면 디자인이 나오면 교체 (수량·소비기한 수정, 품목 추가)
 */
export const ReceiptConfirmModal: React.FC<ReceiptConfirmModalProps> = ({
  purchase,
  isConfirming,
  onClose,
  onConfirm,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 재료를 찾은 품목만 기본 선택 (못 찾은 품목은 비식품일 수 있음)
  useEffect(() => {
    const defaults = purchase?.items.filter((item) => item.ingredientCatalogId !== null) ?? [];
    setSelectedIds(new Set(defaults.map((item) => item.purchaseItemId)));
  }, [purchase]);

  const toggleItem = (item: PurchaseItemDraft) => {
    if (!canConfirmItem(item)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.purchaseItemId)) {
        next.delete(item.purchaseItemId);
      } else {
        next.add(item.purchaseItemId);
      }
      return next;
    });
  };

  const selectedItems = purchase?.items.filter((item) => selectedIds.has(item.purchaseItemId)) ?? [];

  return (
    <Modal visible={purchase !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 items-center justify-center px-6 py-10" onPress={onClose}>
        <Pressable
          className="bg-white rounded-lg w-full max-w-[400px] max-h-[80%] px-6 pt-[30px] pb-[25px] gap-5"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="items-center gap-2">
            <Text className="text-heading-lg font-medium font-sans text-text-100 text-center">
              {purchase?.items.length ?? 0}개 품목 인식
            </Text>
            <Text className="text-text14 font-sans text-text-200 text-center">
              냉장고에 등록할 품목을 선택해주세요.
            </Text>
          </View>

          <ScrollView className="flex-grow-0" contentContainerClassName="gap-1">
            {purchase?.items.map((item) => {
              const enabled = canConfirmItem(item);
              const selected = selectedIds.has(item.purchaseItemId);

              return (
                <Pressable
                  key={item.purchaseItemId}
                  className={`flex-row items-center gap-3 py-3 border-b border-neutral-50 ${enabled ? '' : 'opacity-40'}`}
                  disabled={!enabled}
                  onPress={() => toggleItem(item)}
                >
                  {selected ? (
                    <Check />
                  ) : (
                    <View className="w-[18px] h-[18px] rounded-full border border-neutral-100" />
                  )}
                  <View className="flex-1">
                    <Text className="text-text16 font-sans text-text-100">
                      {item.ingredientName ?? item.rawName}
                    </Text>
                    <Text className="text-text12 font-sans text-text-200">
                      {item.ingredientName ? `영수증: ${item.rawName} · ` : '재료 미확인 · '}
                      수량 {item.quantity}
                      {item.expiresOn ? ` · ~${item.expiresOn}` : ''}
                      {enabled ? '' : ' · 소비기한 없음'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <Button
            fullWidth
            loading={isConfirming}
            disabled={selectedItems.length === 0}
            onPress={() => onConfirm(selectedItems)}
          >
            {`${selectedItems.length}개 등록`}
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
