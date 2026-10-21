import { create } from 'zustand';

interface ProfileOverrides {
  nickname: string | null;
  profileImageUrl: string | null;
}

interface ProfileState extends ProfileOverrides {
  updateProfile: (changes: Partial<ProfileOverrides>) => void;
  reset: () => void;
}

/**
 * 프로필 수정 API 연동 전까지 수정 내용을 앱 메모리에 보관합니다.
 * 앱을 다시 시작하면 로그인 정보(sessionUser) 기준으로 초기화됩니다.
 */
const useProfileOverridesStore = create<ProfileState>()((set) => ({
  nickname: null,
  profileImageUrl: null,
  updateProfile: (changes) => set(changes),
  reset: () => set({ nickname: null, profileImageUrl: null }),
}));

const { updateProfile, reset } = useProfileOverridesStore.getState();

export const profileStore = {
  updateProfile,
  reset,
  getState: (): ProfileOverrides => {
    const { nickname, profileImageUrl } = useProfileOverridesStore.getState();
    return { nickname, profileImageUrl };
  },
};

export const useProfileStore = (): ProfileOverrides => {
  const nickname = useProfileOverridesStore((state) => state.nickname);
  const profileImageUrl = useProfileOverridesStore((state) => state.profileImageUrl);
  return { nickname, profileImageUrl };
};
