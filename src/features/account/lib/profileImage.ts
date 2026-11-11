import { PickedImage } from '@/shared/lib/pickImage';
import { getItem, setItem } from '@/shared/lib/secureStorage';

// 서버 업로드 제한 (vium_BE ImageValidator와 같은 값)
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_SIDE_PX = 4096;

export type ProfileImageType = 'image/jpeg' | 'image/png';

const typeFromUri = (uri: string): ProfileImageType | null => {
  const path = uri.split('?')[0].toLowerCase();
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  return null;
};

/** 업로드 전에 서버가 거절할 사진을 미리 걸러냄 — 문제가 없으면 보낼 형식을, 있으면 안내 문구를 반환 */
export const checkProfileImage = (
  image: PickedImage
): { ok: true; contentType: ProfileImageType } | { ok: false; message: string } => {
  const mime = image.mimeType?.toLowerCase();
  const contentType =
    mime === 'image/jpeg' || mime === 'image/jpg' ? 'image/jpeg' : mime === 'image/png' ? 'image/png' : typeFromUri(image.uri);
  if (!contentType) {
    return { ok: false, message: 'JPG 또는 PNG 사진만 올릴 수 있어요.' };
  }
  if (image.fileSize != null && image.fileSize > MAX_BYTES) {
    return { ok: false, message: '5MB 이하의 사진만 올릴 수 있어요.' };
  }
  if (image.width > MAX_SIDE_PX || image.height > MAX_SIDE_PX) {
    return { ok: false, message: '가로·세로 4096px 이하의 사진만 올릴 수 있어요.' };
  }
  return { ok: true, contentType };
};

/**
 * 업로드한 프로필 사진 주소를 이 기기에 보관
 * TODO: 백엔드에 프로필 수정 API(PATCH /api/me + profileImageId)와 GET /api/me의 프로필 이미지가 생기면
 *       imageId를 서버에 저장하고 이 로컬 보관은 제거
 */
// SecureStore 키는 영문·숫자·._- 만 허용
const storageKey = (userId: number) => `profile_image_url_${userId}`;

export const loadSavedProfileImageUrl = async (userId: number): Promise<string | null> => {
  try {
    return await getItem(storageKey(userId));
  } catch (err) {
    console.error('Failed to load profile image url:', err);
    return null;
  }
};

export const saveProfileImageUrl = async (userId: number, url: string): Promise<void> => {
  try {
    await setItem(storageKey(userId), url);
  } catch (err) {
    console.error('Failed to save profile image url:', err);
  }
};
