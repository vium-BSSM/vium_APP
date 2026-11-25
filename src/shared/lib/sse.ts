// React Native에는 EventSource가 없어 XHR 스트리밍(readyState 3에서 responseText가 계속 늘어남)으로 SSE를 읽음
// 백엔드가 쿼리 파라미터 토큰을 받지 않으므로 Authorization 헤더를 직접 붙일 수 있는 방식이어야 함

export interface SseHandlers {
  onOpen?: () => void;
  onEvent: (event: string, data: string) => void;
  /** 연결이 끝남 (서버 종료·네트워크 오류·HTTP 오류 모두). status는 HTTP 상태 코드, 연결 실패면 0 */
  onClose: (status: number) => void;
}

export interface SseConnection {
  close: () => void;
}

// 응답 헤더가 이 시간 안에 오지 않으면 연결 실패로 처리 (요청이 멈춘 채 남지 않도록)
const CONNECT_TIMEOUT_MS = 15 * 1000;

export const connectSse = (url: string, headers: Record<string, string>, handlers: SseHandlers): SseConnection => {
  const xhr = new XMLHttpRequest();
  let cursor = 0;
  let buffer = '';
  let opened = false;
  let closed = false;
  let connectTimer: ReturnType<typeof setTimeout> | null = null;

  const clearConnectTimer = () => {
    if (connectTimer) clearTimeout(connectTimer);
    connectTimer = null;
  };

  const finish = (status: number) => {
    if (closed) return;
    closed = true;
    clearConnectTimer();
    handlers.onClose(status);
  };

  // 이벤트는 빈 줄로 구분, 각 줄은 "필드:값" (콜론 뒤 공백 하나는 무시)
  const dispatch = (block: string) => {
    let event = 'message';
    const data: string[] = [];
    for (const line of block.split(/\r?\n/)) {
      if (!line || line.startsWith(':')) continue;
      const colon = line.indexOf(':');
      const field = colon === -1 ? line : line.slice(0, colon);
      let value = colon === -1 ? '' : line.slice(colon + 1);
      if (value.startsWith(' ')) value = value.slice(1);
      if (field === 'event') event = value;
      else if (field === 'data') data.push(value);
    }
    if (data.length > 0) handlers.onEvent(event, data.join('\n'));
  };

  const readChunk = () => {
    const text = xhr.responseText ?? '';
    if (text.length <= cursor) return;
    buffer += text.slice(cursor);
    cursor = text.length;
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() ?? '';
    blocks.forEach(dispatch);
  };

  xhr.onreadystatechange = () => {
    if (closed) return;
    if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
      clearConnectTimer();
      if (xhr.status === 200 && !opened) {
        opened = true;
        handlers.onOpen?.();
      }
    } else if (xhr.readyState === XMLHttpRequest.LOADING) {
      if (xhr.status === 200) readChunk();
    } else if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) readChunk();
      finish(xhr.status);
    }
  };
  xhr.onerror = () => finish(0);

  xhr.open('GET', url);
  xhr.setRequestHeader('Accept', 'text/event-stream');
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
  xhr.send();

  connectTimer = setTimeout(() => {
    xhr.abort();
    finish(0);
  }, CONNECT_TIMEOUT_MS);

  return {
    close: () => {
      if (closed) return;
      closed = true;
      clearConnectTimer();
      xhr.abort();
    },
  };
};
