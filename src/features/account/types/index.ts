export interface MyProfile {
  nickname: string;
  handle: string;
  profileImageUrl: string | null;
}

export type MyPageMenuKey = 'logout' | 'settings' | 'inquiry' | 'withdraw';

// GET /api/me, PATCH /api/me 응답
export interface MeApiResponse {
  success: boolean;
  data: {
    id: number;
    email: string;
    displayName: string;
    profileImageUrl: string | null;
  } | null;
  error: null | {
    code: string;
    message: string;
  };
}

// PATCH /api/me — 보낸 필드만 변경 (null은 안 보낸 것으로 처리돼 이미지 해제는 불가)
export interface UpdateMeRequest {
  displayName?: string;
  profileImageId?: number;
}

// DELETE /api/me
export interface DeleteMeApiResponse {
  success: boolean;
  data: null;
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
