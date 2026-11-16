import React from 'react';
import { Text, View } from 'react-native';
import { PillButton } from '@/shared/ui';
import { formatMonthDayTime } from '@/shared/lib/dateFormat';
import { formatPrice, tradeStatusBadge } from '../lib/communityFormat';
import { TradeAction, TradeSummary } from '../types';
import { CommunityBadge } from './CommunityBadge';

interface TradeCardProps {
  trade: TradeSummary;
  onAction: (action: TradeAction) => void;
  onReview: () => void;
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

/** Figma trade-card */
export const TradeCard: React.FC<TradeCardProps> = ({ trade, onAction, onReview, pendingAction = null }) => {
  const buttons = getButtons(trade, onAction, onReview);

  return (
    <View className="bg-white border border-neutral-50 rounded-lg p-4 gap-4">
      <View className="flex-row items-center gap-3">
        <View className="flex-1 gap-[3px]">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-text12 font-sans text-text-200">{trade.role === 'SELLER' ? '판매' : '구매'}</Text>
            <CommunityBadge kind={tradeStatusBadge(trade.status)} />
          </View>
          <Text className="text-text15 font-sans text-text-100" numberOfLines={1}>
            {trade.post.title}
          </Text>
          <Text className="text-text12 font-sans text-text-300">
            {trade.partner.displayName} · {formatMonthDayTime(trade.requestedAt)}
          </Text>
        </View>
        <Text className="text-text15 font-sans text-text-100">{formatPrice(trade.price, trade.post.type, '무료')}</Text>
      </View>

      {buttons.length > 0 && (
        <View className="flex-row gap-2">
          {buttons.map((button) => (
            <PillButton
              key={button.label}
              label={button.label}
              variant={button.variant}
              size="sm"
              onPress={button.onPress}
              loading={button.action !== undefined && pendingAction === button.action}
              disabled={pendingAction !== null}
              className="flex-1"
            />
          ))}
        </View>
      )}
    </View>
  );
};
