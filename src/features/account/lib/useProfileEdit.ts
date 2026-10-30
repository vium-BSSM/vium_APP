import { useState } from 'react';
import { pickImageFromLibrary } from '@/shared/lib/pickImage';
import { profileStore } from './profileStore';
import { useMyProfile } from './useMyProfile';

export const NICKNAME_MAX_LENGTH = 8;

export const useProfileEdit = () => {
  const { profile: initialProfile } = useMyProfile();
  const [nickname, setNickname] = useState(initialProfile.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(initialProfile.profileImageUrl);

  const trimmedNickname = nickname.trim();
  const isChanged =
    trimmedNickname !== initialProfile.nickname ||
    profileImageUrl !== initialProfile.profileImageUrl;
  const canSave = trimmedNickname.length > 0 && isChanged;

  const pickImage = async () => {
    const uri = await pickImageFromLibrary({ aspect: [1, 1] });
    if (uri) setProfileImageUrl(uri);
  };

  // TODO: 프로필 수정 API 연동 (현재는 앱 메모리에만 저장)
  const save = () => {
    if (!canSave) return false;
    profileStore.updateProfile({ nickname: trimmedNickname, profileImageUrl });
    return true;
  };

  return {
    nickname,
    setNickname,
    clearNickname: () => setNickname(''),
    profileImageUrl,
    handle: initialProfile.handle,
    pickImage,
    canSave,
    save,
  };
};
