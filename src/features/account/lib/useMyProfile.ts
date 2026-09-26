import { useProfileStore } from './profileStore';

// 내 정보 API 연동 전까지는 임시 데이터로 화면을 보여줍니다.
export const useMyProfile = () => {
  const profile = useProfileStore();

  return {
    profile,
    isLoading: false,
    error: null as string | null,
  };
};
