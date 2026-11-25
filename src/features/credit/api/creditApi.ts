import { apiClient } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import { CreditBalance, CreditTransactionsPage, DailyRewardResult } from '../types';

export const getCredits = async (): Promise<ApiResponse<CreditBalance>> => {
  const response = await apiClient.get<ApiResponse<CreditBalance>>('/api/me/credits');
  return response.data;
};

/** 적립·사용·보류·환불 내역 최신순 */
export const getCreditTransactions = async (cursor?: number): Promise<ApiResponse<CreditTransactionsPage>> => {
  const response = await apiClient.get<ApiResponse<CreditTransactionsPage>>('/api/me/credits/transactions', {
    params: { cursor, size: 20 },
  });
  return response.data;
};

/** 오늘 출석 보상 (하루 1회, 최대 8) */
export const claimDailyReward = async (): Promise<ApiResponse<DailyRewardResult>> => {
  const response = await apiClient.post<ApiResponse<DailyRewardResult>>('/api/me/credits/daily-reward');
  return response.data;
};
