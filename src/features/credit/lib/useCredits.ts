import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/shared/api/types';
import { claimDailyReward, getCreditTransactions, getCredits } from '../api/creditApi';
import { CreditFilter, CreditTransactionType } from '../types';

// 거래 화면에서도 ['credits'] 접두사로 무효화함
export const creditKeys = {
  all: ['credits'] as const,
  balance: ['credits', 'balance'] as const,
  transactions: ['credits', 'transactions'] as const,
};

const FILTER_TYPES: Record<Exclude<CreditFilter, 'all'>, CreditTransactionType[]> = {
  earn: ['SIGNUP_REWARD', 'AD_REWARD', 'DAILY_REWARD', 'SAVING_BONUS', 'TRADE_INCOME'],
  use: ['AI_REPORT'],
  hold: ['TRADE_HOLD', 'TRADE_REFUND'],
};

export const useCreditBalance = () => {
  const query = useQuery({
    queryKey: creditKeys.balance,
    queryFn: async () => unwrap(await getCredits()),
  });
  return { balance: query.data ?? null, isLoading: query.isPending, error: query.error?.message ?? null };
};

/** 크레딧 내역 — 필터 묶음(적립/사용/보류·환불)이 API type 하나로 표현되지 않아 받아온 목록에서 거름 */
export const useCreditTransactions = (filter: CreditFilter) => {
  const result = useInfiniteQuery({
    queryKey: creditKeys.transactions,
    queryFn: async ({ pageParam }) => unwrap(await getCreditTransactions(pageParam)),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  });

  const transactions = useMemo(() => {
    const all = result.data?.pages.flatMap((page) => page.transactions) ?? [];
    return filter === 'all' ? all : all.filter((tx) => FILTER_TYPES[filter].includes(tx.type));
  }, [result.data, filter]);

  return {
    transactions,
    isLoading: result.isPending,
    error: result.error?.message ?? null,
    hasNextPage: result.hasNextPage,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};

export const useDailyReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => unwrap(await claimDailyReward()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: creditKeys.all }),
  });
};
