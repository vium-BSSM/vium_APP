import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';

export interface OcrLine {
  text: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface OcrResult {
  imageWidth: number;
  imageHeight: number;
  lines: OcrLine[];
}

const MAX_LINES = 300;
const MAX_TEXT_LENGTH = 200;

const clamp = (value: number, max: number) => Math.min(Math.max(Math.round(value), 0), max);

/**
 * 이미지에서 한국어 텍스트를 인식해 모든 Block의 Line을 좌표와 함께 펼쳐 반환
 * 좌표는 회전이 반영된 원본 이미지 픽셀 기준이라, width/height도 같은 기준의 값을 넘겨야 함
 * (expo-image-picker asset의 width/height)
 */
export const recognizeText = async (image: {
  uri: string;
  width: number;
  height: number;
}): Promise<OcrResult> => {
  const result = await TextRecognition.recognize(image.uri, TextRecognitionScript.KOREAN);

  const lines: OcrLine[] = [];
  for (const block of result.blocks) {
    for (const line of block.lines) {
      const text = line.text.trim().slice(0, MAX_TEXT_LENGTH);
      if (!text || !line.frame) continue;

      const { left, top, width, height } = line.frame;
      lines.push({
        text,
        left: clamp(left, image.width),
        top: clamp(top, image.height),
        right: clamp(left + width, image.width),
        bottom: clamp(top + height, image.height),
      });
    }
  }

  return {
    imageWidth: image.width,
    imageHeight: image.height,
    lines: lines.slice(0, MAX_LINES),
  };
};
