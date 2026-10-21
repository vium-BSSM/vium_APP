import { createStore } from '@/shared/lib/createStore';

interface ProfileOverrides {
  nickname: string | null;
  profileImageUrl: string | null;
}

/**
 * 프로필 수정 API 연동 전까지 수정 내용을 앱 메모리에 보관합니다.
 * 앱을 다시 시작하면 로그인 정보(sessionUser) 기준으로 초기화됩니다.
 */
const store = createStore<ProfileOverrides>({ nickname: null, profileImageUrl: null });

const updateProfile = (changes: Partial<ProfileOverrides>) => {
  store.setState({ ...store.getState(), ...changes });
};

const reset = () => {
  store.setState({ nickname: null, profileImageUrl: null });
};

export const profileStore = {
  updateProfile,
  reset,
  getState: store.getState,
};

export const useProfileStore = store.useStore;
