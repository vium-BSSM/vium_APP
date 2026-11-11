export interface MyProfile {
  nickname: string;
  handle: string;
  profileImageUrl: string | null;
}

export type MyPageMenuKey = 'logout' | 'settings' | 'inquiry' | 'withdraw';

export interface MeApiResponse {
  success: boolean;
  data: {
    id: number;
    email: string;
    displayName: string;
  } | null;
  error: null | {
    code: string;
    message: string;
  };
}

// POST /api/me/images (purpose=PROFILE) — 공개 이미지라 url을 바로 표시에 사용
export interface ImageUploadApiResponse {
  success: boolean;
  data: {
    imageId: number;
    purpose: 'RECEIPT' | 'PROFILE' | 'RECIPE';
    visibility: string;
    contentType: string;
    sizeBytes: number;
    url: string | null;
    createdAt: string;
  } | null;
  error: null | {
    code: string;
    message: string;
  };
}
