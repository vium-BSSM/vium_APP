import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkProfileImage } from '@/features/account';
import { getErrorMessage, unwrap } from '@/shared/api/types';
import { Alert } from '@/shared/lib/alert';
import { PickedImage, pickImageAssetFromLibrary } from '@/shared/lib/pickImage';
import { Coordinates } from '@/shared/lib/useCurrentLocation';
import { createPost, getPostPreview, uploadImage } from '../api/postApi';
import { INELIGIBLE_REASON_LABEL } from './communityFormat';
import { communityKeys } from './queryKeys';
import { PostType } from '../types';

export const MAX_POST_IMAGES = 5;
export const TITLE_MAX_LENGTH = 50;
export const DESCRIPTION_MAX_LENGTH = 1000;

interface PickedPostImage {
  image: PickedImage;
  contentType: 'image/jpeg' | 'image/png';
}

export const usePostPreview = (inventoryItemId: number | null) => {
  const query = useQuery({
    queryKey: communityKeys.postPreview(inventoryItemId ?? 0),
    queryFn: async () => unwrap(await getPostPreview(inventoryItemId!)),
    enabled: inventoryItemId !== null,
  });
  const preview = query.data ?? null;
  const ineligibleMessage =
    preview && !preview.eligible
      ? (preview.ineligibleReasons.map((reason) => INELIGIBLE_REASON_LABEL[reason]).find(Boolean) ??
        '이 재료는 올릴 수 없어요.')
      : null;
  return { preview, ineligibleMessage, isLoading: query.isFetching, error: query.error?.message ?? null };
};

interface WriteForm {
  inventoryItemId: number | null;
  defaultStorageMethodId: number | null;
  // 사진을 하나도 안 고르면 대신 올릴 재료 사진 URL (직접 올린 사진, 없으면 기본 이미지)
  fallbackImageUrl?: string;
}

/** 원격 재료 사진을 게시물 사진(POST)으로 다시 올림 — 서버는 POST 용도 사진만 게시물에 붙일 수 있음 */
const uploadFallbackImage = async (url: string): Promise<number | null> => {
  try {
    const contentType = /\.png($|\?)/i.test(url) ? 'image/png' : 'image/jpeg';
    const image: PickedImage = { uri: url, width: 0, height: 0 };
    return unwrap(await uploadImage(image, contentType, 'POST')).imageId;
  } catch (err) {
    // 기본 사진은 보조 기능이라 실패해도 사진 없이 게시
    console.warn('Failed to upload fallback post image:', err);
    return null;
  }
};

/** 나눔·판매 글쓰기 폼 상태와 등록 (사진 업로드 → 게시물 등록) */
export const usePostWrite = ({ inventoryItemId, defaultStorageMethodId, fallbackImageUrl }: WriteForm) => {
  const queryClient = useQueryClient();
  const { preview, ineligibleMessage, isLoading: isPreviewLoading } = usePostPreview(inventoryItemId);

  // 사용자가 직접 고르기 전까지는 재료 기준 기본값(판매 가능 여부, 추천가, 보관 방법)을 보여줌
  const [typeChoice, setType] = useState<PostType | null>(null);
  const [priceChoice, setPrice] = useState<string | null>(null);
  const [storageChoice, setStorageMethodId] = useState<1 | 2 | 3 | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<PickedPostImage[]>([]);

  // 재료를 바꾸면 고른 값을 지우고 새 재료의 기본값으로 (렌더 중 갱신 — effect 연쇄 렌더 방지)
  const [prevItemId, setPrevItemId] = useState(inventoryItemId);
  if (prevItemId !== inventoryItemId) {
    setPrevItemId(inventoryItemId);
    setType(null);
    setPrice(null);
    setStorageMethodId(null);
  }

  const saleAllowed = preview?.saleAllowed ?? false;
  const type: PostType = saleAllowed ? (typeChoice ?? 'SALE') : 'SHARE';
  const price = priceChoice ?? (preview?.creditEstimate ? String(preview.creditEstimate.recommendedPrice) : '');
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

  const range = preview?.creditEstimate ?? null;
  const priceNumber = Number(price);
  const priceError =
    type === 'SALE' && range && (!Number.isInteger(priceNumber) || priceNumber < range.minPrice || priceNumber > range.maxPrice)
      ? `${range.minPrice}~${range.maxPrice} 크레딧 사이로 정해주세요`
      : null;

  const canSubmit =
    inventoryItemId !== null && preview?.eligible === true && title.trim().length > 0 && priceError === null;

  const mutation = useMutation({
    mutationFn: async (coords: Coordinates) => {
      // 사진을 먼저 올리고 받은 id 순서대로 보냄 (첫 번째가 썸네일)
      const imageIds: number[] = [];
      for (const picked of images) {
        imageIds.push(unwrap(await uploadImage(picked.image, picked.contentType, 'POST')).imageId);
      }
      if (imageIds.length === 0 && fallbackImageUrl) {
        const fallbackId = await uploadFallbackImage(fallbackImageUrl);
        if (fallbackId !== null) imageIds.push(fallbackId);
      }
      return unwrap(
        await createPost({
          inventoryItemId: inventoryItemId!,
          type,
          title: title.trim(),
          description: description.trim() || undefined,
          price: type === 'SALE' ? priceNumber : undefined,
          imageIds,
          isOpened,
          storageMethodId,
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityKeys.postsAll }),
  });

  const submit = async (coords: Coordinates | null): Promise<number | null> => {
    if (!canSubmit) return null;
    if (!coords) {
      Alert.alert('위치 필요', '게시 위치를 확인할 수 없어요. 위치 권한을 허용해주세요.');
      return null;
    }
    try {
      const result = await mutation.mutateAsync(coords);
      return result.postId;
    } catch (err) {
      Alert.alert('등록 실패', getErrorMessage(err, '게시물을 등록하지 못했어요.'));
      return null;
    }
  };

  return {
    preview,
    ineligibleMessage,
    isPreviewLoading,
    type,
    setType,
    price,
    setPrice,
    priceError,
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
    canSubmit,
    isSubmitting: mutation.isPending,
    submit,
  };
};
