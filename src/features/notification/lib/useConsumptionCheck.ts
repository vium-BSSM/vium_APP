import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { getErrorMessage, unwrap } from '@/shared/api/types';
import { notifyInventoryChanged } from '@/shared/lib/inventoryEvents';
import { getConsumptionCheck, keepConsumptionCheckItem, updateConsumptionStatus } from '../api/notificationApi';
import { notificationKeys } from './useNotifications';
import { ConsumptionCheckItem } from '../types';

// 시트를 닫으면 앱을 켠 동안 자동으로는 다시 띄우지 않음 (알림을 눌러 열면 다시 뜸)
interface ConsumptionCheckState {
  open: boolean;
  dismissed: boolean;
}

const useConsumptionCheckStore = create<ConsumptionCheckState>()(() => ({ open: false, dismissed: false }));

/** 알림 화면 등에서 소진 확인 시트를 직접 열 때 */
export const openConsumptionCheck = () => useConsumptionCheckStore.setState({ open: true, dismissed: false });

export type ConsumptionAnswer = 'consumed' | 'kept' | 'disposed';

/**
 * 소진 확인 '이거 다 드셨어요?'
 * - 예 → PATCH /api/me/ingredients/{id}/status {status:'consumed', quantity: remainingQuantity}
 * - 아니요 → POST /api/me/notifications/consumption-check/{id}/keep
 * - 사실 버렸어요 → 같은 status API에 {status:'disposed', quantity: remainingQuantity} (남은 양 전부 폐기)
 * 대상 재고의 consume_check 알림은 서버가 읽음 처리한다.
 */
export const useConsumptionCheck = ({ autoOpen }: { autoOpen: boolean }) => {
  const queryClient = useQueryClient();
  const { open, dismissed } = useConsumptionCheckStore();
  // 응답 후 목록을 다시 받기 전에도 바로 다음 재료로 넘어가도록 답한 재고를 기억
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);

  const query = useQuery({
    queryKey: notificationKeys.consumptionCheck,
    queryFn: async () => unwrap(await getConsumptionCheck()).items,
  });

  const queue = (query.data ?? []).filter((item) => !answeredIds.includes(item.inventoryItemId));
  const current: ConsumptionCheckItem | null = queue[0] ?? null;

  const mutation = useMutation({
    mutationFn: async ({ item, answer }: { item: ConsumptionCheckItem; answer: ConsumptionAnswer }) => {
      if (answer === 'kept') {
        unwrap(await keepConsumptionCheckItem(item.inventoryItemId));
        return;
      }
      unwrap(await updateConsumptionStatus(item.inventoryItemId, { status: answer, quantity: item.remainingQuantity }));
      // 레시피 추천 캐시 등 재고 기반 데이터 갱신
      notifyInventoryChanged();
    },
    onSuccess: (_result, { item }) => setAnsweredIds((ids) => [...ids, item.inventoryItemId]),
    // 알림 읽음 상태·팝업 대상도 함께 바뀜
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });

  const visible = current !== null && (open || (autoOpen && !dismissed));

  const close = () => useConsumptionCheckStore.setState({ open: false, dismissed: true });

  /** 실패하면 사용자에게 보여줄 메시지, 성공이면 null */
  const answer = async (value: ConsumptionAnswer): Promise<string | null> => {
    if (!current) return null;
    try {
      await mutation.mutateAsync({ item: current, answer: value });
      // 마지막 재료였으면 시트를 닫음
      if (queue.length <= 1) close();
      return null;
    } catch (err) {
      return getErrorMessage(err, '처리하지 못했어요.');
    }
  };

  return {
    visible,
    current,
    remainingCount: queue.length,
    isSubmitting: mutation.isPending,
    answer,
    close,
  };
};
