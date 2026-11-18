import { Platform } from 'react-native';
import { apiClient } from '@/shared/api/client';
import { ApiResponse } from '@/shared/api/types';
import { PickedImage } from '@/shared/lib/pickImage';
import {
  CreatePostRequest,
  CreatePostResult,
  LikeResult,
  PostDetail,
  PostPreview,
  PostsPage,
  PostsQuery,
  UpdatePostRequest,
  UploadedImage,
} from '../types';

/** 내 위치 반경의 나눔·판매 게시물 (커서 무한 스크롤) */
export const getPosts = async (query: PostsQuery, cursor?: string): Promise<ApiResponse<PostsPage>> => {
  const response = await apiClient.get<ApiResponse<PostsPage>>('/api/posts', {
    params: { ...query, cursor, size: 20 },
  });
  return response.data;
};

export const getPost = async (
  postId: number,
  coords?: { latitude: number; longitude: number } | null
): Promise<ApiResponse<PostDetail>> => {
  const response = await apiClient.get<ApiResponse<PostDetail>>(`/api/posts/${postId}`, {
    params: coords ?? undefined,
  });
  return response.data;
};

export const likePost = async (postId: number): Promise<ApiResponse<LikeResult>> => {
  const response = await apiClient.put<ApiResponse<LikeResult>>(`/api/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId: number): Promise<ApiResponse<LikeResult>> => {
  const response = await apiClient.delete<ApiResponse<LikeResult>>(`/api/posts/${postId}/like`);
  return response.data;
};

/** 글쓰기 진입 시 — 게시 가능 여부와 추천 크레딧 */
export const getPostPreview = async (inventoryItemId: number): Promise<ApiResponse<PostPreview>> => {
  const response = await apiClient.get<ApiResponse<PostPreview>>(`/api/me/ingredients/${inventoryItemId}/post-preview`);
  return response.data;
};

export const createPost = async (request: CreatePostRequest): Promise<ApiResponse<CreatePostResult>> => {
  const response = await apiClient.post<ApiResponse<CreatePostResult>>('/api/me/posts', request);
  return response.data;
};

/** 내 게시물 수정 — 거래 요청 중이면 409 */
export const updatePost = async (postId: number, request: UpdatePostRequest): Promise<ApiResponse<PostDetail>> => {
  const response = await apiClient.patch<ApiResponse<PostDetail>>(`/api/me/posts/${postId}`, request);
  return response.data;
};

/** 내 게시물 삭제 — 진행 중·완료된 거래가 있으면 409, 삭제하면 재고 잠금이 풀림 */
export const deletePost = async (postId: number): Promise<ApiResponse<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/api/me/posts/${postId}`);
  return response.data;
};

/** 게시물(POST)·채팅(CHAT) 사진 업로드 — 서버는 JPEG·PNG만 받음 */
export const uploadImage = async (
  image: PickedImage,
  contentType: 'image/jpeg' | 'image/png',
  purpose: 'POST' | 'CHAT'
): Promise<ApiResponse<UploadedImage>> => {
  const name = contentType === 'image/png' ? 'image.png' : 'image.jpg';
  const formData = new FormData();
  // 웹은 실제 Blob이 필요하고, React Native는 { uri, name, type } 객체로 파일을 받음
  const part =
    Platform.OS === 'web'
      ? await (await fetch(image.uri)).blob()
      : ({ uri: image.uri, name, type: contentType } as unknown as Blob);
  formData.append('file', part, name);
  formData.append('purpose', purpose);

  const response = await apiClient.post<ApiResponse<UploadedImage>>('/api/me/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
