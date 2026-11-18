import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PillButton } from '@/shared/ui';
import { formatMonthDayTime } from '@/shared/lib/dateFormat';
import { formatPrice, tradeStatusBadge } from '../lib/communityFormat';
import { TradeAction, TradeSummary } from '../types';
import { CommunityBadge } from './CommunityBadge';

interface TradeCardProps {
  trade: TradeSummary;
  onAction: (action: TradeAction) => void;
  onReview: () => void;
  /** 카드(버튼 밖)를 누르면 — 거래 상대와의 채팅방으로 이동 */
  onPress?: () => void;
  pendingAction?: TradeAction | null;
}

type CardButton = { label: string; variant: 'primary' | 'secondary'; onPress: () => void; action?: TradeAction };

/** 거래 상태·내 역할별 버튼 (판매자: 수락/거절, 구매자: 수령 확인, 공통: 취소, 완료 후: 후기) */
const getButtons = (trade: TradeSummary, onAction: TradeCardProps['onAction'], onReview: () => void): CardButton[] => {
  const action = (label: string, variant: CardButton['variant'], tradeAction: TradeAction): CardButton => ({
    label,
    variant,
    action: tradeAction,
    onPress: () => onAction(tradeAction),
  });

  switch (trade.status) {
    case 'REQUESTED':
      return trade.role === 'SELLER'
        ? [action('거절', 'secondary', 'reject'), action('수락', 'primary', 'accept')]
        : [action('거래 취소', 'secondary', 'cancel')];
    case 'ACCEPTED':
      return trade.role === 'BUYER'
        ? [action('거래 취소', 'secondary', 'cancel'), action('받았어요', 'primary', 'complete')]
        : [action('거래 취소', 'secondary', 'cancel')];
    case 'COMPLETED':
      return trade.reviewWritten ? [] : [{ label: '후기 남기기', variant: 'primary', onPress: onReview }];
    default:
      return [];
  }
};

/** Figma trade-card (글자·버튼은 Figma보다 한 단계 크게) */
export const TradeCard: React.FC<TradeCardProps> = ({ trade, onAction, onReview, onPress, pendingAction = null }) => {
  const buttons = getButtons(trade, onAction, onReview);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="bg-white border border-neutral-50 rounded-lg p-5 gap-5 active:bg-neutral-10"
      accessibilityRole="button"
      accessibilityLabel={`${trade.post.title} 채팅방 열기`}
    >
      <View className="flex-row items-center gap-3">
        <View className="flex-1 gap-2">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-text14 font-sans text-text-200">{trade.role === 'SELLER' ? '판매' : '구매'}</Text>
            <CommunityBadge kind={tradeStatusBadge(trade.status)} size="md" />
          </View>
          <Text className="text-text18 font-sans text-text-100" numberOfLines={1}>
            {trade.post.title}
          </Text>
          <Text className="text-text14 font-sans text-text-300">
            {trade.partner.displayName} · {formatMonthDayTime(trade.requestedAt)}
          </Text>
        </View>
        <Text className="text-text18 font-sans text-text-100">{formatPrice(trade.price, trade.post.type, '무료')}</Text>
      </View>

      {buttons.length > 0 && (
        <View className="flex-row gap-2">
          {buttons.map((button) => (
            <PillButton
              key={button.label}
              label={button.label}
              variant={button.variant}
              size="md"
              onPress={button.onPress}
              loading={button.action !== undefined && pendingAction === button.action}
              disabled={pendingAction !== null}
              className="flex-1"
            />
          ))}
        </View>
      )}
    </Pressable>
  );
};
