import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppTextInput, BackHeader, HeaderActions } from '@/shared/ui';
import { checkProfileImage, useMyProfile } from '@/features/account';
import { Alert } from '@/shared/lib/alert';
import { pickImageAssetFromLibrary } from '@/shared/lib/pickImage';
import { isSameDay } from '@/shared/lib/dateFormat';
import MoreIcon from '@/../assets/icons/more-icon.svg';
import CameraLineIcon from '@/../assets/icons/camera-line-icon.svg';
import SendIcon from '@/../assets/icons/send-icon.svg';
import { formatPrice, postStatusBadge, tradeStatusBadge } from '../lib/communityFormat';
import { ChatMessageItem } from '../ui/ChatMessageItem';
import { CommunityBadge } from '../ui/CommunityBadge';
import { ChatMessage, TradeAction, TradeSummary } from '../types';
import { MOCK_CHAT_MESSAGES, MOCK_CHAT_ROOMS, MOCK_MANNER_BY_USER, MOCK_TRADES } from '../lib/mockData';

const MESSAGE_MAX_LENGTH = 1000;

/** 상단 게시물 띠의 거래 버튼 — 판매자: 거절/수락, 구매자: 취소/받았어요 */
const getStripActions = (trade: TradeSummary | undefined): { label: string; action: TradeAction; primary: boolean }[] => {
  if (!trade) return [];
  if (trade.status === 'REQUESTED') {
    return trade.role === 'SELLER'
      ? [
          { label: '거절', action: 'reject', primary: false },
          { label: '수락', action: 'accept', primary: true },
        ]
      : [{ label: '요청 취소', action: 'cancel', primary: false }];
  }
  if (trade.status === 'ACCEPTED' && trade.role === 'BUYER') {
    return [
      { label: '취소', action: 'cancel', primary: false },
      { label: '받았어요', action: 'complete', primary: true },
    ];
  }
  return [];
};

export const ChatRoomPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useMyProfile();
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatRoomId = Number(id);
  // TODO(API): 채팅방 정보(GET /api/me/chat-rooms), 상대 매너(GET /api/users/{id}/reviews),
  // 거래 상태(GET /api/me/trades), 메시지(GET/POST .../messages) 연결 — feature/community-api 브랜치
  const room = MOCK_CHAT_ROOMS.find((item) => item.chatRoomId === chatRoomId);
  const manner = room ? (MOCK_MANNER_BY_USER[room.partner.userId] ?? null) : null;
  const trade: TradeSummary | undefined = room ? MOCK_TRADES.find((item) => item.post.postId === room.post.postId) : undefined;
  const [messages, setMessages] = useState<ChatMessage[]>(chatRoomId === 3 ? MOCK_CHAT_MESSAGES : []);
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const badge = trade ? tradeStatusBadge(trade.status) : room ? postStatusBadge(room.post.status) : null;
  const stripActions = getStripActions(trade);

  // TODO(API): POST /api/me/chat-rooms/{chatRoomId}/messages — 지금은 화면에만 추가
  const handleSend = () => {
    const content = text.trim();
    if (!content) return;
    const now = new Date().toISOString();
    setMessages((prev) => [
      { messageId: Date.now(), chatRoomId, senderId: null, type: 'TEXT', content, imageUrl: null, systemEvent: null, sentAt: now, isMine: true },
      ...prev,
    ]);
    setText('');
  };

  // TODO(API): 사진 업로드(purpose=CHAT) 후 IMAGE 메시지 전송
  const handleSendImage = async () => {
    const image = await pickImageAssetFromLibrary({ quality: 0.8, allowsEditing: false });
    if (!image) return;
    const checked = checkProfileImage(image);
    if (!checked.ok) {
      Alert.alert('알림', checked.message);
      return;
    }
    setIsUploading(true);
    setMessages((prev) => [
      {
        messageId: Date.now(),
        chatRoomId,
        senderId: null,
        type: 'IMAGE',
        content: null,
        imageUrl: image.uri,
        systemEvent: null,
        sentAt: new Date().toISOString(),
        isMine: true,
      },
      ...prev,
    ]);
    setIsUploading(false);
  };

  // TODO(API): POST /api/me/trades/{tradeId}/{action}
  const handleTradeAction = (action: TradeAction) => Alert.alert('준비 중', `${action} API 연결 전이에요.`);

  const handleMore = () =>
    Alert.alert(room?.partner.displayName ?? '채팅방', undefined, [
      ...(room ? [{ text: '게시물 보기', onPress: () => router.push(`/community/${room.post.postId}` as any) }] : []),
      {
        text: '채팅방 나가기',
        style: 'destructive' as const,
        // TODO(API): DELETE /api/me/chat-rooms/{chatRoomId}
        onPress: () => router.back(),
      },
      // TODO: 신고(POST /api/me/reports)·차단(PUT /api/me/blocks/{userId}) 화면 디자인 필요
      { text: '닫기', style: 'cancel' as const },
    ]);

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      <View className="mt-2">
        <BackHeader
          right={
            <Pressable onPress={handleMore} hitSlop={10} accessibilityLabel="더보기">
              <MoreIcon width={24} height={24} color="#242529" />
            </Pressable>
          }
        >
          <View className="flex-1 flex-row items-center gap-[14px]">
            <Text className="shrink text-text18 font-sans text-text-100" numberOfLines={1}>
              {room?.partner.displayName ?? ''}
            </Text>
            {manner !== null && (
              <View className="px-1.5 py-px rounded bg-neutral-10">
                <Text className="text-text12 font-sans text-text-200">매너 {manner.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </BackHeader>
      </View>

      {room && (
        <Pressable
          onPress={() => router.push(`/community/${room.post.postId}` as any)}
          className="flex-row items-center gap-2.5 px-screen md:px-10 lg:px-20 py-3 border-y border-neutral-50"
        >
          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-1.5">
              {badge && <CommunityBadge kind={badge} />}
              <Text className="shrink text-text14 font-medium font-sans text-text-100" numberOfLines={1}>
                {room.post.title}
              </Text>
            </View>
            {trade && (
              <Text className="text-text14 font-bold font-sans text-text-100">
                {formatPrice(trade.price, trade.post.type, '무료 나눔')}
              </Text>
            )}
          </View>
          {stripActions.map((item) => (
            <Pressable
              key={item.action}
              onPress={() => handleTradeAction(item.action)}
              
              className={`px-3 py-[7px] rounded-lg ${item.primary ? 'bg-primary-500' : 'bg-neutral-10'} `}
            >
              <Text className={`text-text13 font-medium font-sans ${item.primary ? 'text-text-100' : 'text-text-200'}`}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </Pressable>
      )}

      <View className="flex-1 bg-primary-100">
        <FlatList
            data={messages}
            inverted
            keyExtractor={(message) => String(message.messageId)}
            renderItem={({ item, index }) => {
              // inverted라 index+1이 바로 위(더 오래된) 메시지
              const older = messages[index + 1];
              return (
                <ChatMessageItem
                  message={item}
                  partnerImageUrl={room?.partner.profileImageUrl ?? null}
                  showDate={!older || !isSameDay(older.sentAt, item.sentAt)}
                />
              );
            }}
            ItemSeparatorComponent={() => <View className="h-[14px]" />}
            contentContainerClassName="px-screen md:px-10 lg:px-20 pt-4 pb-4"
          />
      </View>

      <View
        className="flex-row items-center gap-2.5 px-screen md:px-10 lg:px-20 pt-2.5 bg-white"
        style={{ paddingBottom: Math.max(insets.bottom, 10) }}
      >
        <Pressable onPress={handleSendImage} disabled={isUploading} hitSlop={8} accessibilityLabel="사진 보내기">
          {isUploading ? <ActivityIndicator color="#737785" /> : <CameraLineIcon width={26} height={26} color="#737785" />}
        </Pressable>
        {/* AppTextInput은 세로 패딩을 0으로 고정하므로 여백·배경은 바깥 박스가 담당 */}
        <Pressable onPress={() => inputRef.current?.focus()} className="flex-1 px-[14px] py-2.5 rounded-[20px] bg-neutral-10">
          <AppTextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="메시지 보내기"
            placeholderTextColor="#A7A9B5"
            multiline
            className="max-h-[80px] text-text15 font-sans text-text-100"
          />
        </Pressable>
        <Pressable
          onPress={handleSend}
          disabled={!text.trim()}
          className={`w-10 h-10 rounded-full bg-primary-500 items-center justify-center ${!text.trim() ? 'opacity-60' : ''}`}
          accessibilityLabel="보내기"
        >
          <SendIcon width={20} height={20} color="#242529" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};
