import React, { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppTextInput, BackHeader, HeaderActions } from '@/shared/ui';
import { checkProfileImage, useMyProfile } from '@/features/account';
import { Alert } from '@/shared/lib/alert';
import { getErrorMessage, unwrap } from '@/shared/api/types';
import { pickImageAssetFromLibrary } from '@/shared/lib/pickImage';
import { isSameDay } from '@/shared/lib/dateFormat';
import MoreIcon from '@/../assets/icons/more-icon.svg';
import CameraLineIcon from '@/../assets/icons/camera-line-icon.svg';
import SendIcon from '@/../assets/icons/send-icon.svg';
import { uploadImage } from '../api/postApi';
import { useChatMessages, useChatRooms, useLeaveChatRoom, useSendMessage } from '../lib/useChat';
import { useMyTrades, useTradeAction, useUserManner } from '../lib/useTrades';
import { useReport, useToggleBlock } from '../lib/useSafety';
import { formatPrice, postStatusBadge, tradeStatusBadge } from '../lib/communityFormat';
import { ChatMessageItem } from '../ui/ChatMessageItem';
import { CommunityBadge } from '../ui/CommunityBadge';
import { ReportReason, TradeAction, TradeSummary } from '../types';

const MESSAGE_MAX_LENGTH = 1000;

// ETC는 상세 사유 입력이 필수라 입력 화면이 생기기 전까지 제외
const REPORT_REASONS: { reason: ReportReason; label: string }[] = [
  { reason: 'SPAM', label: '스팸·광고' },
  { reason: 'FRAUD', label: '사기 의심' },
  { reason: 'PROHIBITED_ITEM', label: '거래 금지 물품' },
  { reason: 'ABUSIVE', label: '욕설·비매너' },
];

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
  // TODO: 채팅방 단건 조회 API가 없어 목록에서 상대·게시물 정보를 찾음
  const { rooms } = useChatRooms();
  const room = rooms.find((item) => item.chatRoomId === chatRoomId);
  const manner = useUserManner(room?.partner.userId);
  const { trades } = useMyTrades('ALL');
  // 이 게시물에서 진행 중이거나 가장 최근의 거래
  const trade = room ? trades.find((item) => item.post.postId === room.post.postId) : undefined;
  const { messages, isLoading, hasNextPage, fetchNextPage } = useChatMessages(chatRoomId);
  const sendMessage = useSendMessage(chatRoomId);
  const tradeAction = useTradeAction();
  const leaveRoom = useLeaveChatRoom();
  const report = useReport();
  const toggleBlock = useToggleBlock();
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const badge = trade ? tradeStatusBadge(trade.status) : room ? postStatusBadge(room.post.status) : null;
  const stripActions = getStripActions(trade);

  const handleSend = () => {
    const content = text.trim();
    if (!content || sendMessage.isPending) return;
    sendMessage.mutate(
      { type: 'TEXT', content },
      {
        onSuccess: () => setText(''),
        onError: (err) => Alert.alert('전송 실패', getErrorMessage(err, '메시지를 보내지 못했어요.')),
      }
    );
  };

  const handleSendImage = async () => {
    const image = await pickImageAssetFromLibrary({ quality: 0.8, allowsEditing: false });
    if (!image) return;
    const checked = checkProfileImage(image);
    if (!checked.ok) {
      Alert.alert('알림', checked.message);
      return;
    }
    try {
      setIsUploading(true);
      const uploaded = unwrap(await uploadImage(image, checked.contentType, 'CHAT'));
      await sendMessage.mutateAsync({ type: 'IMAGE', imageId: uploaded.imageId });
    } catch (err) {
      Alert.alert('전송 실패', getErrorMessage(err, '사진을 보내지 못했어요.'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleTradeAction = (action: TradeAction) => {
    if (!trade) return;
    tradeAction.mutate(
      { tradeId: trade.tradeId, action },
      { onError: (err) => Alert.alert('처리 실패', getErrorMessage(err, '거래 상태를 바꾸지 못했어요.')) }
    );
  };

  const handleMore = () =>
    Alert.alert(room?.partner.displayName ?? '채팅방', undefined, [
      ...(room ? [{ text: '게시물 보기', onPress: () => router.push(`/community/${room.post.postId}` as any) }] : []),
      {
        text: '채팅방 나가기',
        style: 'destructive' as const,
        onPress: () =>
          leaveRoom.mutate(chatRoomId, {
            onSuccess: () => router.back(),
            onError: (err) => Alert.alert('나가기 실패', getErrorMessage(err, '채팅방을 나가지 못했어요.')),
          }),
      },
      // TODO: 신고·차단 전용 화면 디자인이 나오면 교체 (지금은 시스템 알림창으로 연결)
      ...(room
        ? [
            { text: '신고하기', onPress: handleReport },
            { text: '차단하기', style: 'destructive' as const, onPress: handleBlock },
          ]
        : []),
      { text: '닫기', style: 'cancel' as const },
    ]);

  const handleReport = () => {
    if (!room) return;
    Alert.alert('신고 사유', `${room.partner.displayName}님을 신고하는 이유를 골라주세요.`, [
      ...REPORT_REASONS.map(({ reason, label }) => ({
        text: label,
        onPress: () =>
          report.mutate(
            { targetType: 'USER', targetId: room.partner.userId, reason },
            {
              onSuccess: () => Alert.alert('신고 완료', '신고가 접수됐어요.'),
              onError: (err) => Alert.alert('신고 실패', getErrorMessage(err, '신고하지 못했어요.')),
            }
          ),
      })),
      { text: '취소', style: 'cancel' as const },
    ]);
  };

  const handleBlock = () => {
    if (!room) return;
    Alert.alert('차단하기', `${room.partner.displayName}님을 차단할까요?\n서로의 게시물이 숨겨지고 채팅·거래 요청이 막혀요.`, [
      { text: '취소', style: 'cancel' as const },
      {
        text: '차단',
        style: 'destructive' as const,
        onPress: () =>
          toggleBlock.mutate(
            { userId: room.partner.userId, block: true },
            { onError: (err) => Alert.alert('차단 실패', getErrorMessage(err, '차단하지 못했어요.')) }
          ),
      },
    ]);
  };

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
              disabled={tradeAction.isPending}
              className={`px-3 py-[7px] rounded-lg ${item.primary ? 'bg-primary-500' : 'bg-neutral-10'} ${
                tradeAction.isPending ? 'opacity-50' : ''
              }`}
            >
              <Text className={`text-text13 font-medium font-sans ${item.primary ? 'text-text-100' : 'text-text-200'}`}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </Pressable>
      )}

      <View className="flex-1 bg-primary-100">
        {isLoading ? (
          <ActivityIndicator className="mt-10" color="#A2CD87" />
        ) : (
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
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            contentContainerClassName="px-screen md:px-10 lg:px-20 pt-4 pb-4"
          />
        )}
      </View>

      <View
        className="flex-row items-center gap-2.5 px-screen md:px-10 lg:px-20 pt-2.5 bg-white"
        style={{ paddingBottom: Math.max(insets.bottom, 10) }}
      >
        <Pressable onPress={handleSendImage} disabled={isUploading} hitSlop={8} accessibilityLabel="사진 보내기">
          {isUploading ? <ActivityIndicator color="#737785" /> : <CameraLineIcon width={26} height={26} color="#737785" />}
        </Pressable>
        <AppTextInput
          value={text}
          onChangeText={setText}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="메시지 보내기"
          placeholderTextColor="#A7A9B5"
          multiline
          className="flex-1 max-h-[100px] px-[14px] py-2.5 rounded-[20px] bg-neutral-10 text-text15 font-sans text-text-100"
        />
        <Pressable
          onPress={handleSend}
          disabled={!text.trim() || sendMessage.isPending}
          className={`w-10 h-10 rounded-full bg-primary-500 items-center justify-center ${!text.trim() ? 'opacity-60' : ''}`}
          accessibilityLabel="보내기"
        >
          <SendIcon width={20} height={20} color="#242529" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};
