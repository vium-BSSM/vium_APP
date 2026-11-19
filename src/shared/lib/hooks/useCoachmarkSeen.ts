import { useCallback, useEffect, useState } from 'react';
import { getItem, removeItem, setItem } from '../secureStorage';

const KEY_PREFIX = 'coachmark_seen_';

// 튜토리얼이 있는 화면 — 새 화면에 튜토리얼을 넣으면 여기에도 추가 (설정에서 한 번에 켜고 끄기 위함)
export const COACHMARK_KEYS = [
  'fridge',
  'fridgeAdd',
  'fridgeCleanupAmount',
  'recipeList',
  'recipeWaste',
  'report',
  'communityFeed',
] as const;
export type CoachmarkKey = (typeof COACHMARK_KEYS)[number];

// 설정에서 일괄 변경 시, 이미 떠 있는 화면(탭은 계속 마운트됨)도 바로 반영되도록 알림
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

/** 모든 화면의 튜토리얼을 처음부터 다시 보이게 */
export const resetAllCoachmarks = async () => {
  await Promise.all(COACHMARK_KEYS.map((key) => removeItem(`${KEY_PREFIX}${key}`).catch(() => {})));
  notify();
};

/** 모든 화면의 튜토리얼을 본 것으로 처리 (끄기) */
export const markAllCoachmarksSeen = async () => {
  await Promise.all(COACHMARK_KEYS.map((key) => setItem(`${KEY_PREFIX}${key}`, 'true').catch(() => {})));
  notify();
};

/** 아직 안 본 튜토리얼이 하나라도 있는지 (설정 화면 토글 표시용) */
export const hasUnseenCoachmarks = async () => {
  const values = await Promise.all(COACHMARK_KEYS.map((key) => getItem(`${KEY_PREFIX}${key}`).catch(() => 'true')));
  return values.some((value) => value !== 'true');
};

/**
 * 화면별 튜토리얼(코치마크)을 이미 봤는지 기기에 기록
 * - shouldShow: 저장소 확인이 끝났고 아직 안 본 경우에만 true
 * - markSeen: 끝까지 봤거나 건너뛰면 호출
 */
export const useCoachmarkSeen = (key: CoachmarkKey) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () => {
      getItem(`${KEY_PREFIX}${key}`)
        .then((value) => {
          if (active) setShouldShow(value !== 'true');
        })
        .catch(() => {
          // 저장소를 못 읽으면 튜토리얼 없이 진행
        });
    };
    load();
    listeners.add(load);
    return () => {
      active = false;
      listeners.delete(load);
    };
  }, [key]);

  const markSeen = useCallback(() => {
    setShouldShow(false);
    setItem(`${KEY_PREFIX}${key}`, 'true').catch(() => {});
  }, [key]);

  return { shouldShow, markSeen };
};
