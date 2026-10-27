import type { OcrResult } from './textRecognition';

export type { OcrLine, OcrResult } from './textRecognition';

// ML Kit은 네이티브 전용이라 웹에서는 인식 불가 (호출 측에서 직접 등록으로 안내)
export const recognizeText = async (_image: {
  uri: string;
  width: number;
  height: number;
}): Promise<OcrResult> => {
  throw new Error('웹에서는 텍스트 인식을 지원하지 않습니다.');
};
