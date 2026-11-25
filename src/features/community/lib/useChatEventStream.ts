import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeUserEvents } from '@/shared/lib/userEventStream';
import { communityKeys } from './queryKeys';

interface ChatMessageEventData {
  chatRoomId: number;
  messageId: number;
}

/**
 * 사용자 이벤트 스트림의 chat-message를 받아 해당 방 메시지와 채팅 목록을 다시 불러옴.
 * 연결 자체는 (tabs) 레이아웃의 useUserEventStream이 담당.
 */
export const useChatEventStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleChatMessage = (raw: string) => {
      let chatRoomId: unknown;
      try {
        chatRoomId = (JSON.parse(raw) as Partial<ChatMessageEventData>).chatRoomId;
      } catch {
        chatRoomId = undefined;
      }
      // 형식이 다르면 어느 방인지 모르므로 열려 있는 채팅방 메시지를 모두 갱신
      queryClient.invalidateQueries({
        queryKey: typeof chatRoomId === 'number' ? communityKeys.chatMessages(chatRoomId) : ['chatMessages'],
      });
      queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms });
    };

    return subscribeUserEvents({
      // 끊겨 있던 동안 온 메시지를 놓치지 않도록 한 번 맞춤
      onOpen: () => {
        queryClient.invalidateQueries({ queryKey: communityKeys.chatRooms });
        queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      },
      onEvent: (event, data) => {
        if (event === 'chat-message') handleChatMessage(data);
      },
    });
  }, [queryClient]);
};
