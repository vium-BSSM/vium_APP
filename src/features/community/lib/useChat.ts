import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/shared/api/types';
import { createChatRoom, getChatMessages, getChatRooms, leaveChatRoom, sendChatMessage } from '../api/chatApi';
import { communityKeys } from './queryKeys';
import { SendMessageRequest } from '../types';

// TODO: 실시간 채팅(WebSocket/SSE) 명세가 없어 열려 있는 동안 주기적으로 새로 불러옴
const CHAT_POLL_MS = 5000;

export const useChatRooms = () => {
  const result = useInfiniteQuery({
    queryKey: communityKeys.chatRooms,
    queryFn: async ({ pageParam }) => unwrap(await getChatRooms(pageParam)),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    refetchInterval: CHAT_POLL_MS * 2,
  });

  return {
    rooms: result.data?.pages.flatMap((page) => page.chatRooms) ?? [],
    isLoading: result.isPending,
    error: result.error?.message ?? null,
    hasNextPage: result.hasNextPage,
    fetchNextPage: result.fetchNextPage,
    refetch: result.refetch,
    isRefetching: result.isRefetching,
  };
};

/** 메시지는 최신순으로 오므로 inverted 리스트에 그대로 사용 */
export const useChatMessages = (chatRoomId: number) => {
  const result = useInfiniteQuery({
    queryKey: communityKeys.chatMessages(chatRoomId),
    queryFn: async ({ pageParam }) => unwrap(await getChatMessages(chatRoomId, pageParam)),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    refetchInterval: CHAT_POLL_MS,
    enabled: Number.isFinite(chatRoomId),
  });

  return {
    messages: result.data?.pages.flatMap((page) => page.messages) ?? [],
    isLoading: result.isPending,
    error: result.error?.message ?? null,
    hasNextPage: result.hasNextPage,
    fetchNextPage: result.fetchNextPage,
  };
};

export const useSendMessage = (chatRoomId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: SendMessageRequest) => unwrap(await sendChatMessage(chatRoomId, request)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.chatMessages(chatRoomId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms });
    },
  });
};

/** 게시물 작성자와 채팅 시작 (이미 있으면 기존 방) — chatRoomId 반환 */
export const useOpenChatRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => unwrap(await createChatRoom(postId)).chatRoomId,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms }),
  });
};

export const useLeaveChatRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chatRoomId: number) => leaveChatRoom(chatRoomId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms }),
  });
};
