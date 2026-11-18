import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader, BackHeader, HeaderActions, UnderlineTabs } from '@/shared/ui';
import { usePullToRefresh } from '@/shared/lib/usePullToRefresh';
import { useMyProfile } from '@/features/account';
import { Alert } from '@/shared/lib/alert';
import { getErrorMessage } from '@/shared/api/types';
import { useMyTrades, useTradeAction } from '../lib/useTrades';
import { useChatRooms, useOpenChatRoom } from '../lib/useChat';
import { TradeCard } from '../ui/TradeCard';
import { TradeAction, TradeRoleFilter, TradeSummary } from '../types';

const ROLE_TABS: { key: TradeRoleFilter; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'BUYER', label: '구매' },
  { key: 'SELLER', label: '판매' },
];

const CONFIRM: Record<TradeAction, { title: string; message: string; button: string }> = {
  accept: { title: '거래 수락', message: '이 요청을 수락할까요? 다른 요청은 받을 수 없어요.', button: '수락' },
  reject: { title: '거래 거절', message: '이 요청을 거절할까요? 보류된 크레딧은 구매자에게 돌아가요.', button: '거절' },
  cancel: { title: '거래 취소', message: '거래를 취소할까요? 보류된 크레딧은 구매자에게 돌아가요.', button: '거래 취소' },
  complete: { title: '수령 확인', message: '재료를 받으셨나요? 확인하면 거래가 완료돼요.', button: '받았어요' },
};

export const TradeListPage = () => {
  const router = useRouter();
  const { profile } = useMyProfile();
  const [role, setRole] = useState<TradeRoleFilter>('ALL');
  const { trades, isLoading, error, hasNextPage, fetchNextPage, refetch } = useMyTrades(role);
  const pull = usePullToRefresh(refetch);
  const tradeAction = useTradeAction();
  const { rooms } = useChatRooms();
  const openChat = useOpenChatRoom();
  const pendingTradeId = tradeAction.isPending ? tradeAction.variables?.tradeId : undefined;

  const handleAction = (trade: TradeSummary, action: TradeAction) => {
    const confirm = CONFIRM[action];
    Alert.alert(confirm.title, confirm.message, [
      { text: '닫기', style: 'cancel' },
      {
        text: confirm.button,
        style: action === 'reject' || action === 'cancel' ? 'destructive' : 'default',
        onPress: () =>
          tradeAction.mutate(
            { tradeId: trade.tradeId, action },
            { onError: (err) => Alert.alert('처리 실패', getErrorMessage(err, '거래 상태를 바꾸지 못했어요.')) }
          ),
      },
    ]);
  };

  /** 거래 상대와의 채팅방으로 이동 — 목록에 있으면 그 방, 구매자면 서버가 기존 방을 찾아주거나 만들어 줌 */
  const goToChat = async (trade: TradeSummary) => {
    const room = rooms.find(
      (item) => item.post.postId === trade.post.postId && item.partner.userId === trade.partner.userId
    );
    if (room) {
      router.push(`/community/chat/${room.chatRoomId}` as any);
      return;
    }
    if (trade.role === 'SELLER') {
      // 판매자는 내 게시물에 채팅방을 만들 수 없어, 목록에서 못 찾으면 안내만 함
      Alert.alert('채팅방 없음', '이 거래의 채팅방을 찾을 수 없어요.');
      return;
    }
    try {
      const chatRoomId = await openChat.mutateAsync(trade.post.postId);
      router.push(`/community/chat/${chatRoomId}` as any);
    } catch (err) {
      Alert.alert('채팅방 열기 실패', getErrorMessage(err, '채팅방을 열지 못했어요.'));
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      {/* BackHeader(높이 52)가 위쪽에 약 14px 여백을 품고 있어 +20px이면 홈과 같은 34px */}
      <View className="mt-5">
        <BackHeader title="거래 내역" />
      </View>
      <UnderlineTabs options={ROLE_TABS} value={role} onChange={setRole} />

      <FlatList
        data={trades}
        keyExtractor={(trade) => String(trade.tradeId)}
        renderItem={({ item }) => (
          <TradeCard
            trade={item}
            onAction={(action) => handleAction(item, action)}
            onReview={() => router.push(`/community/trades/${item.tradeId}/review` as any)}
            onPress={() => goToChat(item)}
            pendingAction={pendingTradeId === item.tradeId ? (tradeAction.variables?.action ?? null) : null}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-6" />}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator className="mt-10" color="#A2CD87" />
          ) : (
            <Text className="text-text14 font-sans text-text-300 text-center mt-10">{error ?? '아직 거래 내역이 없어요'}</Text>
          )
        }
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        onRefresh={pull.onRefresh}
        refreshing={pull.refreshing}
        contentContainerClassName="px-screen md:px-10 lg:px-20 pt-6 pb-10"
      />
    </View>
  );
};
