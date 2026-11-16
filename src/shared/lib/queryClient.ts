import { QueryClient } from '@tanstack/react-query';

// 앱 전체에서 하나만 쓰는 서버 상태 캐시 (커뮤니티·알림·크레딧 등 TanStack Query 사용 화면)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
});
