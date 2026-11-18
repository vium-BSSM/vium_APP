import { useCallback, useState } from 'react';

/**
 * 당겨서 새로고침 전용 상태 — 사용자가 직접 당겼을 때만 스피너를 켬.
 * 백그라운드 재조회(isRefetching)에 refreshing을 묶으면 iOS에서 스피너가 화면에 걸린 채 남음.
 */
export const usePullToRefresh = (refetch: () => Promise<unknown>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return { refreshing, onRefresh };
};
