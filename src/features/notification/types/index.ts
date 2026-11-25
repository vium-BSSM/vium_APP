// GET /api/me/notifications 항목 — 채팅·거래 푸시는 목록에 저장되지 않음
// expiry(매일 09시), consume_check(매일 20시), shopping_reminder(토 10시, 설정 켠 사람만)
export type NotificationType = 'expiry' | 'consume_check' | 'shopping_reminder';

export interface NotificationApi {
  notificationId: number;
  // 알 수 없는 값이 와도 깨지지 않도록 string도 허용
  type: NotificationType | (string & {});
  title: string;
  body: string | null;
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

// GET /api/me/notifications/consumption-check 항목
export interface ConsumptionCheckItem {
  inventoryItemId: number;
  name: string;
  remainingQuantity: number;
  unit: string;
  // 'YYYY-MM-DD'
  expiresOn: string;
}

export interface ConsumptionCheckData {
  items: ConsumptionCheckItem[];
}

export interface ConsumptionKeepData {
  inventoryItemId: number;
  keepConfirmedExpiresOn: string;
}

// PATCH /api/me/ingredients/{id}/status
export interface ConsumptionStatusRequest {
  status: 'consumed' | 'disposed';
  quantity: number;
}

export interface ConsumptionStatusData {
  inventoryItemId: number;
  statusCode: string;
  remainingQuantity: number;
}

export type NotificationFilter = 'all' | 'unread';

export interface NotificationItem {
  id: number;
  type: NotificationApi['type'];
  iconLabel: string;
  title: string;
  body: string;
  timeLabel: string;
  unread: boolean;
}
