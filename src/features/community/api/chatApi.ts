import { apiClient } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import { ChatMessage, ChatMessagesPage, ChatRoomsPage, SendMessageRequest } from '../types';

export const getChatRooms = async (cursor?: string): Promise<ApiResponse<ChatRoomsPage>> => {
  const response = await apiClient.get<ApiResponse<ChatRoomsPage>>('/api/me/chat-rooms', {
    params: { cursor, size: 20 },
  });
  return response.data;
};

/** 게시물 작성자와의 채팅방 — 이미 있으면 그 방을 돌려줌 */
export const createChatRoom = async (postId: number) => {
  const response = await apiClient.post<ApiResponse<{ chatRoomId: number; created: boolean }>>(
    `/api/posts/${postId}/chat-rooms`
  );
  return response.data;
};

export const leaveChatRoom = async (chatRoomId: number) => {
  const response = await apiClient.delete<ApiResponse<unknown>>(`/api/me/chat-rooms/${chatRoomId}`);
  return response.data;
};

/** 최신순 메시지 (조회 시점까지 읽음 처리됨) */
export const getChatMessages = async (chatRoomId: number, cursor?: string): Promise<ApiResponse<ChatMessagesPage>> => {
  const response = await apiClient.get<ApiResponse<ChatMessagesPage>>(`/api/me/chat-rooms/${chatRoomId}/messages`, {
    params: { cursor, size: 30 },
  });
  return response.data;
};

export const sendChatMessage = async (chatRoomId: number, request: SendMessageRequest) => {
  const response = await apiClient.post<ApiResponse<ChatMessage>>(`/api/me/chat-rooms/${chatRoomId}/messages`, request);
  return response.data;
};
