import type { SplashEaseCurve, SplashKeyframe } from './splashTypes';

// CSS cubic-bezier와 같은 곡선: x(진행 시간)에 해당하는 y(진행량)를 이분 탐색으로 구함
const solveCubicBezier = (curve: SplashEaseCurve, x: number) => {
  'worklet';
  const [x1, y1, x2, y2] = curve;
  const bezier = (a: number, b: number, t: number) => {
    const u = 1 - t;
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
  };

  let low = 0;
  let high = 1;
  let t = x;
  for (let i = 0; i < 20; i++) {
    const current = bezier(x1, x2, t);
    if (Math.abs(current - x) < 1e-4) break;
    if (current < x) low = t;
    else high = t;
    t = (low + high) / 2;
  }
  return bezier(y1, y2, t);
};

/** 전체 진행도(0~1)에서 트랙 값을 계산 — CSS @keyframes와 같은 방식 */
export const sampleSplashTrack = (
  keyframes: readonly SplashKeyframe[],
  progress: number,
  eases: readonly SplashEaseCurve[]
) => {
  'worklet';
  const last = keyframes[keyframes.length - 1];
  if (progress >= last[0]) return last[1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    const [startAt, from, easeIndex] = keyframes[i];
    const [endAt, to] = keyframes[i + 1];
    if (progress < endAt) {
      const local = endAt === startAt ? 1 : (progress - startAt) / (endAt - startAt);
      const eased = easeIndex < 0 ? local : solveCubicBezier(eases[easeIndex], local);
      return from + (to - from) * eased;
    }
  }
  return last[1];
};
