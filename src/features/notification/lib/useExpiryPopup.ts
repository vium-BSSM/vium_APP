import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import { unwrap } from '@/shared/api/types';
import { getItem, setItem } from '@/shared/lib/secureStorage';
import { getExpiryPopup } from '../api/notificationApi';
import { notificationKeys } from './useNotifications';

const HIDDEN_ON_KEY = 'expiryPopupHiddenOn';

const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

// 앱을 켠 동안 한 번 닫으면 다시 띄우지 않음 (화면을 오갈 때마다 뜨지 않도록)
const useDismissStore = create<{ dismissed: boolean }>()(() => ({ dismissed: false }));

/** 소비기한 임박 팝업 — '오늘은 그만 보기'를 누른 날에는 띄우지 않음 */
export const useExpiryPopup = () => {
  const dismissed = useDismissStore((state) => state.dismissed);
  const [hiddenToday, setHiddenToday] = useState<boolean | null>(null);

  useEffect(() => {
    getItem(HIDDEN_ON_KEY)
      .then((value) => setHiddenToday(value === todayKey()))
      .catch(() => setHiddenToday(false));
  }, []);

  const enabled = hiddenToday === false && !dismissed;
  const query = useQuery({
    queryKey: notificationKeys.expiryPopup,
    queryFn: async () => unwrap(await getExpiryPopup()).items,
    enabled,
  });

  const items = query.data ?? [];

  const close = () => useDismissStore.setState({ dismissed: true });
  const hideToday = async () => {
    close();
    await setItem(HIDDEN_ON_KEY, todayKey()).catch((err) => console.error('Failed to save popup state:', err));
  };

  return { visible: enabled && items.length > 0, items, close, hideToday };
};
