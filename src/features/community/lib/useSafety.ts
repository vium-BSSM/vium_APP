import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/shared/api/types';
import { blockUser, createReport, getBlockedUsers, unblockUser } from '../api/safetyApi';
import { communityKeys } from './queryKeys';
import { ReportRequest } from '../types';

export const useReport = () =>
  useMutation({
    mutationFn: async (request: ReportRequest) => unwrap(await createReport(request)),
  });

export const useBlockedUsers = () => {
  const query = useQuery({
    queryKey: communityKeys.blocks,
    queryFn: async () => unwrap(await getBlockedUsers()),
  });
  return { blockedUsers: query.data?.blockedUsers ?? [], isLoading: query.isPending, error: query.error?.message ?? null };
};

/** 차단·해제하면 피드·채팅 목록에 보이는 대상이 바뀜 */
export const useToggleBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, block }: { userId: number; block: boolean }) =>
      unwrap(await (block ? blockUser(userId) : unblockUser(userId))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.blocks });
      queryClient.invalidateQueries({ queryKey: communityKeys.postsAll });
      queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms });
    },
  });
};
