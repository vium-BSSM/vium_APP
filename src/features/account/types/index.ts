export interface MyProfile {
  nickname: string;
  handle: string;
  profileImageUrl: string | null;
}

export type MyPageMenuKey = 'credit' | 'trades' | 'logout' | 'settings' | 'withdraw';

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

// 설정 화면 — 기기 권한
export type PermissionKey = 'location' | 'photos' | 'camera';
// limited: iOS에서 사진 일부만 허용 / undetermined: 아직 안 물어봄(앱에서 요청 가능) / denied: 기기 설정에서만 변경 가능
export type PermissionState = 'granted' | 'limited' | 'undetermined' | 'denied';
