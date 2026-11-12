import { useEffect, useState } from 'react';
import { recipeDetailCache } from './recipeDetailCache';
import { RecipeDetail } from '../types';

/**
 * 상세가 아직 보강 전(detailReady=false)이면 잠시 뒤 다시 요청
 * - 다른 요청이 보강 중이면 곧 끝나므로 짧게 다시 확인
 * - 보강이 실패하면 서버가 30초 쿨다운 뒤에 다시 시도하므로, 마지막 재시도는 쿨다운 이후로 잡음
 */
const RETRY_DELAYS_MS = [5 * 1000, 10 * 1000, 20 * 1000];

export const useRecipeDetail = (recipeId: number) => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(() => recipeDetailCache.peek(recipeId) ?? null);
  const [isLoading, setIsLoading] = useState(() => !recipeDetailCache.peek(recipeId));
  const [error, setError] = useState<string | null>(null);
  // 보강 전 상세를 다시 받는 중인지 — 재시도를 모두 쓰면 false
  const [isEnriching, setIsEnriching] = useState(false);
  const [prevRecipeId, setPrevRecipeId] = useState(recipeId);

  // 다른 레시피로 바뀌면 렌더 중에 캐시 기준으로 초기화 (캐시가 있으면 그대로 보여주고 뒤에서 새로 받음)
  if (recipeId !== prevRecipeId) {
    const cached = recipeDetailCache.peek(recipeId);
    setPrevRecipeId(recipeId);
    setRecipe(cached ?? null);
    setIsLoading(!cached);
    setError(null);
    setIsEnriching(false);
  }

  useEffect(() => {
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const cached = recipeDetailCache.peek(recipeId);
    if (cached && !recipeDetailCache.needsRefresh(recipeId)) return;

    const load = async (attempt: number) => {
      const result = await recipeDetailCache.load(recipeId);
      if (!active) return;

      if (result.status === 'error') {
        // 이미 보여주는 상세가 있으면 그대로 두고, 처음 불러오기 실패만 에러로 표시
        if (!cached && attempt === 0) setError(result.message);
        setIsEnriching(false);
        setIsLoading(false);
        return;
      }

      setRecipe(result.recipe);
      setIsLoading(false);

      const delay = RETRY_DELAYS_MS[attempt];
      if (!result.recipe.detailReady && delay != null) {
        setIsEnriching(true);
        retryTimer = setTimeout(() => load(attempt + 1), delay);
      } else {
        setIsEnriching(false);
      }
    };

    load(0);
    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [recipeId]);

  return { recipe, isLoading, error, isEnriching };
};
