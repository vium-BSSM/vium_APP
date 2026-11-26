import { PickedImage } from './pickImage';

const loadImage = (uri: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image'));
    img.src = uri;
  });

/**
 * 웹 전용 — 웹 사진 선택기는 자르기(allowsEditing)·압축(quality)을 지원하지 않아 원본 파일을 그대로 돌려줌.
 * 가운데를 정사각형으로 잘라 maxSide 이하로 줄인 JPEG로 다시 만듦 (브라우저가 못 여는 형식이면 null)
 */
export const cropSquareImageOnWeb = async (
  image: PickedImage,
  { maxSide, quality }: { maxSide: number; quality: number }
): Promise<PickedImage | null> => {
  try {
    const img = await loadImage(image.uri);
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const side = Math.min(width, height);
    if (side < 1) return null;
    const outSide = Math.min(side, maxSide);

    const canvas = document.createElement('canvas');
    canvas.width = outSide;
    canvas.height = outSide;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // JPEG는 투명도가 없으므로 투명 PNG가 검게 나오지 않도록 흰 배경을 먼저 칠함
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outSide, outSide);
    ctx.drawImage(img, (width - side) / 2, (height - side) / 2, side, side, 0, 0, outSide, outSide);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) return null;

    if (image.uri.startsWith('blob:')) URL.revokeObjectURL(image.uri);
    return {
      uri: URL.createObjectURL(blob),
      width: outSide,
      height: outSide,
      mimeType: 'image/jpeg',
      fileSize: blob.size,
    };
  } catch {
    return null;
  }
};
