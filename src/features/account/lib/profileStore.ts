import { useSyncExternalStore } from 'react';
import { MyProfile } from '../types';
import { MY_PROFILE_FIXTURE } from './profileFixtures';

/**
 * 내 정보 API 연동 전까지 프로필 수정 내용을 앱 메모리에 보관합니다.
 * 앱을 다시 시작하면 임시 데이터로 초기화됩니다.
 */
let state: MyProfile = MY_PROFILE_FIXTURE;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

const updateProfile = (changes: Partial<MyProfile>) => {
  state = { ...state, ...changes };
  emit();
};

export const profileStore = {
  updateProfile,
  getState: () => state,
};

export const useProfileStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
