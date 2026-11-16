import { formatRelativeTime } from '@/shared/lib/dateFormat';
import { NotificationApi, NotificationItem } from '../types';

// 알림 종류별 아이콘 글자 (Figma notification-row icon)
// TODO: BE가 알림 type 값을 확정하면 맞춰서 정리 (현재는 명세의 expiry_popup + 예상 값)
const ICON_BY_TYPE: Record<string, string> = {
  trade_requested: '거래',
  trade_accepted: '수락',
  consumption_check: '확인',
  chat_message: '채팅',
};

const getIconLabel = (notification: NotificationApi) => {
  if (notification.type.startsWith('expiry')) {
    // '우유의 소비기한이 2일 남았습니다.' → 'D-2'
    const days = notification.body.match(/(\d+)일 남/)?.[1];
    return days ? `D-${days}` : '임박';
  }
  if (notification.type.startsWith('credit')) {
    // '출석 보상 1 크레딧이 적립됐어요.' → '+1'
    const amount = notification.body.match(/(\d+)\s*크레딧/)?.[1];
    return amount ? `+${amount}` : '+';
  }
  return ICON_BY_TYPE[notification.type] ?? '알림';
};

export const mapNotification = (notification: NotificationApi): NotificationItem => ({
  id: notification.notificationId,
  iconLabel: getIconLabel(notification),
  title: notification.title,
  body: notification.body,
  timeLabel: formatRelativeTime(notification.sentAt ?? notification.scheduledAt),
  unread: notification.readAt === null,
});
