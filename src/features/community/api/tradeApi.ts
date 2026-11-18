import { apiClient } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import { ReviewRequest, TradeAction, TradeResult, TradeRole, TradesPage, UserReviewsSummary } from '../types';

/** 구매자가 거래 요청 (SALE이면 크레딧 보류, 채팅방이 없으면 생성) */
export const requestTrade = async (postId: number): Promise<ApiResponse<TradeResult>> => {
  const response = await apiClient.post<ApiResponse<TradeResult>>(`/api/posts/${postId}/trades`);
  return response.data;
};

/** 수락·거절(판매자), 취소, 수령 확인(구매자) */
export const updateTrade = async (tradeId: number, action: TradeAction): Promise<ApiResponse<TradeResult>> => {
  const response = await apiClient.post<ApiResponse<TradeResult>>(`/api/me/trades/${tradeId}/${action}`);
  return response.data;
};

export const getMyTrades = async (role?: TradeRole, cursor?: string): Promise<ApiResponse<TradesPage>> => {
  const response = await apiClient.get<ApiResponse<TradesPage>>('/api/me/trades', {
    params: { role, cursor, size: 20 },
  });
  return response.data;
};

export const writeReview = async (tradeId: number, request: ReviewRequest) => {
  const response = await apiClient.post<ApiResponse<{ reviewId: number }>>(`/api/me/trades/${tradeId}/review`, request);
  return response.data;
};

/** 받은 매너 점수 (후기 목록은 첫 페이지 1개만 받고 점수·개수만 사용) */
export const getUserReviews = async (userId: number): Promise<ApiResponse<UserReviewsSummary>> => {
  const response = await apiClient.get<ApiResponse<UserReviewsSummary>>(`/api/users/${userId}/reviews`, {
    params: { size: 1 },
  });
  return response.data;
};
