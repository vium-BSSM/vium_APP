// 서버 날짜(ISO 문자열)를 화면 문구로 바꾸는 공통 함수

const pad = (value: number) => String(value).padStart(2, '0');

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const dayDiff = (target: Date, base: Date) =>
  Math.round((startOfDay(base).getTime() - startOfDay(target).getTime()) / 86400000);

/** '11.12' */
export const formatMonthDay = (iso: string) => {
  const date = new Date(iso);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
};

/** '11.12 10:00' */
export const formatMonthDayTime = (iso: string) => {
  const date = new Date(iso);
  return `${formatMonthDay(iso)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** '오전 10:05' */
export const formatClockTime = (iso: string) => {
  const date = new Date(iso);
  const hours = date.getHours();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours < 12 ? '오전' : '오후'} ${hour12}:${pad(date.getMinutes())}`;
};

/** '2026년 11월 12일' */
export const formatKoreanDate = (iso: string) => {
  const date = new Date(iso);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

/** '2026.11.18' (날짜만 있는 값도 그대로 처리) */
export const formatDotDate = (dateOnly: string) => dateOnly.split('T')[0].replaceAll('-', '.');

/** 알림·게시물용: '방금 전' · 'N분 전' · 'N시간 전' · '어제' · '11.10' */
export const formatRelativeTime = (iso: string, now: Date = new Date()) => {
  const date = new Date(iso);
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const days = dayDiff(date, now);
  if (days === 0) return `${Math.floor(minutes / 60)}시간 전`;
  if (days === 1) return '어제';
  return formatMonthDay(iso);
};

/** 목록 시각용: 오늘이면 '오전 10:05', 어제면 '어제', 그 외 '11.09' */
export const formatListTime = (iso: string, now: Date = new Date()) => {
  const days = dayDiff(new Date(iso), now);
  if (days === 0) return formatClockTime(iso);
  if (days === 1) return '어제';
  return formatMonthDay(iso);
};

/** 크레딧 내역용: 오늘이면 '오늘 10:00', 그 외 '11.10 18:20' */
export const formatHistoryTime = (iso: string, now: Date = new Date()) => {
  const date = new Date(iso);
  if (dayDiff(date, now) === 0) return `오늘 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return formatMonthDayTime(iso);
};

/** 같은 날인지 (채팅 날짜 구분선) */
export const isSameDay = (a: string, b: string) => dayDiff(new Date(a), new Date(b)) === 0;

/** 소비기한까지 남은 일수 (오늘이면 0, 지났으면 음수) */
export const getDaysLeft = (dateOnly: string, now: Date = new Date()) => {
  const [year, month, day] = dateOnly.split('T')[0].split('-').map(Number);
  return -dayDiff(new Date(year, month - 1, day), now);
};

/** 'D-2' · 'D-Day' · 'D+1' */
export const formatDday = (daysLeft: number) =>
  daysLeft === 0 ? 'D-Day' : daysLeft > 0 ? `D-${daysLeft}` : `D+${-daysLeft}`;

/** 거리: '420m' · '1.1km' */
export const formatDistance = (meters: number) =>
  meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1).replace(/\.0$/, '')}km`;
