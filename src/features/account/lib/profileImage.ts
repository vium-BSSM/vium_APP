import { PickedImage } from '@/shared/lib/pickImage';

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
