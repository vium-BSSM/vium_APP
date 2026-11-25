import { apiClient } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import {
  ConsumptionCheckData,
  ConsumptionStatusRequest,
  ConsumptionStatusData,
  ConsumptionKeepData,
  ExpiryPopupData,
  NotificationReadData,
  NotificationsData,
} from '../types';

/** 알림 이력 (isRead 생략 시 전체, false면 안 읽은 것만) */
export const getNotifications = async (isRead?: boolean): Promise<ApiResponse<NotificationsData>> => {
  const response = await apiClient.get<ApiResponse<NotificationsData>>('/api/me/notifications', {
    params: { isRead },
  });
  return response.data;
};

export const markNotificationRead = async (notificationId: number): Promise<ApiResponse<NotificationReadData>> => {
  const response = await apiClient.patch<ApiResponse<NotificationReadData>>(
    `/api/me/notifications/${notificationId}/read`
  );
  return response.data;
};

/** 소비기한 임박 팝업에 띄울 재료 (expiry-widget도 같은 응답) */
export const getExpiryPopup = async (): Promise<ApiResponse<ExpiryPopupData>> => {
  const response = await apiClient.get<ApiResponse<ExpiryPopupData>>('/api/me/notifications/expiry-popup');
  return response.data;
};

/** '다 드셨어요?' 확인 대상 — 소비기한이 오늘 이하이고 잔량이 남은 재고 */
export const getConsumptionCheck = async (): Promise<ApiResponse<ConsumptionCheckData>> => {
  const response = await apiClient.get<ApiResponse<ConsumptionCheckData>>(
    '/api/me/notifications/consumption-check'
  );
  return response.data;
};

/** '아니요, 남았어요' — 현재 소비기한 동안 자동 폐기에서 제외 */
export const keepConsumptionCheckItem = async (
  inventoryItemId: number
): Promise<ApiResponse<ConsumptionKeepData>> => {
  const response = await apiClient.post<ApiResponse<ConsumptionKeepData>>(
    `/api/me/notifications/consumption-check/${inventoryItemId}/keep`
  );
  return response.data;
};

/** '네, 다 먹었어요' / '사실 버렸어요' — 재고 소진·폐기 처리 (fridge 기능과 같은 API) */
export const updateConsumptionStatus = async (
  inventoryItemId: number,
  request: ConsumptionStatusRequest
): Promise<ApiResponse<ConsumptionStatusData>> => {
  const response = await apiClient.patch<ApiResponse<ConsumptionStatusData>>(
    `/api/me/ingredients/${inventoryItemId}/status`,
    request
  );
  return response.data;
};
