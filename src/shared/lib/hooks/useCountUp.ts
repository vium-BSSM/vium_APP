import { useEffect, useState } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * 0부터 target까지 숫자를 올려가며 반환합니다.
 * target 또는 resetKey가 바뀌면 다시 0부터 시작합니다.
 */
export const useCountUp = (target: number, duration: number = 900, resetKey?: string) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId: number;
    const startedAt = Date.now();

    const tick = () => {
      const progress = Math.min((Date.now() - startedAt) / duration, 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    setValue(0);
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, resetKey]);

  return value;
};
