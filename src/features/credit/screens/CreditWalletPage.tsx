import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { AppHeader, BackHeader, Chip, HeaderActions } from '@/shared/ui';
import { useMyProfile } from '@/features/account';
import { Alert } from '@/shared/lib/alert';
import { CreditTxRow } from '../ui/CreditTxRow';
import { MOCK_CREDIT_BALANCE, MOCK_CREDIT_TRANSACTIONS } from '../lib/mockData';
import { CreditBalance, CreditFilter, CreditTransaction, CreditTransactionType } from '../types';

const FILTER_TYPES: Record<Exclude<CreditFilter, 'all'>, CreditTransactionType[]> = {
  earn: ['SIGNUP_REWARD', 'AD_REWARD', 'DAILY_REWARD', 'SAVING_BONUS', 'TRADE_INCOME'],
  use: ['AI_REPORT'],
  hold: ['TRADE_HOLD', 'TRADE_REFUND'],
};

const FILTERS: { key: CreditFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'earn', label: '적립' },
  { key: 'use', label: '사용' },
  { key: 'hold', label: '보류·환불' },
];

export const CreditWalletPage = () => {
  const { profile } = useMyProfile();
  const [filter, setFilter] = useState<CreditFilter>('all');
  // TODO(API): GET /api/me/credits, GET /api/me/credits/transactions 연결 (feature/community-api 브랜치)
  const balance: CreditBalance | null = MOCK_CREDIT_BALANCE;
  const allTransactions: CreditTransaction[] = MOCK_CREDIT_TRANSACTIONS;
  const transactions =
    filter === 'all' ? allTransactions : allTransactions.filter((tx) => FILTER_TYPES[filter].includes(tx.type));

  // TODO(API): POST /api/me/credits/daily-reward
  const handleDailyReward = () => Alert.alert('준비 중', '출석 체크 API 연결 전이에요.');

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
      {/* BackHeader(높이 52)가 위쪽에 약 14px 여백을 품고 있어 +20px이면 홈과 같은 34px */}
      <View className="mt-5">
        <BackHeader title="내 크레딧" />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(tx) => String(tx.transactionId)}
        renderItem={({ item }) => <CreditTxRow tx={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={<Text className="text-text14 font-sans text-text-300 text-center mt-6">내역이 없어요</Text>}
        contentContainerClassName="px-screen md:px-10 lg:px-20 pb-[140px]"
      />
    </View>
  );
};
