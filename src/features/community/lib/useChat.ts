import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/shared/api/types';
import { createChatRoom, getChatMessages, getChatRooms, leaveChatRoom, sendChatMessage } from '../api/chatApi';
import { communityKeys } from './queryKeys';
import { SendMessageRequest } from '../types';
import { useUserEventStreamStore } from '@/shared/lib/userEventStream';

// 실시간 스트림(SSE, useUserEventStream)이 끊겨 있을 때만 쓰는 대체 폴링 주기
const CHAT_POLL_MS = 5000;
// SSE는 새 메시지만 알려줌 — 방 나가기·새 방·다른 기기 읽음 처리 같은 목록 변경은 연결 중에도 긴 주기로 맞춤
const CHAT_ROOMS_STREAM_POLL_MS = 60 * 1000;

export const useChatRooms = () => {
  const streamConnected = useUserEventStreamStore((state) => state.connected);
  const result = useInfiniteQuery({
    queryKey: communityKeys.chatRooms,
    queryFn: async ({ pageParam }) => unwrap(await getChatRooms(pageParam)),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    refetchInterval: streamConnected ? CHAT_ROOMS_STREAM_POLL_MS : CHAT_POLL_MS * 2,
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
  const streamConnected = useUserEventStreamStore((state) => state.connected);
  const result = useInfiniteQuery({
    queryKey: communityKeys.chatMessages(chatRoomId),
    queryFn: async ({ pageParam }) => unwrap(await getChatMessages(chatRoomId, pageParam)),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    refetchInterval: streamConnected ? false : CHAT_POLL_MS,
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
