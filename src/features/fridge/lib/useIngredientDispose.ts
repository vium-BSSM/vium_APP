import { useState } from 'react';
import { useIngredientStatusUpdate } from './useIngredientStatusUpdate';
import { FridgeItem } from '../types';

export interface DisposeFailure {
  title: string;
  message: string;
}

/**
 * 선택한 재료를 남은 수량 전부 폐기(disposed) 처리
 * 실패한 재료와 서버 사유를 반환
 */
export const useIngredientDispose = () => {
  const { updateStatus } = useIngredientStatusUpdate();
  const [isDisposing, setIsDisposing] = useState(false);

  const disposeItems = async (items: FridgeItem[]): Promise<DisposeFailure[]> => {
    const targets = items.filter((item) => item.remainingQuantity > 0);

    setIsDisposing(true);
    const results = await Promise.all(
      targets.map((item) =>
        updateStatus(item.id, {
          status: 'disposed',
          quantity: item.remainingQuantity,
          wasteQuantity: item.remainingQuantity,
        })
      )
    );
    setIsDisposing(false);

    return results.flatMap((result, index) =>
      result.ok ? [] : [{ title: targets[index].title, message: result.message }]
    );
  };

  return {
    disposeItems,
    isDisposing,
  };
};
