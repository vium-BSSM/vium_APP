import { useCallback, useEffect, useState } from 'react';
import { getItem, setItem } from '../secureStorage';

const KEY_PREFIX = 'coachmark_seen_';

/**
 * 화면별 튜토리얼(코치마크)을 이미 봤는지 기기에 기록
 * - shouldShow: 저장소 확인이 끝났고 아직 안 본 경우에만 true
 * - markSeen: 끝까지 봤거나 건너뛰면 호출
 */
export const useCoachmarkSeen = (key: string) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let active = true;
    getItem(`${KEY_PREFIX}${key}`)
      .then((value) => {
        if (active && value !== 'true') setShouldShow(true);
      })
      .catch(() => {
        // 저장소를 못 읽으면 튜토리얼 없이 진행
      });
    return () => {
      active = false;
    };
  }, [key]);

  const markSeen = useCallback(() => {
    setShouldShow(false);
    setItem(`${KEY_PREFIX}${key}`, 'true').catch(() => {});
  }, [key]);

  return { shouldShow, markSeen };
};
