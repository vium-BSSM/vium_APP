import { MY_PROFILE_FIXTURE } from './profileFixtures';

// 내 정보 API 연동 전까지는 임시 데이터로 화면을 보여줍니다.
export const useMyProfile = () => {
  return {
    profile: MY_PROFILE_FIXTURE,
    isLoading: false,
    error: null as string | null,
  };
};
