import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader, HeaderActions } from '@/shared/ui';
import { useMyProfile } from '@/features/account';
import { ChatRoomRow } from '../ui/ChatRoomRow';
import { ChatRoomSummary } from '../types';

export const ChatListPage = () => {
  const router = useRouter();
  const { profile } = useMyProfile();
  // TODO(API): GET /api/me/chat-rooms 연결 (feature/community-api 브랜치)
  const rooms: ChatRoomSummary[] = [];

  return (
    <View className="flex-1 bg-white">
      <View className="mb-2">
        <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      </View>
      <View className="px-screen md:px-10 lg:px-20 pt-1.5 pb-[14px]">
        <Text className="text-text22 font-medium font-sans text-text-100">채팅</Text>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(room) => String(room.chatRoomId)}
        renderItem={({ item }) => (
          <ChatRoomRow room={item} onPress={() => router.push(`/community/chat/${item.chatRoomId}` as any)} />
        )}
        ItemSeparatorComponent={() => <View className="h-1.5" />}
        ListEmptyComponent={
          <Text className="text-text14 font-sans text-text-300 text-center mt-10">
            아직 대화가 없어요. 나눔 글에서 채팅을 시작해보세요
          </Text>
        }
        contentContainerClassName="px-screen md:px-10 lg:px-20 pt-2.5 pb-[140px]"
      />
    </View>
  );
};
