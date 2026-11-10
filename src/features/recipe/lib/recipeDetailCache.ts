import { isAxiosError } from 'axios';
import { onInventoryChanged } from '@/features/fridge';
import { sessionUserStore } from '@/shared/lib/sessionUser';
import { getRecipeDetail } from '../api/recipesApi';
import { mapRecipeDetail } from './recipeMapper';
import { RecipeDetail } from '../types';

/**
 * 레시피 상세 요청 캐시
 * 상세를 처음 열면 서버가 AI로 분량·양념·단계를 보강(수 초 소요)하므로, 같은 레시피를 다시 열 때 요청하지 않도록 함
 * - 보강이 끝난(detailReady) 상세만 캐시 — 덜 된 상세는 다음 요청에서 다시 받아야 하므로 저장하지 않음
 * - 같은 레시피 요청이 겹치면 하나만 보냄 (서버에서 중복 요청은 보강을 건너뛰고 기본 생성분을 돌려줌)
 */
const TTL_MS = 30 * 60 * 1000;

export type RecipeDetailResult =
  | { status: 'success'; recipe: RecipeDetail }
  | { status: 'error'; message: string };

interface CacheEntry {
  recipe: RecipeDetail;
  fetchedAt: number;
  // 재고가 바뀌어 재료의 inventoryId(요리 완료 차감 대상)가 달라졌을 수 있음 — 보여주되 새로 받아야 함
  stale: boolean;
}

const cache = new Map<number, CacheEntry>();
const inFlight = new Map<number, Promise<RecipeDetailResult>>();
// 계정이 바뀔 때마다 증가 — 이전 계정으로 시작된 요청 결과는 저장하지 않음
let generation = 0;

const toErrorMessage = (err: unknown) => {
  if (!isAxiosError(err) || !err.response) return '서버와 연결할 수 없습니다.';
  return err.response.data?.error?.message || '레시피를 불러오지 못했어요.';
};

const request = async (recipeId: number): Promise<RecipeDetailResult> => {
  try {
    const response = await getRecipeDetail(recipeId);
    if (response.success && response.data) {
      return { status: 'success', recipe: mapRecipeDetail(response.data) };
    }
    return { status: 'error', message: response.error?.message || '레시피를 불러오지 못했어요.' };
  } catch (err) {
    console.error('Failed to load recipe detail:', err);
    return { status: 'error', message: toErrorMessage(err) };
  }
};

const isFresh = (entry: CacheEntry) => !entry.stale && Date.now() - entry.fetchedAt < TTL_MS;

export const recipeDetailCache = {
  // 화면에 바로 보여줄 값 — 오래됐더라도 보여주고, needsRefresh로 새로 받을지 판단
  peek: (recipeId: number) => cache.get(recipeId)?.recipe,

  needsRefresh: (recipeId: number) => {
    const entry = cache.get(recipeId);
    return !entry || !isFresh(entry);
  },

  load: (recipeId: number): Promise<RecipeDetailResult> => {
    const pending = inFlight.get(recipeId);
    if (pending) return pending;

    const requestGeneration = generation;
    const promise = request(recipeId)
      .then((result) => {
        if (
          requestGeneration === generation &&
          result.status === 'success' &&
          result.recipe.detailReady
        ) {
          cache.set(recipeId, { recipe: result.recipe, fetchedAt: Date.now(), stale: false });
        }
        return result;
      })
      .finally(() => {
        if (inFlight.get(recipeId) === promise) inFlight.delete(recipeId);
      });
    inFlight.set(recipeId, promise);
    return promise;
  },

  // 재고가 바뀌면 inventoryId 매칭이 달라짐 — 내용(AI 보강분)은 그대로라 지우지 않고 새로 받도록만 표시
  markStale: () => {
    cache.forEach((entry) => {
      entry.stale = true;
    });
  },

  clear: () => {
    generation += 1;
    cache.clear();
    inFlight.clear();
  },
};

onInventoryChanged(recipeDetailCache.markStale);

// 상세의 inventoryId는 계정별 데이터 — 로그아웃·계정 전환 시 비움
let lastUserId = sessionUserStore.getState()?.id ?? null;
sessionUserStore.subscribe(() => {
  const userId = sessionUserStore.getState()?.id ?? null;
  if (userId === lastUserId) return;
  lastUserId = userId;
  recipeDetailCache.clear();
});
