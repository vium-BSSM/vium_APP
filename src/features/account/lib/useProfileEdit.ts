import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Alert } from '@/shared/lib/alert';
import { PickedImage, pickImageAssetFromLibrary } from '@/shared/lib/pickImage';
import { sessionUserStore } from '@/shared/lib/sessionUser';
import { updateMe, uploadProfileImage } from '../api/accountApi';
import { UpdateMeRequest } from '../types';
import { checkProfileImage, ProfileImageType } from './profileImage';
import { useMyProfile } from './useMyProfile';

export const NICKNAME_MAX_LENGTH = 8;

const toSaveErrorMessage = (err: unknown) => {
  if (!isAxiosError(err) || !err.response) return '서버와 연결할 수 없습니다.';
  return err.response.data?.error?.message || '프로필을 저장하지 못했어요.';
};

export const useProfileEdit = () => {
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

  /** 새 사진이 있으면 먼저 업로드한 뒤 PATCH /api/me로 바뀐 항목만 저장 — 하나라도 실패하면 프로필은 그대로 */
  const save = async (): Promise<boolean> => {
    if (!canSave) return false;
    try {
      setIsSaving(true);
      const request: UpdateMeRequest = {};

      if (trimmedNickname !== initialProfile.nickname) {
        request.displayName = trimmedNickname;
      }

      if (pickedImage) {
        const upload = await uploadProfileImage(pickedImage.image, pickedImage.contentType);
        if (!upload.success || !upload.data) {
          Alert.alert('오류', upload.error?.message || '사진을 올리지 못했어요.');
          return false;
        }
        request.profileImageId = upload.data.imageId;
      }

      const response = await updateMe(request);
      if (!response.success || !response.data) {
        Alert.alert('오류', response.error?.message || '프로필을 저장하지 못했어요.');
        return false;
      }
      await sessionUserStore.set(response.data);
      return true;
    } catch (err) {
      console.error('Failed to save profile:', err);
      Alert.alert('오류', toSaveErrorMessage(err));
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
