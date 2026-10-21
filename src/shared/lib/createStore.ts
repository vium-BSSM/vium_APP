import { useSyncExternalStore } from 'react';

/**
 * 화면 간에 공유하는 모듈 단위 상태 (React 밖에서도 읽고 쓸 수 있음)
 * setState는 항상 새 객체로 교체해야 구독 중인 컴포넌트가 다시 그려짐
 */
export const createStore = <T>(initialState: T) => {
  let state = initialState;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (next: T) => {
    state = next;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const useStore = () => useSyncExternalStore(subscribe, getState, getState);

  return { getState, setState, subscribe, useStore };
};
