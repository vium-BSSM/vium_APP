// GET /api/me/notifications 항목
// TODO: type 값 목록이 명세에 expiry_popup만 있음 — BE와 나머지 값(거래·채팅·크레딧 등) 확정 필요
export interface NotificationApi {
  notificationId: number;
  type: string;
  title: string;
  body: string;
  scheduledAt: string;
  sentAt: string | null;
  readAt: string | null;
}

export interface NotificationsData {
  notifications: NotificationApi[];
}

export interface NotificationReadData {
  notificationId: number;
  readAt: string;
}

// GET /api/me/notifications/expiry-popup 항목
export interface ExpiryPopupItem {
  inventoryItemId: number;
  name: string;
  daysLeft: number;
}

export interface ExpiryPopupData {
  items: ExpiryPopupItem[];
}

export type NotificationFilter = 'all' | 'unread';

export interface NotificationItem {
  id: number;
  iconLabel: string;
  title: string;
  body: string;
  timeLabel: string;
  unread: boolean;
}
