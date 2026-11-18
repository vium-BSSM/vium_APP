import { create } from 'zustand';

// 헤더 종 아이콘의 빨간 점 — 값은 notification 기능이 채움 (shared는 features를 모르므로 상태만 둠)
interface HeaderBadgeState {
  hasUnreadNotifications: boolean;
  setHasUnreadNotifications: (value: boolean) => void;
}

export const useHeaderBadgeStore = create<HeaderBadgeState>()((set) => ({
  hasUnreadNotifications: false,
  setHasUnreadNotifications: (value) => set({ hasUnreadNotifications: value }),
}));
