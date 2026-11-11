// [at(0~1), value, easeIndex] — easeIndex는 이 키프레임 → 다음 키프레임 구간의 이징 (SPLASH_EASES 인덱스, -1 = linear)
export type SplashKeyframe = readonly number[];

export type SplashTrackKey = 'x' | 'y' | 'rotate' | 'scaleX' | 'scaleY' | 'opacity';

// x·y는 px, rotate는 rad (Figma 모션 값 그대로)
export type SplashTracks = Partial<Record<SplashTrackKey, readonly SplashKeyframe[]>>;

// cubic-bezier(x1, y1, x2, y2)
export type SplashEaseCurve = readonly number[];

// 402×874 아트보드 기준 배치. rotate가 있으면 left/top/width/height는 회전된 박스의 외곽,
// innerWidth/innerHeight는 회전 전 원래 크기. inset은 이미지가 박스 밖으로 나가는 비율(%) [top, right, bottom, left]
export interface SplashPiece<Asset extends string> {
  id: string;
  asset?: Asset;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  innerWidth?: number;
  innerHeight?: number;
  inset?: readonly number[];
  tracks: SplashTracks;
}
