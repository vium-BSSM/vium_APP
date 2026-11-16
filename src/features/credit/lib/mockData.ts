// TODO(API): UI 작업용 목업 데이터 — API 연결(feature/community-api) 시 이 파일 삭제
// 내용은 Figma(credit/wallet) 화면 그대로
import { CreditBalance, CreditTransaction } from '../types';

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();

export const MOCK_CREDIT_BALANCE: CreditBalance = { availableBalance: 12, heldBalance: 3 };

export const MOCK_CREDIT_TRANSACTIONS: CreditTransaction[] = [
  { transactionId: 88, type: 'TRADE_HOLD', amount: -3, tradeId: 40, createdAt: hoursAgo(1) },
  { transactionId: 80, type: 'DAILY_REWARD', amount: 1, tradeId: null, createdAt: hoursAgo(3) },
  { transactionId: 77, type: 'TRADE_INCOME', amount: 4, tradeId: 38, createdAt: '2026-11-10T18:20:00+09:00' },
  { transactionId: 70, type: 'TRADE_REFUND', amount: 2, tradeId: 35, createdAt: '2026-11-09T13:00:00+09:00' },
  { transactionId: 66, type: 'AI_REPORT', amount: -5, tradeId: null, createdAt: '2026-11-08T21:10:00+09:00' },
  { transactionId: 60, type: 'AD_REWARD', amount: 2, tradeId: null, createdAt: '2026-11-07T12:00:00+09:00' },
  { transactionId: 52, type: 'SAVING_BONUS', amount: 3, tradeId: null, createdAt: '2026-11-03T09:00:00+09:00' },
  { transactionId: 1, type: 'SIGNUP_REWARD', amount: 10, tradeId: null, createdAt: '2026-11-01T10:00:00+09:00' },
];
