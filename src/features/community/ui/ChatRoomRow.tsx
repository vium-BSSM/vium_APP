import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Avatar } from '@/shared/ui';
import { formatListTime } from '@/shared/lib/dateFormat';
import { ChatRoomSummary } from '../types';

interface ChatRoomRowProps {
  room: ChatRoomSummary;
  onPress: () => void;
}

/** Figma chat-room-row — 상대 프로필·이름·시간·마지막 메시지 + 안 읽은 수 + 게시물 썸네일 */
export const ChatRoomRow: React.FC<ChatRoomRowProps> = ({ room, onPress }) => (
  <Pressable onPress={onPress} className="flex-row items-center gap-3 p-2.5 rounded-lg bg-white active:bg-text-400">
    <Avatar uri={room.partner.profileImageUrl} size={48} />
    <View className="flex-1 gap-[3px]">
      <View className="flex-row items-center gap-1.5">
        <Text className="text-text15 font-medium font-sans text-text-100" numberOfLines={1}>
          {room.partner.displayName}
        </Text>
        {room.lastMessage && (
          <Text className="text-text12 font-sans text-text-300">{formatListTime(room.lastMessage.sentAt)}</Text>
        )}
      </View>
      <Text className="text-text14 font-sans text-text-200" numberOfLines={1}>
        {room.lastMessage?.preview ?? '대화를 시작해보세요'}
      </Text>
    </View>
    <View className="flex-row items-center gap-3">
      {room.unreadCount > 0 && (
        <View className="min-w-[18px] px-1.5 py-px rounded-full bg-status-danger items-center">
          <Text className="text-text11 font-bold font-sans text-white">{room.unreadCount}</Text>
        </View>
      )}
      <View className="w-11 h-[30px] rounded-md bg-neutral-10 overflow-hidden items-center justify-center">
        {room.post.thumbnailUrl ? (
          <Image source={{ uri: room.post.thumbnailUrl }} contentFit="cover" className="w-full h-full" />
        ) : (
          <Text className="text-text12 font-medium font-sans text-text-100" numberOfLines={1}>
            {room.post.title.split(' ')[0]}
          </Text>
        )}
      </View>
    </View>
  </Pressable>
);
