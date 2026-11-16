import { CursorPage } from '@/shared/api/types';

export type CreditTransactionType =
  | 'SIGNUP_REWARD'
  | 'AD_REWARD'
  | 'DAILY_REWARD'
  | 'SAVING_BONUS'
  | 'TRADE_HOLD'
  | 'TRADE_REFUND'
  | 'TRADE_INCOME'
  | 'AI_REPORT';

export interface CreditBalance {
  availableBalance: number;
  heldBalance: number;
}

export interface CreditTransaction {
  transactionId: number;
  type: CreditTransactionType;
  // 적립·환불은 +, 사용·보류는 -
  amount: number;
  tradeId: number | null;
  createdAt: string;
}

export interface CreditTransactionsPage extends CursorPage {
  transactions: CreditTransaction[];
}

export interface DailyRewardResult {
  amount: number;
  availableBalance: number;
}

export type CreditFilter = 'all' | 'earn' | 'use' | 'hold';
