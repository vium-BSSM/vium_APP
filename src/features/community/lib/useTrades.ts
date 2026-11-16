import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/shared/api/types';
import { getMyTrades, getUserReviews, requestTrade, updateTrade, writeReview } from '../api/tradeApi';
import { communityKeys } from './queryKeys';
import { ReviewRequest, TradeAction, TradeRoleFilter } from '../types';

export const useMyTrades = (roleFilter: TradeRoleFilter) => {
  const role = roleFilter === 'ALL' ? undefined : roleFilter;
  const result = useInfiniteQuery({
    queryKey: communityKeys.trades(role),
    queryFn: async ({ pageParam }) => unwrap(await getMyTrades(role, pageParam)),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
  });

  return {
    trades: result.data?.pages.flatMap((page) => page.trades) ?? [],
    isLoading: result.isPending,
    error: result.error?.message ?? null,
    hasNextPage: result.hasNextPage,
    fetchNextPage: result.fetchNextPage,
    refetch: result.refetch,
    isRefetching: result.isRefetching,
  };
};

/** 거래 상태가 바뀌면 거래·게시물·채팅·크레딧 화면이 모두 영향을 받음 */
const useInvalidateTradeRelated = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: communityKeys.tradesAll });
    queryClient.invalidateQueries({ queryKey: communityKeys.postsAll });
    queryClient.invalidateQueries({ queryKey: ['post'] });
    queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms });
    queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    queryClient.invalidateQueries({ queryKey: ['credits'] });
  };
};

export const useRequestTrade = () => {
  const invalidate = useInvalidateTradeRelated();
  return useMutation({
    mutationFn: async (postId: number) => unwrap(await requestTrade(postId)),
    onSuccess: invalidate,
  });
};

export const useTradeAction = () => {
  const invalidate = useInvalidateTradeRelated();
  return useMutation({
    mutationFn: async ({ tradeId, action }: { tradeId: number; action: TradeAction }) =>
      unwrap(await updateTrade(tradeId, action)),
    onSuccess: invalidate,
  });
};

export const useWriteReview = (tradeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: ReviewRequest) => unwrap(await writeReview(tradeId, request)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityKeys.tradesAll }),
  });
};

/** 상대방 매너 점수 (채팅방 상단) */
export const useUserManner = (userId: number | undefined) => {
  const query = useQuery({
    queryKey: communityKeys.userReviews(userId ?? 0),
    queryFn: async () => unwrap(await getUserReviews(userId!)),
    enabled: userId !== undefined,
    staleTime: 5 * 60 * 1000,
  });
  return query.data?.mannerScore ?? null;
};
