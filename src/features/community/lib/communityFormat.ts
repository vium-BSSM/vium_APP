import { BadgeKind, PostStatus, PostType, TradeStatus } from '../types';

export const BADGE_LABEL: Record<BadgeKind, string> = {
  requested: '요청됨',
  reserved: '예약중',
  completed: '거래완료',
  rejected: '거절',
  canceled: '취소',
  share: '나눔',
  sale: '판매',
  expired: '만료',
};

export const postTypeBadge = (type: PostType): BadgeKind => (type === 'SALE' ? 'sale' : 'share');

/** 게시물 상태 배지 — 거래 가능(OPEN)이면 배지 없음 */
export const postStatusBadge = (status: PostStatus): BadgeKind | null => {
  if (status === 'RESERVED') return 'reserved';
  if (status === 'COMPLETED') return 'completed';
  if (status === 'EXPIRED') return 'expired';
  return null;
};

export const tradeStatusBadge = (status: TradeStatus): BadgeKind => {
  switch (status) {
    case 'REQUESTED':
      return 'requested';
    case 'ACCEPTED':
      return 'reserved';
    case 'COMPLETED':
      return 'completed';
    case 'REJECTED':
      return 'rejected';
    default:
      return 'canceled';
  }
};

/** '3 크레딧' · 나눔이면 freeLabel ('무료 나눔' / '무료') */
export const formatPrice = (price: number, type: PostType, freeLabel = '무료 나눔') =>
  type === 'SHARE' || price === 0 ? freeLabel : `${price} 크레딧`;

export const STORAGE_METHOD_OPTIONS = [
  { key: '1', label: '냉장' },
  { key: '2', label: '냉동' },
  { key: '3', label: '실온' },
] as const;

export const INELIGIBLE_REASON_LABEL: Record<string, string> = {
  ALREADY_USED: '조금이라도 사용한 재료는 올릴 수 없어요.',
  NOT_ACTIVE: '이미 소진·폐기한 재료예요.',
  ALREADY_POSTED: '이미 게시한 재료예요.',
  EXPIRES_TOO_SOON: '소비기한이 1일 이상 남은 재료만 올릴 수 있어요.',
  NOT_IN_CATALOG: '직접 이름을 입력해 등록한 재료는 올릴 수 없어요.',
  PROHIBITED_ITEM: '날고기·수산물 등은 나눔·판매할 수 없어요.',
};
