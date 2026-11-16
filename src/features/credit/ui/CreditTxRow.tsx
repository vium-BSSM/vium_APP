import React from 'react';
import { Text, View } from 'react-native';
import { formatHistoryTime } from '@/shared/lib/dateFormat';
import { CreditTransaction, CreditTransactionType } from '../types';

// 아이콘 글자, 제목, 금액 색 (Figma credit-tx-row)
const TX_META: Record<CreditTransactionType, { icon: string; title: string; amountClass: string }> = {
  SIGNUP_REWARD: { icon: '가입', title: '가입 축하 지급', amountClass: 'text-primary-700' },
  AD_REWARD: { icon: '광고', title: '광고 보상', amountClass: 'text-primary-700' },
  DAILY_REWARD: { icon: '출석', title: '출석 보상', amountClass: 'text-primary-700' },
  SAVING_BONUS: { icon: '절약', title: '절약 보너스', amountClass: 'text-primary-700' },
  TRADE_HOLD: { icon: '보류', title: '거래 보류', amountClass: 'text-status-danger' },
  TRADE_REFUND: { icon: '환불', title: '거래 취소 환불', amountClass: 'text-primary-700' },
  TRADE_INCOME: { icon: '거래', title: '판매 수익', amountClass: 'text-primary-700' },
  AI_REPORT: { icon: 'AI', title: 'AI 상세 리포트 구매', amountClass: 'text-status-danger-text' },
};

export const CreditTxRow: React.FC<{ tx: CreditTransaction }> = ({ tx }) => {
  const meta = TX_META[tx.type];
  return (
    <View className="flex-row items-center gap-3 py-[14px] bg-white">
      <View className="w-9 h-9 rounded-full bg-neutral-10 items-center justify-center">
        <Text className="text-text12 font-sans text-text-100">{meta.icon}</Text>
      </View>
      <View className="flex-1 gap-0.5">
        {/* TODO: 내역 응답에 게시물 제목이 없어 '거래 보류 · 우유 1L 팔아요'처럼 붙이지 못함 (tradeId만 있음) */}
        <Text className="text-text15 font-sans text-text-100" numberOfLines={1}>
          {meta.title}
        </Text>
        <Text className="text-text12 font-sans text-text-300">{formatHistoryTime(tx.createdAt)}</Text>
      </View>
      <Text className={`text-text16 font-sans ${meta.amountClass}`}>{tx.amount > 0 ? `+${tx.amount}` : tx.amount}</Text>
    </View>
  );
};
