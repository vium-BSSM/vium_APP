// TODO(API): UI 작업용 목업 데이터 — API 연결(feature/community-api) 시 이 파일 삭제
// 내용은 Figma(notification/list, expiry-popup) 화면 그대로
import { ExpiryPopupItem, NotificationItem } from '../types';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 10,
    iconLabel: 'D-2',
    title: '유통기한 임박',
    body: '우유의 소비기한이 2일 남았어요. 지금 나눔하면 버리지 않아도 돼요.',
    timeLabel: '방금 전',
    unread: true,
  },
  {
    id: 9,
    iconLabel: '거래',
    title: '거래 요청이 왔어요',
    body: "자취생님이 '우유 1L 팔아요'에 거래를 요청했어요.",
    timeLabel: '10분 전',
    unread: true,
  },
  {
    id: 8,
    iconLabel: '확인',
    title: '다 드셨어요?',
    body: '지난주에 산 두부, 다 드셨나요? 눌러서 알려주세요.',
    timeLabel: '1시간 전',
    unread: true,
  },
  {
    id: 7,
    iconLabel: '수락',
    title: '거래가 수락됐어요',
    body: "비움이님이 '양파 3개 나눔' 거래를 수락했어요.",
    timeLabel: '어제',
    unread: false,
  },
  {
    id: 6,
    iconLabel: '채팅',
    title: '새 메시지',
    body: '자취생: 내일 저녁에 가능할까요?',
    timeLabel: '어제',
    unread: false,
  },
  {
    id: 5,
    iconLabel: '+1',
    title: '크레딧 적립',
    body: '출석 보상 1 크레딧이 적립됐어요.',
    timeLabel: '11.10',
    unread: false,
  },
];

export const MOCK_EXPIRY_POPUP_ITEMS: ExpiryPopupItem[] = [
  { inventoryItemId: 1, name: '두부', daysLeft: 1 },
  { inventoryItemId: 2, name: '우유', daysLeft: 2 },
  { inventoryItemId: 3, name: '계란 10구', daysLeft: 3 },
];
