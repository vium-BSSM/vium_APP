import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Avatar } from '@/shared/ui';
import { formatClockTime, formatKoreanDate } from '@/shared/lib/dateFormat';
import { ChatMessage } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  partnerImageUrl: string | null;
  // 이 메시지부터 날짜가 바뀌면 위에 날짜 구분선
  showDate: boolean;
}

const Bubble: React.FC<{ message: ChatMessage; mine: boolean }> = ({ message, mine }) => {
  const shape = mine ? 'bg-primary-500 rounded-2xl rounded-br' : 'bg-white rounded-2xl rounded-bl';
  if (message.type === 'IMAGE' && message.imageUrl) {
    return (
      <View className={`${shape} overflow-hidden w-[180px] h-[180px]`}>
        <Image source={{ uri: message.imageUrl }} contentFit="cover" className="w-full h-full" />
      </View>
    );
  }
  return (
    <View className={`${shape} px-[14px] py-[9px] max-w-[240px]`}>
      <Text className="text-text15 font-sans text-text-100">{message.content}</Text>
    </View>
  );
};

/** Figma chat/room 메시지 — 날짜 구분선, 시스템 안내, 상대/내 말풍선 */
export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, partnerImageUrl, showDate }) => {
  const time = formatClockTime(message.sentAt);

  return (
    <View className="gap-[14px]">
      {showDate && (
        <View className="items-center">
          <Text className="px-3 py-[5px] text-text12 font-sans text-text-300">{formatKoreanDate(message.sentAt)}</Text>
        </View>
      )}

      {message.type === 'SYSTEM' ? (
        <View className="items-center">
          <View className="px-3 py-[5px] rounded-[14px] bg-primary-200">
            <Text className="text-text12 font-medium font-sans text-primary-700">{message.content}</Text>
          </View>
        </View>
      ) : message.isMine ? (
        <View className="flex-row items-end justify-end gap-1.5">
          {/* TODO: 메시지 응답에 상대 읽음 여부가 없어 '읽음' 표시는 생략 */}
          <Text className="text-text10 font-sans text-text-300">{time}</Text>
          <Bubble message={message} mine />
        </View>
      ) : (
        <View className="flex-row items-end gap-1.5">
          <Avatar uri={partnerImageUrl} size={32} />
          <Bubble message={message} mine={false} />
          <Text className="text-text10 font-sans text-text-300">{time}</Text>
        </View>
      )}
    </View>
  );
};
