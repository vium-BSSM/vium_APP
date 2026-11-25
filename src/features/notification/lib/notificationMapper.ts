import { formatRelativeTime } from '@/shared/lib/dateFormat';
import { NotificationApi, NotificationItem } from '../types';

// 알림 종류별 아이콘 글자 (Figma notification-row icon)
// expiry 본문('우유의 소비기한이 임박했어요')에는 남은 일수가 없어 '임박'으로 표시
const ICON_BY_TYPE: Record<string, string> = {
  expiry: '임박',
  consume_check: '확인',
  shopping_reminder: '장보기',
};

export const mapNotification = (notification: NotificationApi): NotificationItem => ({
  id: notification.notificationId,
  type: notification.type,
  iconLabel: ICON_BY_TYPE[notification.type] ?? '알림',
  title: notification.title,
  body: notification.body ?? '',
  // sentAt은 전송 재시도 중이면 null
  timeLabel: formatRelativeTime(notification.sentAt ?? notification.scheduledAt),
  unread: notification.readAt === null,
});
