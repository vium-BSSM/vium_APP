import { isAxiosError } from 'axios';

// 백엔드 공통 응답 형태 { success, data, error }
export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

// 커서 기반 무한 스크롤 응답의 공통 필드
export interface CursorPage {
  nextCursor: string | null;
  hasNext: boolean;
}

/** success=false면 error.message로 예외를 던지고, 성공이면 data를 꺼냄 (TanStack Query queryFn용) */
export const unwrap = <T>(response: ApiResponse<T>, fallback = '요청을 처리할 수 없어요.'): T => {
  if (!response.success || response.data === null) {
    throw new Error(response.error?.message ?? fallback);
  }
  return response.data;
};

/** axios 에러면 서버가 보낸 error.message, 아니면 기본 문구 */
export const getErrorMessage = (err: unknown, fallback = '서버와 연결할 수 없어요.') => {
  if (isAxiosError(err)) {
    const message = (err.response?.data as ApiResponse<unknown> | undefined)?.error?.message;
    return message ?? fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};

/** axios 에러의 서버 error.code (예: 'DAILY_REWARD_ALREADY_CLAIMED') */
export const getErrorCode = (err: unknown): string | null => {
  if (!isAxiosError(err)) return null;
  return (err.response?.data as ApiResponse<unknown> | undefined)?.error?.code ?? null;
};
