import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { DatePicker, LabelInputWithUnit } from '@/shared/ui';
import { useIngredientCatalogSearch } from '../lib/useIngredientCatalogSearch';
import { parseDateString, toDateString } from '../lib/dateUtils';
import { ReceiptItemForm } from '../lib/useReceiptConfirm';
import { CatalogSuggestions } from './CatalogSuggestions';

interface ReceiptItemEditorProps {
  item: ReceiptItemForm;
  onChange: (patch: Partial<ReceiptItemForm>) => void;
}

/** 영수증 인식 품목 하나의 이름·수량·단위·소비기한 수정 */
export const ReceiptItemEditor: React.FC<ReceiptItemEditorProps> = ({ item, onChange }) => {
  // 카탈로그 재료를 고른 상태면 검색하지 않음
  const { items: catalogItems, isLoading } = useIngredientCatalogSearch(item.name, item.ingredientCatalogId === null);

  return (
    <View className="gap-3 pb-3">
      <View className="gap-2">
        <Text className="text-text16 text-neutral-200 font-medium font-sans">이름</Text>
        <View className="bg-neutral-50 rounded-lg px-2.5 h-[36px] justify-center">
          <TextInput
            className="text-text15 font-sans text-text-100"
            style={{ fontFamily: 'Paperlogy' }}
            value={item.name}
            onChangeText={(name) => onChange({ name, ingredientCatalogId: null })}
            placeholder="재료 이름"
          />
        </View>
        {item.ingredientCatalogId === null && item.name.trim() !== '' && (
          <CatalogSuggestions
            items={catalogItems}
            isLoading={isLoading}
            onSelect={(catalog) => onChange({ name: catalog.name, ingredientCatalogId: catalog.ingredientCatalogId })}
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
        label={item.expiresOn ? '소비기한' : '소비기한 (미지정)'}
        value={item.expiresOn ? parseDateString(item.expiresOn) : new Date()}
        onChange={(date) => onChange({ expiresOn: toDateString(date) })}
      />
      {!item.expiresOn && (
        <Text className="text-text12 font-sans text-text-300">
          {item.ingredientCatalogId !== null
            ? '비워두면 재료 기준으로 자동 계산돼요.'
            : '목록에 없는 재료는 소비기한을 꼭 정해야 해요.'}
        </Text>
      )}
    </View>
  );
};
