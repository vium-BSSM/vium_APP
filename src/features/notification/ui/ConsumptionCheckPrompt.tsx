import React from 'react';
import { usePathname } from 'expo-router';
import { Alert } from '@/shared/lib/alert';
import { ConsumptionAnswer, useConsumptionCheck } from '../lib/useConsumptionCheck';
import { ConsumptionCheckItem } from '../types';
import { ConsumptionCheckSheet } from './ConsumptionCheckSheet';

const formatDday = (expiresOn: string) => {
  const [year, month, day] = expiresOn.split('-').map(Number);
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((new Date(year, month - 1, day).getTime() - base.getTime()) / 86_400_000);
  if (days === 0) return '소비기한 D-Day';
  return days < 0 ? `소비기한 D+${-days}` : `소비기한 D-${days}`;
};

// 예: '1모 남음 · 소비기한 D-Day'
const describe = (item: ConsumptionCheckItem) =>
  `${item.remainingQuantity}${item.unit} 남음 · ${formatDday(item.expiresOn)}`;

// 냉장고 화면은 소비기한 임박 팝업이 따로 떠서 홈에서만 자동으로 띄움
const AUTO_OPEN_PATH = '/main';

/**
 * 소진 확인 시트 — (tabs) 레이아웃에 한 번만 올림.
 * 홈에 들어오면 대상이 있을 때 자동으로 뜨고, 알림 화면에서 consume_check 알림을 누르면 열린다.
 */
export const ConsumptionCheckPrompt = () => {
  const pathname = usePathname();
  const { visible, current, isSubmitting, answer, close } = useConsumptionCheck({
    autoOpen: pathname === AUTO_OPEN_PATH,
  });

  if (!current) return null;

  const handleAnswer = async (value: ConsumptionAnswer) => {
    const message = await answer(value);
    if (message) Alert.alert('처리 실패', message);
  };

  return (
    <ConsumptionCheckSheet
      visible={visible}
      ingredientName={current.name}
      description={describe(current)}
      onClose={close}
      onRemaining={() => handleAnswer('kept')}
      onConsumed={() => handleAnswer('consumed')}
      onDisposed={() => handleAnswer('disposed')}
      isSubmitting={isSubmitting}
    />
  );
};
