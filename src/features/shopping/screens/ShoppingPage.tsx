import React from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/shared/ui';
import BackIcon from '@/../assets/icons/back-icon.svg';
import { useShoppingHelper } from '../lib/useShoppingHelper';
import { formatReportMonth } from '../lib/shoppingMapper';
import { ShoppingListItem, ShoppingSuggestion } from '../types';
import { SuggestionRow } from '../ui/SuggestionRow';
import { ShoppingListRow } from '../ui/ShoppingListRow';
import { ManualAddForm } from '../ui/ManualAddForm';

export const ShoppingPage: React.FC = () => {
  const router = useRouter();
  const {
    available,
    unavailableReason,
    reportMonth,
    suggestions,
    alreadyHave,
    listItems,
    addedKeys,
    isLoading,
    error,
    isSuggestionPending,
    isItemPending,
    isManualAdding,
    refresh,
    addSuggestion,
    addManualItem,
    toggleCheck,
    deleteItem,
  } = useShoppingHelper();

  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/main'));

  const handleAdd = async (suggestion: ShoppingSuggestion) => {
    const message = await addSuggestion(suggestion);
    if (message) Alert.alert('담기 실패', message);
  };

  const handleToggle = async (item: ShoppingListItem) => {
    const message = await toggleCheck(item);
    if (message) Alert.alert('변경 실패', message);
  };

  // 스와이프 후 버튼을 한 번 더 눌러야 해서 확인창 없이 바로 삭제
  const handleDelete = async (item: ShoppingListItem) => {
    const message = await deleteItem(item);
    if (message) {
      Alert.alert('삭제 실패', message);
      return false;
    }
    return true;
  };

  const monthLabel = formatReportMonth(reportMonth);
  const checkedCount = listItems.filter((it) => it.isChecked).length;
  // 체크 안 된 항목을 위로
  const sortedListItems = [...listItems].sort((a, b) => Number(a.isChecked) - Number(b.isChecked));

  return (
    <View className="flex-1 bg-white">
      <AppHeader />

      <View className="px-screen pt-10 pb-4">
        <Pressable onPress={handleBack} className="flex-row items-center gap-4 self-start" hitSlop={8}>
          <BackIcon width={30} height={30} color="#242529" />
          <Text className="text-heading-lg font-medium font-sans text-text-100">장보기 도우미</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center pb-[140px]">
          <ActivityIndicator color="#7EA069" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-screen pb-[140px] gap-4">
          <Text className="text-text14 font-sans text-text-200 text-center">{error}</Text>
          <Pressable className="rounded-3xl bg-primary-500 px-6 py-3" onPress={() => refresh()}>
            <Text className="text-text14 font-medium font-sans text-text-100">다시 시도</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View className="px-screen pt-4 items-center">
            <View className="w-full max-w-[480px] gap-10">
              <View className="gap-6">
                <View className="gap-3">
                  <Text className="text-text18 font-medium font-sans text-text-100">이번에 사면 좋을 재료</Text>
                  {available && monthLabel && (
                    <Text className="text-text15 font-sans text-text-300">
                      {/* 서버 기준: 지난달 소비량 − 현재 보유량을 지난달 폐기 비율(폐기 ÷ (소비+폐기))만큼 줄인 양 */}
                      {monthLabel}에 먹은 양에서 냉장고에 있는 양을 빼고,{'\n'}버린 비율만큼 줄여서 추천했어요.
                    </Text>
                  )}
                </View>

                {!available ? (
                  <View className="rounded-lg bg-neutral-10 p-5 gap-10">
                    <Text className="text-text14 font-medium font-sans text-text-100">
                      {unavailableReason ?? '아직 추천을 만들 수 없어요.'}
                    </Text>
                    <Text className="text-text12 font-sans text-text-200">
                      월간 리포트가 생기면 장보기 추천을 받을 수 있어요.
                    </Text>
                  </View>
                ) : suggestions.length === 0 ? (
                  <View className="rounded-lg bg-neutral-10 p-5">
                    <Text className="text-text14 font-sans text-text-200">지금은 더 살 재료가 없어요.</Text>
                  </View>
                ) : (
                  <View className="gap-2">
                    {suggestions.map((suggestion) => (
                      <SuggestionRow
                        key={suggestion.key}
                        suggestion={suggestion}
                        isAdded={addedKeys.has(suggestion.key)}
                        isPending={isSuggestionPending(suggestion.key)}
                        onAdd={() => handleAdd(suggestion)}
                      />
                    ))}
                  </View>
                )}

                {available && alreadyHave.length > 0 && (
                  <View className="gap-2 pt-1">
                    <Text className="text-text14 font-medium font-sans text-text-200">이미 냉장고에 있어요</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {alreadyHave.map((item) => (
                        <View key={item.key} className="rounded-3xl bg-neutral-10 px-3 py-1.5">
                          <Text className="text-text12 font-sans text-text-200">
                            {item.name} {item.quantityLabel}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View className="h-px bg-neutral-100" />

              {/* 장보기 리스트 */}
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-text18 font-medium font-sans text-text-100">장보기 리스트</Text>
                  {listItems.length > 0 && (
                    <Text className="text-text15 font-sans text-text-200 tabular-nums">
                      {checkedCount}/{listItems.length}
                    </Text>
                  )}
                </View>

                {listItems.length === 0 ? (
                  <Text className="text-text14 font-sans text-text-300 py-4">
                    추천 재료를 담거나 직접 추가해 보세요.
                  </Text>
                ) : (
                  <View>
                    <Text className="text-text15 font-sans text-text-300 pb-8">
                      항목을 왼쪽으로 밀면 삭제할 수 있어요.
                    </Text>
                    {sortedListItems.map((item, index) => (
                      <View key={item.id}>
                        {index > 0 && <View className="h-px bg-neutral-50" />}
                        <ShoppingListRow
                          item={item}
                          disabled={isItemPending(item.id)}
                          onToggle={() => handleToggle(item)}
                          onDelete={() => handleDelete(item)}
                        />
                      </View>
                    ))}
                  </View>
                )}

                <View className="mt-5">
                  <ManualAddForm
                    isSubmitting={isManualAdding}
                    onSubmit={addManualItem}
                    onError={(message) => Alert.alert('추가 실패', message)}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
