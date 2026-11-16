// TODO(API): UI 작업용 목업 데이터 — API 연결(feature/community-api) 시 이 파일 삭제
// 내용은 Figma(community 섹션) 화면 그대로
import { ChatMessage, ChatRoomSummary, PostDetail, PostSummary, TradeSummary } from '../types';

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const MOCK_POSTS: PostSummary[] = [
  {
    postId: 12,
    type: 'SALE',
    status: 'OPEN',
    title: '우유 1L 팔아요',
    thumbnailUrl: null,
    ingredientName: '우유',
    quantity: 1,
    unit: '개',
    expiresOn: daysFromNow(2),
    price: 3,
    distanceMeters: 420,
    likeCount: 2,
    likedByMe: false,
    createdAt: minutesAgo(3),
  },
  {
    postId: 13,
    type: 'SHARE',
    status: 'OPEN',
    title: '양파 3개 나눠요',
    thumbnailUrl: null,
    ingredientName: '양파',
    quantity: 3,
    unit: '개',
    expiresOn: daysFromNow(12),
    price: 0,
    distanceMeters: 650,
    likeCount: 5,
    likedByMe: true,
    createdAt: minutesAgo(40),
  },
  {
    postId: 14,
    type: 'SALE',
    status: 'OPEN',
    title: '계란 10구 (미개봉)',
    thumbnailUrl: null,
    ingredientName: '계란',
    quantity: 10,
    unit: '구',
    expiresOn: daysFromNow(6),
    price: 4,
    distanceMeters: 800,
    likeCount: 1,
    likedByMe: false,
    createdAt: minutesAgo(90),
  },
  {
    postId: 15,
    type: 'SHARE',
    status: 'RESERVED',
    title: '대파 한 단',
    thumbnailUrl: null,
    ingredientName: '대파',
    quantity: 1,
    unit: '단',
    expiresOn: daysFromNow(4),
    price: 0,
    distanceMeters: 1100,
    likeCount: 0,
    likedByMe: false,
    createdAt: minutesAgo(200),
  },
  {
    postId: 16,
    type: 'SALE',
    status: 'OPEN',
    title: '두부 1모',
    thumbnailUrl: null,
    ingredientName: '두부',
    quantity: 1,
    unit: '모',
    expiresOn: daysFromNow(1),
    price: 2,
    distanceMeters: 1300,
    likeCount: 3,
    likedByMe: false,
    createdAt: minutesAgo(600),
  },
  {
    postId: 17,
    type: 'SHARE',
    status: 'OPEN',
    title: '감자 반 봉지 나눔',
    thumbnailUrl: null,
    ingredientName: '감자',
    quantity: 5,
    unit: '개',
    expiresOn: daysFromNow(9),
    price: 0,
    distanceMeters: 2400,
    likeCount: 4,
    likedByMe: false,
    createdAt: minutesAgo(1500),
  },
  {
    postId: 18,
    type: 'SALE',
    status: 'OPEN',
    title: '요거트 4개입',
    thumbnailUrl: null,
    ingredientName: '요거트',
    quantity: 4,
    unit: '개',
    expiresOn: daysFromNow(3),
    price: 3,
    distanceMeters: 2900,
    likeCount: 1,
    likedByMe: false,
    createdAt: minutesAgo(3000),
  },
];

const AUTHORS = [
  { userId: 7, displayName: '비움이', profileImageUrl: null, mannerScore: 4.6, reviewCount: 5 },
  { userId: 9, displayName: '자취생', profileImageUrl: null, mannerScore: 4.8, reviewCount: 12 },
  { userId: 11, displayName: '이웃집', profileImageUrl: null, mannerScore: 4.2, reviewCount: 3 },
];

const DESCRIPTIONS: Record<number, string> = {
  12: '어제 샀는데 다 못 먹을 것 같아요. 미개봉이고 냉장 보관 중이에요. 저녁 7시 이후 편하게 연락주세요!',
  13: '한 망 샀는데 혼자 다 못 먹어요. 실온 보관 중이고 상태 좋아요.',
  14: '마트에서 1+1이라 하나 더 생겼어요. 미개봉입니다.',
};

const STORAGE_BY_POST: Record<number, { id: number; name: string }> = {
  13: { id: 3, name: '실온' },
  17: { id: 3, name: '실온' },
};

/** 피드 목록 항목을 상세 형태로 확장 (작성자·재료 정보 채움) */
export const getMockPostDetail = (postId: number): PostDetail | null => {
  const post = MOCK_POSTS.find((item) => item.postId === postId);
  if (!post) return null;
  const storage = STORAGE_BY_POST[postId] ?? { id: 1, name: '냉장' };
  return {
    postId: post.postId,
    type: post.type,
    status: post.status,
    title: post.title,
    description: DESCRIPTIONS[postId] ?? '상태 좋아요. 편하게 연락주세요!',
    images: [],
    author: AUTHORS[postId % AUTHORS.length],
    ingredient: {
      inventoryItemId: 100 + postId,
      ingredientCatalogId: postId,
      name: post.ingredientName,
      categoryName: post.ingredientName === '우유' || post.ingredientName === '요거트' ? '유제품' : '채소',
      quantity: post.quantity,
      unitId: 1,
      unit: post.unit,
      expiresOn: post.expiresOn,
      storageMethodId: storage.id,
      storageMethodName: storage.name,
      isOpened: false,
    },
    price: post.price,
    distanceMeters: post.distanceMeters,
    likeCount: post.likeCount,
    likedByMe: post.likedByMe,
    isMine: false,
    activeTradeId: post.status === 'RESERVED' ? 41 : null,
    createdAt: post.createdAt,
    updatedAt: post.createdAt,
  };
};

export const MOCK_TRADES: TradeSummary[] = [
  {
    tradeId: 40,
    status: 'REQUESTED',
    role: 'SELLER',
    post: { postId: 12, type: 'SALE', title: '우유 1L 팔아요', thumbnailUrl: null },
    partner: { userId: 9, displayName: '자취생', profileImageUrl: null },
    price: 3,
    requestedAt: '2026-11-12T10:00:00+09:00',
    acceptedAt: null,
    completedAt: null,
    autoResolveAt: null,
    reviewWritten: false,
  },
  {
    tradeId: 41,
    status: 'ACCEPTED',
    role: 'BUYER',
    post: { postId: 13, type: 'SHARE', title: '양파 3개 나눠요', thumbnailUrl: null },
    partner: { userId: 7, displayName: '비움이', profileImageUrl: null },
    price: 0,
    requestedAt: '2026-11-12T09:40:00+09:00',
    acceptedAt: '2026-11-12T09:42:00+09:00',
    completedAt: null,
    autoResolveAt: '2026-11-15T09:42:00+09:00',
    reviewWritten: false,
  },
  {
    tradeId: 38,
    status: 'COMPLETED',
    role: 'BUYER',
    post: { postId: 14, type: 'SALE', title: '계란 10구 (미개봉)', thumbnailUrl: null },
    partner: { userId: 11, displayName: '이웃집', profileImageUrl: null },
    price: 4,
    requestedAt: '2026-11-10T18:20:00+09:00',
    acceptedAt: '2026-11-10T18:30:00+09:00',
    completedAt: '2026-11-11T19:00:00+09:00',
    autoResolveAt: null,
    reviewWritten: false,
  },
  {
    tradeId: 35,
    status: 'CANCELED',
    role: 'SELLER',
    post: { postId: 15, type: 'SHARE', title: '대파 한 단', thumbnailUrl: null },
    partner: { userId: 9, displayName: '자취생', profileImageUrl: null },
    price: 0,
    requestedAt: '2026-11-09T13:00:00+09:00',
    acceptedAt: null,
    completedAt: null,
    autoResolveAt: null,
    reviewWritten: false,
  },
  {
    tradeId: 30,
    status: 'REJECTED',
    role: 'BUYER',
    post: { postId: 16, type: 'SALE', title: '두부 1모', thumbnailUrl: null },
    partner: { userId: 12, displayName: '냉장고요정', profileImageUrl: null },
    price: 2,
    requestedAt: '2026-11-08T11:30:00+09:00',
    acceptedAt: null,
    completedAt: null,
    autoResolveAt: null,
    reviewWritten: false,
  },
];

export const MOCK_CHAT_ROOMS: ChatRoomSummary[] = [
  {
    chatRoomId: 3,
    post: { postId: 12, title: '우유 1L 팔아요', thumbnailUrl: null, status: 'OPEN' },
    partner: { userId: 9, displayName: '자취생', profileImageUrl: null },
    lastMessage: { type: 'TEXT', preview: '내일 저녁에 가능할까요?', sentAt: minutesAgo(5) },
    unreadCount: 1,
  },
  {
    chatRoomId: 4,
    post: { postId: 13, title: '양파 3개 나눠요', thumbnailUrl: null, status: 'RESERVED' },
    partner: { userId: 7, displayName: '비움이', profileImageUrl: null },
    lastMessage: { type: 'SYSTEM', preview: '거래가 수락됐어요. 약속을 잡아보세요!', sentAt: minutesAgo(28) },
    unreadCount: 2,
  },
  {
    chatRoomId: 5,
    post: { postId: 14, title: '계란 10구 (미개봉)', thumbnailUrl: null, status: 'COMPLETED' },
    partner: { userId: 11, displayName: '이웃집', profileImageUrl: null },
    lastMessage: { type: 'TEXT', preview: '감사합니다 잘 먹을게요 :)', sentAt: minutesAgo(60 * 24) },
    unreadCount: 0,
  },
  {
    chatRoomId: 6,
    post: { postId: 15, title: '대파 한 단', thumbnailUrl: null, status: 'OPEN' },
    partner: { userId: 12, displayName: '냉장고요정', profileImageUrl: null },
    lastMessage: { type: 'IMAGE', preview: '사진 보냈어요', sentAt: '2026-11-09T15:00:00+09:00' },
    unreadCount: 0,
  },
  {
    chatRoomId: 7,
    post: { postId: 16, title: '두부 1모', thumbnailUrl: null, status: 'OPEN' },
    partner: { userId: 9, displayName: '자취생', profileImageUrl: null },
    lastMessage: { type: 'SYSTEM', preview: '거래가 취소됐어요.', sentAt: '2026-11-08T12:00:00+09:00' },
    unreadCount: 0,
  },
];

// 채팅방 3(자취생 · 우유 1L 팔아요) 대화 — 최신순 (inverted 리스트용)
const message = (
  messageId: number,
  sentAt: string,
  content: string,
  kind: 'mine' | 'partner' | 'system'
): ChatMessage => ({
  messageId,
  chatRoomId: 3,
  senderId: kind === 'system' ? null : kind === 'mine' ? 1 : 9,
  type: kind === 'system' ? 'SYSTEM' : 'TEXT',
  content,
  imageUrl: null,
  systemEvent: kind === 'system' ? 'TRADE_REQUESTED' : null,
  sentAt,
  isMine: kind === 'mine',
});

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  message(506, '2026-11-12T10:06:00+09:00', '네 7시 어떠세요?', 'mine'),
  message(505, '2026-11-12T10:05:00+09:00', '내일 저녁에 가능할까요?', 'partner'),
  message(504, '2026-11-12T10:01:00+09:00', '네 아직 있어요~', 'mine'),
  message(503, '2026-11-12T10:00:00+09:00', '자취생님이 거래를 요청했어요 · 3 크레딧 보류', 'system'),
  message(502, '2026-11-12T09:58:00+09:00', '안녕하세요! 우유 아직 있나요?', 'partner'),
  message(501, '2026-11-11T21:10:00+09:00', '혹시 내일도 구매 가능할까요?', 'partner'),
  message(500, '2026-11-11T21:12:00+09:00', '네 내일 오시면 돼요!', 'mine'),
].sort((a, b) => b.sentAt.localeCompare(a.sentAt));

export const MOCK_MANNER_BY_USER: Record<number, number> = { 7: 4.6, 9: 4.8, 11: 4.2, 12: 4.9 };
