import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { AppHeader, BackHeader, Chip, HeaderActions } from '@/shared/ui';
import { useMyProfile } from '@/features/account';
import { Alert } from '@/shared/lib/alert';
import { getErrorCode, getErrorMessage } from '@/shared/api/types';
import { useCreditBalance, useCreditTransactions, useDailyReward } from '../lib/useCredits';
import { CreditTxRow } from '../ui/CreditTxRow';
import { CreditFilter } from '../types';

const FILTERS: { key: CreditFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'earn', label: '적립' },
  { key: 'use', label: '사용' },
  { key: 'hold', label: '보류·환불' },
];

export const CreditWalletPage = () => {
  const { profile } = useMyProfile();
  const [filter, setFilter] = useState<CreditFilter>('all');
  const { balance } = useCreditBalance();
  const { transactions, isLoading, error, hasNextPage, fetchNextPage } = useCreditTransactions(filter);
  const dailyReward = useDailyReward();

  const handleDailyReward = () =>
    dailyReward.mutate(undefined, {
      onSuccess: (result) => Alert.alert('출석 완료', `${result.amount} 크레딧을 받았어요!`),
      onError: (err) =>
        Alert.alert(
          getErrorCode(err) === 'DAILY_REWARD_ALREADY_CLAIMED' ? '이미 받았어요' : '출석 실패',
          getErrorMessage(err, '출석 보상을 받지 못했어요.')
        ),
    });

  // TODO: 광고 보상은 오퍼월 SDK 연동 필요 (서버는 /api/credits/offerwall/callback으로 지급)
  const handleAdReward = () => Alert.alert('준비 중', '광고 보고 크레딧 받기는 곧 열려요.');

  const header = (
    <View className="gap-[53px] pt-2 pb-4">
      <View className="gap-4">
        <View className="bg-primary-200 rounded-lg px-5 pt-5 pb-[18px] gap-[14px]">
          <View className="gap-0.5">
            <Text className="text-text14 font-sans text-text-100">사용 가능</Text>
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-heading-lg font-medium font-sans text-text-100">{balance?.availableBalance ?? '-'}</Text>
              <Text className="text-text16 font-sans text-text-100">크레딧</Text>
            </View>
          </View>
          <View className="h-px bg-primary-600" />
          <View className="flex-row">
            <Text className="flex-1 text-text14 font-sans text-text-100">거래에 보류 중</Text>
            <Text className="text-text14 font-sans text-text-100">{balance?.heldBalance ?? 0} 크레딧</Text>
          </View>
        </View>

        <View className="flex-row gap-2.5">
          <Pressable
            onPress={handleDailyReward}
            disabled={dailyReward.isPending}
            className="flex-1 bg-secondary-200 rounded-lg px-4 py-[14px] gap-1.5"
          >
            <Text className="text-text15 font-sans text-text-100">출석 체크</Text>
            <Text className="text-text12 font-sans text-text-200">하루 한 번 · 최대 8</Text>
          </Pressable>
          <Pressable onPress={handleAdReward} className="flex-1 bg-primary-100 rounded-lg px-4 py-[14px] gap-1.5">
            <Text className="text-text15 font-sans text-text-100">광고 보고 받기</Text>
            <Text className="text-text12 font-sans text-text-200">광고 1개당 2 크레딧</Text>
          </Pressable>
        </View>
      </View>

      <View className="gap-4">
        <Text className="text-text18 font-sans text-text-100">크레딧 내역</Text>
        <View className="flex-row gap-1.5">
          {FILTERS.map((option) => (
            <Chip
              key={option.key}
              label={option.label}
              size="sm"
              selected={filter === option.key}
              onPress={() => setFilter(option.key)}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      <View className="mt-2">
        <BackHeader title="내 크레딧" />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(tx) => String(tx.transactionId)}
        renderItem={({ item }) => <CreditTxRow tx={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator className="mt-6" color="#A2CD87" />
          ) : (
            <Text className="text-text14 font-sans text-text-300 text-center mt-6">{error ?? '내역이 없어요'}</Text>
          )
        }
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        contentContainerClassName="px-screen md:px-10 lg:px-20 pb-[140px]"
      />
    </View>
  );
};
