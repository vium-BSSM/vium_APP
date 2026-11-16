import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '@/shared/ui';
import { FridgeItem } from '@/features/fridge';
import { formatDday, getDaysLeft } from '@/shared/lib/dateFormat';

interface IngredientPickerSheetProps {
  visible: boolean;
  items: FridgeItem[];
  isLoading: boolean;
  selectedId: number | null;
  onSelect: (item: FridgeItem) => void;
  onClose: () => void;
}

/** 글쓰기에서 올릴 내 재료 고르기 (디자인에 없는 화면 — 기존 토큰으로 구성) */
export const IngredientPickerSheet: React.FC<IngredientPickerSheetProps> = ({
  visible,
  items,
  isLoading,
  selectedId,
  onSelect,
  onClose,
}) => (
  <BottomSheet visible={visible} onClose={onClose}>
    <View className="w-full pt-6 gap-4">
      <Text className="text-heading-md font-medium font-sans text-text-100">어떤 재료를 올릴까요?</Text>
      {isLoading ? (
        <ActivityIndicator className="my-10" color="#A2CD87" />
      ) : items.length === 0 ? (
        <Text className="text-text14 font-sans text-text-300 text-center my-10">냉장고에 등록된 재료가 없어요</Text>
      ) : (
        <ScrollView className="max-h-[360px]">
          <View className="gap-2">
            {items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => onSelect(item)}
                className={`flex-row items-center justify-between px-[14px] py-3 rounded-lg ${
                  item.id === selectedId ? 'bg-primary-200' : 'bg-primary-100'
                }`}
              >
                <Text className="text-text15 font-medium font-sans text-text-100">
                  {item.title} {item.remainingQuantity}
                  {item.unit}
                </Text>
                <Text className="text-text12 font-sans text-text-200">
                  소비기한 {formatDday(getDaysLeft(item.expiresOn))}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  </BottomSheet>
);
