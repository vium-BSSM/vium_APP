import { useSyncExternalStore } from 'react';
import { createStore } from './createStore';
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

const store = createStore<SessionState>({ user: null, isReady: false });
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
      store.setState({ user, isReady: true });
    }
  }
};

const subscribe = (listener: () => void) => {
  const unsubscribe = store.subscribe(listener);
  if (!hasLoaded) {
    hasLoaded = true;
    load();
  }
  return unsubscribe;
};

const replaceUser = (user: SessionUser | null) => {
  version += 1;
  hasLoaded = true;
  store.setState({ user, isReady: true });
};

const getUser = () => store.getState().user;
const getIsReady = () => store.getState().isReady;

export const sessionUserStore = {
  getState: getUser,
  subscribe,
  set: async (user: SessionUser) => {
    replaceUser(user);
    await setItem(SESSION_USER_KEY, JSON.stringify(user));
  },
  clear: async () => {
    replaceUser(null);
    await removeItem(SESSION_USER_KEY);
  },
};

export const useSessionUser = () => useSyncExternalStore(subscribe, getUser, getUser);

export const useIsSessionReady = () => useSyncExternalStore(subscribe, getIsReady, getIsReady);
