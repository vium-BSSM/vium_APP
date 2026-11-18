import React from 'react';
import { useRouter } from 'expo-router';
import { useExpiryPopup } from '../lib/useExpiryPopup';
import { ExpiryPopupModal } from './ExpiryPopupModal';

/** 냉장고 화면에 올리는 소비기한 임박 팝업 (데이터 조회·닫기 상태까지 포함) */
export const ExpiryPopup = () => {
  const router = useRouter();
  const { visible, items, close, hideToday } = useExpiryPopup();

  return (
    <ExpiryPopupModal
      visible={visible}
      items={items}
      onClose={close}
      onHideToday={hideToday}
      onShare={(item) => {
        close();
        router.navigate({ pathname: '/community/write', params: { inventoryItemId: item.inventoryItemId } } as any);
      }}
      onSeeRecipes={() => {
        close();
        router.navigate('/recipe' as any);
      }}
    />
  );
};
