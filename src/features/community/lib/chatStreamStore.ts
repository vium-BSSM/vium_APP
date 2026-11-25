import { create } from 'zustand';

// 실시간 스트림(SSE)이 붙어 있는 동안에는 채팅 목록·메시지 폴링을 끔
interface ChatStreamState {
  connected: boolean;
  setConnected: (value: boolean) => void;
}

export const useChatStreamStore = create<ChatStreamState>()((set) => ({
  connected: false,
  setConnected: (value) => set({ connected: value }),
}));
