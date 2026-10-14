import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useIngredientsList } from '../lib/useIngredientsList';
import { fridgeCleanupStore } from '../lib/fridgeCleanupStore';
import { AppHeader, Button, PageTitle } from '@/shared/ui';
import BackIcon from '@/../assets/icons/back-icon.svg';

export const FridgeCleanupSelectPage: React.FC = () => {
  const router = useRouter();
  const { items, isLoading, error } = useIngredientsList();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNext = () => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    fridgeCleanupStore.setSelectedItems(selectedItems);
    router.push('/fridge/cleanup/amount' as any);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AppHeader />

        <View className="flex-1 px-screen md:px-10 lg:px-20 pt-6 items-center">
          <View className="w-full max-w-[480px] gap-12">
            <View className="gap-6">
              <Pressable
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/fridge' as any))}
                hitSlop={8}
                className="self-start"
              >
                <BackIcon width={30} height={30} />
              </Pressable>
              <PageTitle>
                다 먹었거나 폐기할{'\n'}재료를 선택해 주세요
              </PageTitle>
            </View>

            {isLoading ? (
              <View className="items-center py-10">
                <ActivityIndicator size="large" color="#A2CD87" />
              </View>
            ) : error ? (
              <Text className="text-text14 text-text-200 font-sans text-center py-10">
                {error}
              </Text>
            ) : items.length === 0 ? (
              <Text className="text-text14 text-text-200 font-sans text-center py-10">
                등록된 재료가 없습니다.
              </Text>
            ) : (
              <View className="gap-6">
                {items.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => toggleSelect(item.id)}
                      className={`rounded-lg px-5 py-2.5 border-2 ${
                        isSelected
                          ? 'bg-primary-200 border-primary-600'
                          : 'bg-white border-neutral-100'
                      }`}
                    >
                      <Text className="text-subtitle font-sans text-text-100">
                        {item.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={handleNext} disabled={selectedIds.size === 0}>
          다음
        </Button>
      </View>
    </View>
  );
};
