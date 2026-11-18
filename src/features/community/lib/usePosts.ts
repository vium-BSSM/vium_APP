import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { unwrap } from '@/shared/api/types';
import { Coordinates } from '@/shared/lib/useCurrentLocation';
import { deletePost, getPost, getPosts, likePost, unlikePost, updatePost } from '../api/postApi';
import { communityKeys } from './queryKeys';
import { FeedSort, FeedTypeFilter, PostDetail, PostDistance, PostSummary, UpdatePostRequest } from '../types';

interface FeedOptions {
  coords: Coordinates | null;
  distance: PostDistance;
  sort: FeedSort;
  type: FeedTypeFilter;
  keyword: string;
}

/** 나눔 피드 — 키워드 검색과 '소비기한 임박순'은 서버 기능이 없어 받아온 목록에서 처리 */
export const usePostFeed = ({ coords, distance, sort, type, keyword }: FeedOptions) => {
  // TODO: 서버 정렬에 소비기한 임박순(EXPIRING)이 없어 가까운순으로 받아 화면에서 다시 정렬 (BE 정렬 추가 시 교체)
  const serverSort = sort === 'EXPIRING' ? 'DISTANCE' : sort;
  const query = {
    latitude: coords?.latitude ?? 0,
    longitude: coords?.longitude ?? 0,
    distance,
    sort: serverSort,
    type: type === 'ALL' ? undefined : type,
  } as const;

  const result = useInfiniteQuery({
    queryKey: communityKeys.posts(query),
    queryFn: async ({ pageParam }) => unwrap(await getPosts(query, pageParam)),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined),
    enabled: coords !== null,
  });

  const posts = useMemo(() => {
    const all = result.data?.pages.flatMap((page) => page.posts) ?? [];
    const trimmed = keyword.trim();
    const filtered = trimmed
      ? all.filter((post) => post.title.includes(trimmed) || post.ingredientName.includes(trimmed))
      : all;
    if (sort !== 'EXPIRING') return filtered;
    return [...filtered].sort((a, b) => a.expiresOn.localeCompare(b.expiresOn));
  }, [result.data, keyword, sort]);

  return {
    posts,
    isLoading: result.isPending && coords !== null,
    error: result.error?.message ?? null,
    hasNextPage: result.hasNextPage,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    refetch: result.refetch,
    isRefetching: result.isRefetching,
  };
};

export const usePostDetail = (postId: number, coords: Coordinates | null) => {
  const query = useQuery({
    queryKey: communityKeys.post(postId),
    queryFn: async () => unwrap(await getPost(postId, coords)),
    enabled: Number.isFinite(postId),
  });
  return { post: query.data ?? null, isLoading: query.isPending, error: query.error?.message ?? null };
};

/** 좋아요 토글 — 누르는 즉시 화면에 반영하고 실패하면 되돌림 */
export const useToggleLike = (postId: number) => {
  const queryClient = useQueryClient();
  const key = communityKeys.post(postId);

  return useMutation({
    mutationFn: (liked: boolean) => (liked ? unlikePost(postId) : likePost(postId)).then((res) => unwrap(res)),
    onMutate: async (liked) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<PostDetail>(key);
      if (previous) {
        queryClient.setQueryData<PostDetail>(key, {
          ...previous,
          likedByMe: !liked,
          likeCount: previous.likeCount + (liked ? -1 : 1),
        });
      }
      return { previous };
    },
    onError: (_err, _liked, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSuccess: (result) => {
      queryClient.setQueryData<PostDetail>(key, (old) =>
        old ? { ...old, likedByMe: result.liked, likeCount: result.likeCount } : old
      );
      // 피드 카드의 좋아요 수도 맞춤
      queryClient.invalidateQueries({ queryKey: communityKeys.postsAll });
    },
  });
};

/** 내 게시물 수정 — 상세 캐시를 응답으로 바꾸고 피드를 새로 받음 */
export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: UpdatePostRequest) => unwrap(await updatePost(postId, request)),
    onSuccess: (post) => {
      queryClient.setQueryData(communityKeys.post(postId), post);
      queryClient.invalidateQueries({ queryKey: communityKeys.postsAll });
    },
  });
};

/** 내 게시물 삭제 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await deletePost(postId);
      if (!response.success) throw new Error(response.error?.message ?? '게시물을 삭제하지 못했어요.');
    },
    onSuccess: (_result, postId) => {
      queryClient.removeQueries({ queryKey: communityKeys.post(postId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.postsAll });
    },
  });
};

export type { PostSummary };
