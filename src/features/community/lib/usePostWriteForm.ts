import { useState } from 'react';
import { checkProfileImage } from '@/features/account';
import { Alert } from '@/shared/lib/alert';
import { PickedImage, pickImageAssetFromLibrary } from '@/shared/lib/pickImage';
import { PostType } from '../types';

export const MAX_POST_IMAGES = 5;
export const TITLE_MAX_LENGTH = 50;
export const DESCRIPTION_MAX_LENGTH = 1000;

interface PickedPostImage {
  image: PickedImage;
  contentType: 'image/jpeg' | 'image/png';
}

/** 나눔·판매 글쓰기 폼 상태 (UI 전용 — 등록 API는 feature/community-api 브랜치) */
export const usePostWriteForm = (defaultStorageMethodId: number | null) => {
  const [type, setType] = useState<PostType>('SHARE');
  const [price, setPrice] = useState('');
  const [storageChoice, setStorageMethodId] = useState<1 | 2 | 3 | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<PickedPostImage[]>([]);

  // 직접 고르기 전에는 재료의 보관 방법을 기본값으로
  const storageMethodId: 1 | 2 | 3 =
    storageChoice ??
    (defaultStorageMethodId === 1 || defaultStorageMethodId === 2 || defaultStorageMethodId === 3 ? defaultStorageMethodId : 1);

  const addImage = async () => {
    if (images.length >= MAX_POST_IMAGES) return;
    const image = await pickImageAssetFromLibrary({ quality: 0.8 });
    if (!image) return;
    const checked = checkProfileImage(image);
    if (!checked.ok) {
      Alert.alert('알림', checked.message);
      return;
    }
    setImages((prev) => [...prev, { image, contentType: checked.contentType }]);
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  return {
    type,
    setType,
    price,
    setPrice,
    storageMethodId,
    setStorageMethodId,
    isOpened,
    setIsOpened,
    title,
    setTitle,
    description,
    setDescription,
    images,
    addImage,
    removeImage,
  };
};
