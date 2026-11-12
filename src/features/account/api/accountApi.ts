import { Platform } from 'react-native';
import { apiClient } from '@/shared/api/client';
import { PickedImage } from '@/shared/lib/pickImage';
import { DeleteMeApiResponse, ImageUploadApiResponse, MeApiResponse, UpdateMeRequest } from '../types';

export const getMe = async (): Promise<MeApiResponse> => {
  const response = await apiClient.get<MeApiResponse>('/api/me');
  return response.data;
};

/** 프로필 수정 — 이미지는 먼저 업로드(purpose=PROFILE)한 뒤 받은 imageId를 보냄 */
export const updateMe = async (request: UpdateMeRequest): Promise<MeApiResponse> => {
  const response = await apiClient.patch<MeApiResponse>('/api/me', request);
  return response.data;
};

/** 회원 탈퇴 — 서버에서 모든 로그인 세션이 삭제됨 */
export const deleteMe = async (): Promise<DeleteMeApiResponse> => {
  const response = await apiClient.delete<DeleteMeApiResponse>('/api/me');
  return response.data;
};

const toFilePart = async (image: PickedImage, contentType: string) => {
  const name = contentType === 'image/png' ? 'profile.png' : 'profile.jpg';
  // 웹은 실제 Blob이 필요하고, React Native는 { uri, name, type } 객체로 파일을 받음
  if (Platform.OS === 'web') {
    const blob = await (await fetch(image.uri)).blob();
    return { part: blob, name };
  }
  return { part: { uri: image.uri, name, type: contentType } as unknown as Blob, name };
};

/** 프로필 사진 업로드 — 서버는 JPEG·PNG만 받고, 선언한 형식과 실제 파일 형식이 같아야 함 */
export const uploadProfileImage = async (
  image: PickedImage,
  contentType: 'image/jpeg' | 'image/png'
): Promise<ImageUploadApiResponse> => {
  const formData = new FormData();
  const { part, name } = await toFilePart(image, contentType);
  formData.append('file', part, name);
  formData.append('purpose', 'PROFILE');

  const response = await apiClient.post<ImageUploadApiResponse>('/api/me/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
