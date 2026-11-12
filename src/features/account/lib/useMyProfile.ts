import { useEffect, useState } from 'react';
import { sessionUserStore, useSessionUser } from '@/shared/lib/sessionUser';
import { getMe } from '../api/accountApi';
import { MyProfile } from '../types';

// 저장된 로그인 사용자 정보로 먼저 보여주고, GET /api/me 응답으로 최신화합니다.
export const useMyProfile = () => {
  const user = useSessionUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadMe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getMe();
        if (!isActive) return;
        if (response.success && response.data) {
          await sessionUserStore.set(response.data);
        } else {
          setError(response.error?.message || '내 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        // 401은 apiClient에서 토큰 재발급/로그인 이동으로 처리
        console.error('Failed to load my profile:', err);
        if (isActive) setError('내 정보를 불러올 수 없습니다.');
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadMe();
    return () => {
      isActive = false;
    };
  }, []);

  const profile: MyProfile = {
    nickname: user?.displayName ?? '',
    // 백엔드에 핸들 필드가 없어 이메일 앞부분을 사용
    handle: user?.email.split('@')[0] ?? '',
    profileImageUrl: user?.profileImageUrl ?? null,
  };

  return {
    profile,
    isLoading,
    error,
  };
};
