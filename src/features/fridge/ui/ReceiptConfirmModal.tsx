import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Check } from '@/shared/ui';
import { canConfirmItem, ReceiptItemForm, toReceiptItemForm } from '../lib/useReceiptConfirm';
import { ReceiptItemEditor } from './ReceiptItemEditor';
import { PurchaseDetail } from '../types';

interface ReceiptConfirmModalProps {
  purchase: PurchaseDetail | null;
  isConfirming: boolean;
  onClose: () => void;
  onConfirm: (items: ReceiptItemForm[]) => void;
}

/**
 * 영수증 인식 품목을 확인·수정해서 등록하는 임시 모달
 * TODO: 확인 화면 디자인이 나오면 교체 (품목 추가 포함)
 */
export const ReceiptConfirmModal: React.FC<ReceiptConfirmModalProps> = ({
  purchase,
  isConfirming,
  onClose,
  onConfirm,
}) => {
  const [forms, setForms] = useState<ReceiptItemForm[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);

  // 재료를 찾은 품목만 기본 선택 (못 찾은 품목은 비식품일 수 있음)
  useEffect(() => {
    const items = purchase?.items ?? [];
    setForms(items.map(toReceiptItemForm));
    setSelectedIds(new Set(items.filter((item) => item.ingredientCatalogId !== null).map((item) => item.purchaseItemId)));
    setEditingId(null);
  }, [purchase]);

  const updateForm = (purchaseItemId: number, patch: Partial<ReceiptItemForm>) => {
    setForms((prev) => prev.map((form) => (form.purchaseItemId === purchaseItemId ? { ...form, ...patch } : form)));
  };

  const toggleItem = (form: ReceiptItemForm) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(form.purchaseItemId)) {
        next.delete(form.purchaseItemId);
      } else {
        next.add(form.purchaseItemId);
      }
      return next;
    });
  };

  // 수정하다 등록 조건이 깨진 품목은 선택돼 있어도 제외
  const selectedForms = forms.filter((form) => selectedIds.has(form.purchaseItemId) && canConfirmItem(form));

  return (
    <Modal visible={purchase !== null} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable className="flex-1 bg-black/50 items-center justify-center px-6 py-10" onPress={onClose}>
          <Pressable
            className="bg-white rounded-lg w-full max-w-[400px] max-h-[85%] px-6 pt-[30px] pb-[25px] gap-5"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center gap-2">
              <Text className="text-heading-lg font-medium font-sans text-text-100 text-center">
                {forms.length}개 품목 인식
              </Text>
              <Text className="text-text14 font-sans text-text-200 text-center">
                냉장고에 등록할 품목을 선택하고 필요하면 수정해주세요.
              </Text>
            </View>

            <ScrollView className="flex-grow-0" keyboardShouldPersistTaps="handled">
              {forms.map((form) => {
                const enabled = canConfirmItem(form);
                const selected = enabled && selectedIds.has(form.purchaseItemId);
                const isEditing = editingId === form.purchaseItemId;

                return (
                  <View key={form.purchaseItemId} className="border-b border-neutral-50">
                    <View className="flex-row items-center gap-3 py-3">
                      <Pressable
                        className={`flex-row flex-1 items-center gap-3 ${enabled ? '' : 'opacity-40'}`}
                        disabled={!enabled}
                        onPress={() => toggleItem(form)}
                      >
                        {selected ? (
                          <Check />
                        ) : (
                          <View className="w-[18px] h-[18px] rounded-full border border-neutral-100" />
                        )}
                        <View className="flex-1">
                          <Text className="text-text16 font-sans text-text-100">{form.name || '(이름 없음)'}</Text>
                          <Text className="text-text12 font-sans text-text-200">
                            {form.ingredientCatalogId !== null ? `영수증: ${form.rawName}` : '목록에 없는 재료'}
                            {` · 수량 ${form.quantity}`}
                            {form.expiresOn ? ` · ~${form.expiresOn}` : ''}
                          </Text>
                        </View>
                      </Pressable>
                      <Pressable hitSlop={8} onPress={() => setEditingId(isEditing ? null : form.purchaseItemId)}>
                        <Text className="text-text14 font-sans text-primary-700">{isEditing ? '완료' : '수정'}</Text>
                      </Pressable>
                    </View>

                    {isEditing && (
                      <ReceiptItemEditor item={form} onChange={(patch) => updateForm(form.purchaseItemId, patch)} />
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <Button
              fullWidth
              loading={isConfirming}
              disabled={selectedForms.length === 0}
              onPress={() => onConfirm(selectedForms)}
            >
              {`${selectedForms.length}개 등록`}
            </Button>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
