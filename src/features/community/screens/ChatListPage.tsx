import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader, BackHeader, HeaderActions } from '@/shared/ui';
import { useMyProfile } from '@/features/account';
import { ChatRoomRow } from '../ui/ChatRoomRow';
import { MOCK_CHAT_ROOMS } from '../lib/mockData';

export const ChatListPage = () => {
  const router = useRouter();
  const { profile } = useMyProfile();
  // TODO(API): GET /api/me/chat-rooms 연결 (feature/community-api 브랜치)
  const rooms = MOCK_CHAT_ROOMS;

  return (
    <View className="flex-1 bg-white">
      {/* BackHeader(높이 52)가 위쪽에 약 14px 여백을 품고 있어 +20px이면 홈과 같은 34px */}
      <View className="mb-5">
        <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      </View>
      {/* 피드 말풍선 아이콘으로 들어오므로, 돌아갈 화면이 없으면 나눔 피드로 */}
      <BackHeader
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/community' as any))}
        className="mb-1"
      >
        <Text className="text-text22 font-medium font-sans text-text-100">채팅</Text>
      </BackHeader>

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
