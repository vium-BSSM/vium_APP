import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Alert } from '@/shared/lib/alert';
import { PickedImage, pickImageAssetFromLibrary } from '@/shared/lib/pickImage';
import { useSessionUser } from '@/shared/lib/sessionUser';
import { uploadProfileImage } from '../api/accountApi';
import { checkProfileImage, ProfileImageType, saveProfileImageUrl } from './profileImage';
import { profileStore } from './profileStore';
import { useMyProfile } from './useMyProfile';

export const NICKNAME_MAX_LENGTH = 8;

const toUploadErrorMessage = (err: unknown) => {
  if (!isAxiosError(err) || !err.response) return '서버와 연결할 수 없습니다.';
  return err.response.data?.error?.message || '사진을 올리지 못했어요.';
};

export const useProfileEdit = () => {
  const user = useSessionUser();
  const { profile: initialProfile } = useMyProfile();
  const [nickname, setNickname] = useState(initialProfile.nickname);
  // 새로 고른 사진 (저장할 때 업로드) — 고르기 전에는 기존 프로필 사진을 보여줌
  const [pickedImage, setPickedImage] = useState<{ image: PickedImage; contentType: ProfileImageType } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const profileImageUrl = pickedImage?.image.uri ?? initialProfile.profileImageUrl;
  const trimmedNickname = nickname.trim();
  const isChanged = trimmedNickname !== initialProfile.nickname || pickedImage != null;
  const canSave = trimmedNickname.length > 0 && isChanged && !isSaving;

  const pickImage = async () => {
    // 서버 용량 제한(5MB)을 넘지 않도록 압축해서 받음
    const image = await pickImageAssetFromLibrary({ aspect: [1, 1], quality: 0.8 });
    if (!image) return;
    const checked = checkProfileImage(image);
    if (!checked.ok) {
      Alert.alert('알림', checked.message);
      return;
    }
    setPickedImage({ image, contentType: checked.contentType });
  };

  /** 새 사진이 있으면 먼저 업로드하고 저장 — 업로드에 실패하면 아무것도 바꾸지 않음 */
  const save = async (): Promise<boolean> => {
    if (!canSave) return false;
    try {
      setIsSaving(true);
      let uploadedUrl: string | null = null;

      if (pickedImage) {
        const response = await uploadProfileImage(pickedImage.image, pickedImage.contentType);
        if (!response.success || !response.data?.url) {
          Alert.alert('오류', response.error?.message || '사진을 올리지 못했어요.');
          return false;
        }
        uploadedUrl = response.data.url;
        if (user) await saveProfileImageUrl(user.id, uploadedUrl);
      }

      // TODO: 닉네임은 프로필 수정 API가 없어 아직 앱 메모리에만 저장
      profileStore.updateProfile({
        nickname: trimmedNickname,
        ...(uploadedUrl ? { profileImageUrl: uploadedUrl } : {}),
      });
      return true;
    } catch (err) {
      console.error('Failed to upload profile image:', err);
      Alert.alert('오류', toUploadErrorMessage(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    nickname,
    setNickname,
    clearNickname: () => setNickname(''),
    profileImageUrl,
    handle: initialProfile.handle,
    pickImage,
    canSave,
    isSaving,
    save,
  };
};
