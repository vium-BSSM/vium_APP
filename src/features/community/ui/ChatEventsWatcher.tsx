import { useChatEventStream } from '../lib/useChatEventStream';

/** 로그인 후 어느 화면에서든 실시간 채팅 이벤트(SSE)를 받아 채팅 데이터를 갱신 (화면에는 아무것도 그리지 않음) */
export const ChatEventsWatcher = () => {
  useChatEventStream();
  return null;
};
