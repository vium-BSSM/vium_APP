import { useEffect } from 'react';
import { create } from 'zustand';
import { getItem, removeItem, setItem } from './secureStorage';


export interface SessionUser {
  id: number;
  email: string;
  displayName: string;
}

interface SessionState {
  user: SessionUser | null;
  isReady: boolean;
}

const SESSION_USER_KEY = 'sessionUser';

// persist 미들웨어 대신 직접 복원: 복원 중에 로그인·로그아웃이 먼저 일어나면 복원 결과로 덮어쓰지 않도록 version으로 구분
const useSessionStore = create<SessionState>()(() => ({ user: null, isReady: false }));
let hasLoaded = false;
let version = 0;

const load = async () => {
  const loadVersion = version;
  let user: SessionUser | null = null;
  try {
    const raw = await getItem(SESSION_USER_KEY);
    user = raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch (err) {
    console.error('Failed to load session user:', err);
  } finally {
    if (loadVersion === version) {
      useSessionStore.setState({ user, isReady: true });
    }
  }
};

// 처음 구독할 때 한 번만 저장소에서 읽음 (모듈을 불러오는 시점에는 읽지 않음)
const ensureLoaded = () => {
  if (hasLoaded) return;
  hasLoaded = true;
  load();
};

const replaceUser = (user: SessionUser | null) => {
  version += 1;
  hasLoaded = true;
  useSessionStore.setState({ user, isReady: true });
};

export const sessionUserStore = {
  getState: () => useSessionStore.getState().user,
  subscribe: (listener: () => void) => {
    ensureLoaded();
    return useSessionStore.subscribe(listener);
  },
  set: async (user: SessionUser) => {
    replaceUser(user);
    await setItem(SESSION_USER_KEY, JSON.stringify(user));
  },
  clear: async () => {
    replaceUser(null);
    await removeItem(SESSION_USER_KEY);
  },
};

export const useSessionUser = () => {
  useEffect(ensureLoaded, []);
  return useSessionStore((state) => state.user);
};

export const useIsSessionReady = () => {
  useEffect(ensureLoaded, []);
  return useSessionStore((state) => state.isReady);
};
