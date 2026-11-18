import { apiClient } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import { BlockedUsersData, BlockResult, ReportRequest } from '../types';

/** 유저·게시물 신고 (같은 대상 중복 신고는 409) */
export const createReport = async (request: ReportRequest): Promise<ApiResponse<{ reportId: number }>> => {
  const response = await apiClient.post<ApiResponse<{ reportId: number }>>('/api/me/reports', request);
  return response.data;
};

/** 내가 차단한 유저 목록 (최근 차단순) */
export const getBlockedUsers = async (): Promise<ApiResponse<BlockedUsersData>> => {
  const response = await apiClient.get<ApiResponse<BlockedUsersData>>('/api/me/blocks');
  return response.data;
};

/** 유저 차단 (멱등) — 서로의 게시물이 숨겨지고 거래 요청·채팅이 막힘 */
export const blockUser = async (userId: number): Promise<ApiResponse<BlockResult>> => {
  const response = await apiClient.put<ApiResponse<BlockResult>>(`/api/me/blocks/${userId}`);
  return response.data;
};

/** 차단 해제 (멱등) */
export const unblockUser = async (userId: number): Promise<ApiResponse<BlockResult>> => {
  const response = await apiClient.delete<ApiResponse<BlockResult>>(`/api/me/blocks/${userId}`);
  return response.data;
};
