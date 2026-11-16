import { PostsQuery, TradeRole } from '../types';

export const communityKeys = {
  posts: (query: Partial<PostsQuery>) => ['posts', query] as const,
  postsAll: ['posts'] as const,
  post: (postId: number) => ['post', postId] as const,
  postPreview: (inventoryItemId: number) => ['postPreview', inventoryItemId] as const,
  trades: (role?: TradeRole) => ['trades', role ?? 'ALL'] as const,
  tradesAll: ['trades'] as const,
  userReviews: (userId: number) => ['userReviews', userId] as const,
  chatRooms: ['chatRooms'] as const,
  chatMessages: (chatRoomId: number) => ['chatMessages', chatRoomId] as const,
};
