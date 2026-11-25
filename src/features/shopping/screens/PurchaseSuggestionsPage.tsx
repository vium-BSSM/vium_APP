import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/shared/ui';
import BackIcon from '@/../assets/icons/back-icon.svg';
import { usePurchaseSuggestions } from '../lib/usePurchaseSuggestions';
import { PurchaseAdjustment, PurchaseSuggestion } from '../types';

// 조정 종류별 배지 (줄이기 → 위험색, 건너뛰기·충분 → 보통색, 유지 → 초록)
const BADGE: Record<PurchaseAdjustment, { label: string; bg: string; text: string }> = {
  REDUCE_HALF: { label: '절반으로', bg: 'bg-status-danger-bg', text: 'text-status-danger-text' },
  REDUCE_SOME: { label: '조금 줄이기', bg: 'bg-status-danger-bg', text: 'text-status-danger-text' },
  SKIP: { label: '건너뛰기', bg: 'bg-status-normal-bg', text: 'text-status-normal-text' },
  HAVE_ENOUGH: { label: '충분해요', bg: 'bg-status-normal-bg', text: 'text-status-normal-text' },
  KEEP: { label: '그대로', bg: 'bg-primary-200', text: 'text-primary-800' },
};

const SuggestionCard: React.FC<{ item: PurchaseSuggestion }> = ({ item }) => {
  const badge = BADGE[item.adjustment] ?? BADGE.KEEP;
  return (
    <View className="rounded-lg bg-neutral-10 p-5 gap-3">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="flex-1 text-text16 font-medium font-sans text-text-100" numberOfLines={1}>
          {item.name}
        </Text>
        <View className={`rounded-3xl px-2.5 py-1 ${badge.bg}`}>
          <Text className={`text-text12 font-medium font-sans ${badge.text}`}>{badge.label}</Text>
        </View>
      </View>

      <View className="flex-row gap-4">
        <Text className="text-text14 font-sans text-text-200">
          추천 <Text className="font-medium text-text-100">{item.suggestedLabel}</Text>
        </Text>
        <Text className="text-text14 font-sans text-text-200">
          버린 비율 <Text className="font-medium text-text-100">{item.wastePercent}%</Text>
        </Text>
      </View>

      {/* 안내 문구는 서버가 주는 그대로 표시 */}
      <Text className="text-text14 font-sans text-text-200">{item.message}</Text>
    </View>
  );
};

/** 다음 구매량 제안 — 지난달 먹은 양·버린 양으로 다음에 살 양을 알려줌 */
export const PurchaseSuggestionsPage: React.FC = () => {
  const router = useRouter();
  const { available, periodLabel, items, isLoading, error, refetch } = usePurchaseSuggestions();

  const handleBack = () => (router.canGoBack() ? router.back() : router.navigate('/shopping' as any));

  return (
    <View className="flex-1 bg-white">
      <AppHeader />

      <View className="px-screen pt-10 pb-4">
        <Pressable onPress={handleBack} className="flex-row items-center gap-4 self-start" hitSlop={8}>
          <BackIcon width={30} height={30} color="#242529" />
          <Text className="text-heading-lg font-medium font-sans text-text-100">다음 구매량 제안</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center pb-[140px]">
          <ActivityIndicator color="#7EA069" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-screen pb-[140px] gap-4">
          <Text className="text-text14 font-sans text-text-200 text-center">{error}</Text>
          <Pressable className="rounded-3xl bg-primary-500 px-6 py-3" onPress={() => refetch()}>
            <Text className="text-text14 font-medium font-sans text-text-100">다시 시도</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
          <View className="px-screen pt-4 items-center">
            <View className="w-full max-w-[480px] gap-6">
              {!available || items.length === 0 ? (
                <View className="rounded-lg bg-neutral-10 p-5 gap-3">
                  <Text className="text-text14 font-medium font-sans text-text-100">아직 데이터가 없어요.</Text>
                  <Text className="text-text12 font-sans text-text-200">
                    재료를 다 먹거나 버린 기록이 쌓이면 다음에 살 양을 알려드릴게요.
                  </Text>
                </View>
              ) : (
                <>
                  <Text className="text-text15 font-sans text-text-300">
                    {periodLabel ? `${periodLabel} 동안 ` : ''}먹은 양과 버린 양을 보고{'\n'}다음에 살 양을
                    추천했어요.
                  </Text>
                  <View className="gap-2">
                    {items.map((item) => (
                      <SuggestionCard key={item.key} item={item} />
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
