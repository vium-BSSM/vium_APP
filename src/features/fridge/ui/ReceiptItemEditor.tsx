import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { AppTextInput, DatePicker, LabelInputWithUnit } from '@/shared/ui';
import { estimateExpiry } from '../api/ingredientCatalogApi';
import { useIngredientCatalogSearch } from '../lib/useIngredientCatalogSearch';
import { parseDateString, toDateString } from '../lib/dateUtils';
import { ReceiptItemForm, requiresExpiry } from '../lib/useReceiptConfirm';
import { CatalogSuggestions } from './CatalogSuggestions';
import { IngredientCatalogItem } from '../types';

interface ReceiptItemEditorProps {
  item: ReceiptItemForm;
  onChange: (patch: Partial<ReceiptItemForm>) => void;
  // 구매일 'YYYY-MM-DD' — 소비기한 자동 추정 기준
  purchasedOn: string;
}

const getExpiryHint = (item: ReceiptItemForm) => {
  if (!requiresExpiry(item)) return '비워두면 재료 기준으로 자동 계산돼요.';
  return item.ingredientCatalogId === null
    ? '목록에 없는 재료는 소비기한을 꼭 정해야 해요.'
    : '자동 계산이 안 되는 재료라 소비기한을 꼭 정해야 해요.';
};

/** 영수증 인식 품목 하나의 이름·수량·단위·소비기한 수정 */
export const ReceiptItemEditor: React.FC<ReceiptItemEditorProps> = ({ item, onChange, purchasedOn }) => {
  // 카탈로그 재료를 고른 상태면 검색하지 않음
  const { items: catalogItems, isLoading } = useIngredientCatalogSearch(item.name, item.ingredientCatalogId === null);
  // 재료를 연달아 바꾸면 마지막으로 고른 재료의 추정값만 반영
  const estimateSeq = useRef(0);

  const handleSelectCatalog = async (catalog: IngredientCatalogItem) => {
    onChange({ name: catalog.name, ingredientCatalogId: catalog.ingredientCatalogId, needsExpiry: false });
    if (item.expiryEdited) return;

    // 재료가 바뀌었으니 소비기한 기본값을 다시 채움 (GET /api/ingredients/estimate-expiry)
    const seq = ++estimateSeq.current;
    try {
      const response = await estimateExpiry({
        ingredientCatalogId: catalog.ingredientCatalogId,
        storageMethodId: item.storageMethodId ?? undefined,
        purchasedOn: purchasedOn || undefined,
      });
      if (seq !== estimateSeq.current || !response.success) return;
      const date = response.data?.estimatedExpiryDate ?? null;
      // 규칙이 없으면 직접 정해야 하는 품목으로 표시
      onChange({ expiresOn: date, needsExpiry: date === null });
    } catch (err) {
      console.warn('Failed to estimate expiry:', err);
    }
  };

  return (
    <View className="gap-3 pb-3">
      <View className="gap-2">
        <Text className="text-text16 text-neutral-200 font-medium font-sans">이름</Text>
        <View className="bg-neutral-50 rounded-lg px-2.5 h-[36px] justify-center">
          <AppTextInput
            className="text-text15 font-sans text-text-100"
            value={item.name}
            onChangeText={(name) => onChange({ name, ingredientCatalogId: null })}
            placeholder="재료 이름"
          />
        </View>
        {item.ingredientCatalogId === null && item.name.trim() !== '' && (
          <CatalogSuggestions
            items={catalogItems}
            isLoading={isLoading}
            onSelect={handleSelectCatalog}
          />
        )}
      </View>

      <LabelInputWithUnit
        label="수량"
        value={item.quantity}
        onChangeText={(quantity) => onChange({ quantity })}
        unitId={item.unitId}
        onUnitChange={(unitId) => onChange({ unitId })}
        keyboardType="decimal-pad"
      />

      <DatePicker
        label="소비기한"
        value={item.expiresOn ? parseDateString(item.expiresOn) : null}
        onChange={(date) => onChange({ expiresOn: toDateString(date), expiryEdited: true })}
      />
      {!item.expiresOn && (
        <Text className="text-text12 font-sans text-text-300">{getExpiryHint(item)}</Text>
      )}
    </View>
  );
};
