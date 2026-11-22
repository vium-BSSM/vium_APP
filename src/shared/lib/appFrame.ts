import { Platform } from 'react-native';

export interface AppFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 앱 화면(모달이 깔리는 영역)의 창 기준 위치·크기
 * 웹 데스크톱은 body가 402px 폰 프레임(+html.tsx)이라 브라우저 창과 원점·크기가 다름
 * → measureInWindow 좌표에서 x·y를 빼야 모달 안 위치가 맞음
 */
export const getAppFrame = (windowWidth: number, windowHeight: number): AppFrame => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const box = document.body.getBoundingClientRect();
    return { x: box.left, y: box.top, width: box.width, height: box.height };
  }
  return { x: 0, y: 0, width: windowWidth, height: windowHeight };
};
