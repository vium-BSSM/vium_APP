import { FridgeItemStatus } from '../types';

/**
 * 두 날짜 사이의 일수 차이를 계산
 */
export const getDaysDifference = (targetDate: string, baseDate?: Date): number => {
  const target = new Date(targetDate);
  const base = baseDate || new Date();

  // 시간 부분을 제거하고 날짜만 비교
  target.setHours(0, 0, 0, 0);
  base.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - base.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const calculateStatus = (expiresOn: string): FridgeItemStatus => {
  const daysLeft = getDaysDifference(expiresOn);

  if (daysLeft <= 5) {
    return '위험';
  } else if (daysLeft <= 14) {
    return '보통';
  } else {
    return '양호';
  }
};

/**
 * D-day 형태의 문자열 생성
 * 예: "소비기한 D-3"
 */
export const formatDday = (expiresOn: string): string => {
  const daysLeft = getDaysDifference(expiresOn);

  if (daysLeft < 0) {
    return `소비기한 D+${Math.abs(daysLeft)}`;
  } else if (daysLeft === 0) {
    return '소비기한 D-Day';
  } else {
    return `소비기한 D-${daysLeft}`;
  }
};

/**
 * 날짜를 "YYYY/MM/DD" 형태로 포맷
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

/**
 * 날짜를 "YYYY/MM/DD까지" 형태로 포맷
 */
export const formatDateWithSuffix = (dateString: string): string => {
  return `${formatDate(dateString)}까지`;
};
