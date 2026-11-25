/**
 * 냉장고 재고가 바뀌었음을 알리는 신호 (등록·수정·소진·폐기 성공 시)
 * 재고를 기반으로 한 데이터(예: 레시피 추천 캐시)가 구독해서 무효화
 */
const listeners = new Set<() => void>();

export const notifyInventoryChanged = () => listeners.forEach((listener) => listener());

export const onInventoryChanged = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
