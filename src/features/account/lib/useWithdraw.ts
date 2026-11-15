import { useRef } from 'react';
import { isAxiosError } from 'axios';
import { Alert } from '@/shared/lib/alert';
import { sessionUserStore } from '@/shared/lib/sessionUser';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { deleteMe } from '../api/accountApi';

const toWithdrawErrorMessage = (err: unknown) => {
  if (!isAxiosError(err) || !err.response) return '서버와 연결할 수 없습니다.';
  return err.response.data?.error?.message || '회원 탈퇴에 실패했어요.';
};

export const useWithdraw = () => {
  // 성공하면 바로 화면을 이동하므로 state 대신 ref로 요청 중 중복 실행을 막음
  const isWithdrawing = useRef(false);

  /** 탈퇴 성공 시 기기의 토큰·사용자 정보를 지우고 true 반환 (화면 이동은 호출한 쪽에서) */
  const withdraw = async (): Promise<boolean> => {
    if (isWithdrawing.current) return false;
    isWithdrawing.current = true;

    try {
      const response = await deleteMe();
      if (!response.success) {
        Alert.alert('오류', response.error?.message || '회원 탈퇴에 실패했어요.');
        return false;
      }
      // 서버 세션은 삭제됐지만 기존 Access Token은 만료 전까지 일부 API를 통과할 수 있어 즉시 삭제
      await tokenStorage.clearTokens();
      await sessionUserStore.clear();
      return true;
    } catch (err) {
      // 401(이미 탈퇴·토큰 만료)은 apiClient가 토큰 정리 후 로그인 화면으로 이동시킴
      console.error('Failed to withdraw:', err);
      if (!isAxiosError(err) || err.response?.status !== 401) {
        Alert.alert('오류', toWithdrawErrorMessage(err));
      }
      return false;
    } finally {
      isWithdrawing.current = false;
    }
  };

  return { withdraw };
};
