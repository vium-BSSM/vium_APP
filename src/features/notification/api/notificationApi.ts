import { apiClient } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import { ExpiryPopupData, NotificationReadData, NotificationsData } from '../types';

/** 알림 이력 (isRead 생략 시 전체) */
export const getNotifications = async (): Promise<ApiResponse<NotificationsData>> => {
  const response = await apiClient.get<ApiResponse<NotificationsData>>('/api/me/notifications');
  return response.data;
};

export const markNotificationRead = async (notificationId: number): Promise<ApiResponse<NotificationReadData>> => {
  const response = await apiClient.patch<ApiResponse<NotificationReadData>>(
    `/api/me/notifications/${notificationId}/read`
  );
  return response.data;
};

/** 소비기한 임박 팝업에 띄울 재료 */
export const getExpiryPopup = async (): Promise<ApiResponse<ExpiryPopupData>> => {
  const response = await apiClient.get<ApiResponse<ExpiryPopupData>>('/api/me/notifications/expiry-popup');
  return response.data;
};
