import { CursorPage } from '@/shared/api/types';

// ---------- 게시물 ----------
export type PostType = 'SHARE' | 'SALE';
export type PostStatus = 'OPEN' | 'RESERVED' | 'COMPLETED' | 'EXPIRED';
export type PostSort = 'DISTANCE' | 'LATEST';
export type PostDistance = 1000 | 3000 | 5000 | 10000;

export interface PostSummary {
  postId: number;
  type: PostType;
  status: PostStatus;
  title: string;
  thumbnailUrl: string | null;
  ingredientName: string;
  quantity: number;
  unit: string;
  expiresOn: string;
  price: number;
  distanceMeters: number;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export interface PostsPage extends CursorPage {
  posts: PostSummary[];
}

export interface PostsQuery {
  latitude: number;
  longitude: number;
  distance: PostDistance;
  sort: PostSort;
  type?: PostType;
}

export interface PostAuthor {
  userId: number;
  displayName: string;
  profileImageUrl: string | null;
  mannerScore: number | null;
  reviewCount: number;
}

export interface PostIngredient {
  inventoryItemId: number;
  ingredientCatalogId: number | null;
  name: string;
  categoryName: string | null;
  quantity: number;
  unitId: number;
  unit: string;
  expiresOn: string;
  storageMethodId: number;
  storageMethodName: string;
  isOpened: boolean;
}

export interface PostDetail {
  postId: number;
  type: PostType;
  status: PostStatus;
  title: string;
  description: string;
  images: { imageId: number; url: string }[];
  author: PostAuthor;
  ingredient: PostIngredient;
  price: number;
  distanceMeters: number | null;
  likeCount: number;
  likedByMe: boolean;
  isMine: boolean;
  activeTradeId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LikeResult {
  postId: number;
  liked: boolean;
  likeCount: number;
}

export type PostIneligibleReason =
  | 'ALREADY_USED'
  | 'NOT_ACTIVE'
  | 'ALREADY_POSTED'
  | 'EXPIRES_TOO_SOON'
  | 'NOT_IN_CATALOG'
  | 'PROHIBITED_ITEM';

export interface PostPreview {
  inventoryItemId: number;
  eligible: boolean;
  ineligibleReasons: PostIneligibleReason[];
  saleAllowed: boolean;
  saleBlockedReason: 'NO_PRICE_BASIS' | 'ZERO_PRICE' | null;
  creditEstimate: {
    recommendedPrice: number;
    minPrice: number;
    maxPrice: number;
  } | null;
}

export interface CreatePostRequest {
  inventoryItemId: number;
  type: PostType;
  title: string;
  description?: string;
  price?: number;
  imageIds?: number[];
  isOpened: boolean;
  storageMethodId: 1 | 2 | 3;
  latitude: number;
  longitude: number;
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
  price?: number;
  imageIds?: number[];
}

export interface CreatePostResult {
  postId: number;
  status: PostStatus;
}

export interface UploadedImage {
  imageId: number;
  url: string | null;
}

// ---------- 거래 ----------
export type TradeStatus = 'REQUESTED' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED' | 'CANCELED';
export type TradeRole = 'BUYER' | 'SELLER';
export type TradeAction = 'accept' | 'reject' | 'cancel' | 'complete';

export interface TradePartner {
  userId: number;
  displayName: string;
  profileImageUrl: string | null;
}

export interface TradeSummary {
  tradeId: number;
  status: TradeStatus;
  role: TradeRole;
  post: { postId: number; type: PostType; title: string; thumbnailUrl: string | null };
  partner: TradePartner;
  price: number;
  requestedAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
  autoResolveAt: string | null;
  reviewWritten: boolean;
}

export interface TradesPage extends CursorPage {
  trades: TradeSummary[];
}

export interface TradeResult {
  tradeId: number;
  postId: number;
  status: TradeStatus;
  postStatus: PostStatus;
  price: number;
  heldCredit: number;
}

export interface ReviewRequest {
  mannerScore: number;
  content?: string | null;
}

export interface UserReviewsSummary {
  userId: number;
  mannerScore: number | null;
  reviewCount: number;
}

// ---------- 채팅 ----------
export type ChatMessageType = 'TEXT' | 'IMAGE' | 'SYSTEM';

export interface ChatRoomSummary {
  chatRoomId: number;
  post: { postId: number; title: string; thumbnailUrl: string | null; status: PostStatus };
  partner: TradePartner;
  lastMessage: { type: ChatMessageType; preview: string; sentAt: string } | null;
  unreadCount: number;
}

export interface ChatRoomsPage extends CursorPage {
  chatRooms: ChatRoomSummary[];
}

export interface ChatMessage {
  messageId: number;
  chatRoomId: number;
  senderId: number | null;
  type: ChatMessageType;
  content: string | null;
  imageUrl: string | null;
  systemEvent: string | null;
  sentAt: string;
  isMine: boolean;
}

export interface ChatMessagesPage extends CursorPage {
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  type: 'TEXT' | 'IMAGE';
  content?: string;
  imageId?: number;
}

// ---------- 신고·차단 ----------
export type ReportTargetType = 'USER' | 'POST';
export type ReportReason = 'SPAM' | 'FRAUD' | 'PROHIBITED_ITEM' | 'ABUSIVE' | 'ETC';

export interface ReportRequest {
  targetType: ReportTargetType;
  targetId: number;
  reason: ReportReason;
  // reason=ETC면 필수 (최대 500자)
  detail?: string | null;
}

export interface BlockedUser {
  userId: number;
  displayName: string;
  blockedAt: string;
}

export interface BlockedUsersData {
  blockedUsers: BlockedUser[];
}

export interface BlockResult {
  userId: number;
  blocked: boolean;
}

// ---------- 화면용 ----------
// Figma badge 상태 (거래 status · 게시물 type/status 매핑)
export type BadgeKind = 'requested' | 'reserved' | 'completed' | 'rejected' | 'canceled' | 'share' | 'sale' | 'expired';

export type FeedSort = PostSort | 'EXPIRING';
export type FeedTypeFilter = 'ALL' | PostType;
export type TradeRoleFilter = 'ALL' | TradeRole;
