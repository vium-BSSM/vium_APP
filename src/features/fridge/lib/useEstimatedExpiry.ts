import { useEffect } from 'react';
import { estimateExpiry } from '../api/ingredientCatalogApi';
import { parseDateString, toDateString } from './dateUtils';

interface EstimatedExpiryOptions {
  ingredientCatalogId?: number;
  storageMethodId: number;
  purchasedOn: Date;
  /** 사용자가 소비기한을 직접 고쳤으면 더 덮어쓰지 않음 */
  enabled: boolean;
  onEstimate: (date: Date) => void;
}

/**
 * 카탈로그 재료·보관방법·구매일이 바뀔 때마다 소비기한 기본값을 채움 (GET /api/ingredients/estimate-expiry).
 * 규칙이 없거나 실패하면 기존 값을 그대로 둔다.
 */
export const useEstimatedExpiry = ({
  ingredientCatalogId,
  storageMethodId,
  purchasedOn,
  enabled,
  onEstimate,
}: EstimatedExpiryOptions) => {
  const purchasedOnKey = toDateString(purchasedOn);

  useEffect(() => {
    if (!enabled || ingredientCatalogId === undefined) return;
    let cancelled = false;

    // 서버는 미래 구매일을 받지 않음 — 그때는 생략해서 오늘 기준으로 추정
    const isFuture = purchasedOnKey > toDateString(new Date());

    estimateExpiry({
      ingredientCatalogId,
      storageMethodId,
      purchasedOn: isFuture ? undefined : purchasedOnKey,
    })
      .then((response) => {
        const date = response.data?.estimatedExpiryDate;
        if (!cancelled && response.success && date) onEstimate(parseDateString(date));
      })
      .catch((err) => console.warn('Failed to estimate expiry:', err));

    return () => {
      cancelled = true;
    };
    // onEstimate는 매 렌더 새로 만들어지므로 의존성에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ingredientCatalogId, storageMethodId, purchasedOnKey]);
};
