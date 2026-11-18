import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppTextInput, Chip, HeaderActions, UnderlineTabs } from '@/shared/ui';
import { usePullToRefresh } from '@/shared/lib/usePullToRefresh';
import { useMyProfile } from '@/features/account';
import { useCurrentLocation } from '@/shared/lib/useCurrentLocation';
import { formatDistance } from '@/shared/lib/dateFormat';
import ChevronDownIcon from '@/../assets/icons/chevron-down-icon.svg';
import SearchIcon from '@/../assets/icons/search-icon.svg';
import ChatBubbleIcon from '@/../assets/icons/chat-bubble-icon.svg';
import PlusLineIcon from '@/../assets/icons/plus-line-icon.svg';
import { usePostFeed } from '../lib/usePosts';
import { PostCard } from '../ui/PostCard';
import { PopoverAnchor, PopoverMenu } from '../ui/PopoverMenu';
import { FeedSort, FeedTypeFilter, PostDistance } from '../types';

const TYPE_TABS: { key: FeedTypeFilter; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'SHARE', label: '나눔' },
  { key: 'SALE', label: '판매' },
];

const SORT_OPTIONS: { key: FeedSort; label: string }[] = [
  { key: 'DISTANCE', label: '가까운순' },
  { key: 'LATEST', label: '최신순' },
  { key: 'EXPIRING', label: '소비기한 임박순' },
];

const DISTANCE_OPTIONS: PostDistance[] = [1000, 3000, 5000, 10000];

// 하단 탭 위로 띄우는 글쓰기 버튼 (Figma: 탭바 위 19px, 오른쪽 22px)
const NAV_BAR_HEIGHT = 59;
const FAB_GAP = 19;

export const CommunityFeedPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useMyProfile();
  const { coords, error: locationError, refetch: retryLocation } = useCurrentLocation();
  const [distance, setDistance] = useState<PostDistance>(1000);
  const [sort, setSort] = useState<FeedSort>('DISTANCE');
  const [type, setType] = useState<FeedTypeFilter>('ALL');
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const feed = usePostFeed({ coords, distance, sort, type, keyword });
  const pull = usePullToRefresh(feed.refetch);

  const distanceButtonRef = useRef<View>(null);
  const [distanceAnchor, setDistanceAnchor] = useState<PopoverAnchor | null>(null);

  const openDistanceMenu = () =>
    distanceButtonRef.current?.measureInWindow((x, y, width, height) => setDistanceAnchor({ x, y, width, height }));

  const distanceItems = DISTANCE_OPTIONS.map((option) => ({
    label: `내 주변 ${formatDistance(option)}`,
    onPress: () => {
      setDistanceAnchor(null);
      setDistance(option);
    },
  }));

  const emptyMessage = locationError
    ? locationError
    : feed.error
      ? feed.error
      : keyword
        ? '검색 결과가 없어요'
        : '주변에 올라온 글이 없어요';

  return (
    <View className="flex-1 bg-white">
      {/* 홈 헤더와 같은 간격: 로고 헤더 아래 34px */}
      <View className="mb-[34px]">
        <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      </View>

      <View className="flex-row items-center px-screen md:px-10 lg:px-20 pb-2.5">
        {/* 드롭다운이 글자 바로 아래 왼쪽 끝에 붙도록 버튼은 내용 너비만 차지 */}
        <View className="flex-1 flex-row">
          <Pressable
            ref={distanceButtonRef}
            onPress={openDistanceMenu}
            className="flex-row items-center gap-1"
            hitSlop={6}
            accessibilityLabel="검색 반경 선택"
          >
            <Text className="text-text22 font-medium font-sans text-text-100">내 주변 {formatDistance(distance)}</Text>
            <ChevronDownIcon width={20} height={20} color="#242529" />
          </Pressable>
        </View>
        <View className="flex-row gap-4">
          <Pressable onPress={() => setIsSearching((prev) => !prev)} hitSlop={8} accessibilityLabel="검색">
            <SearchIcon width={24} height={24} color="#242529" />
          </Pressable>
          <Pressable onPress={() => router.push('/community/chat' as any)} hitSlop={8} accessibilityLabel="채팅">
            <ChatBubbleIcon width={24} height={24} color="#242529" />
          </Pressable>
        </View>
      </View>

      {isSearching && (
        <View className="px-screen md:px-10 lg:px-20 pb-2.5">
          <AppTextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="재료나 제목으로 검색"
            placeholderTextColor="#A7A9B5"
            autoFocus
            className="h-10 px-[14px] rounded-lg bg-neutral-10 text-text15 font-sans text-text-100"
          />
        </View>
      )}

      <UnderlineTabs options={TYPE_TABS} value={type} onChange={setType} bordered />

      <FlatList
        data={feed.posts}
        keyExtractor={(post) => String(post.postId)}
        renderItem={({ item }) => (
          <View className="px-screen md:px-10 lg:px-20">
            <PostCard post={item} onPress={() => router.push(`/community/${item.postId}` as any)} />
          </View>
        )}
        ListHeaderComponent={
          <View className="flex-row gap-2 px-5 pt-9 pb-[26px]">
            {SORT_OPTIONS.map((option) => (
              <Chip key={option.key} label={option.label} selected={sort === option.key} onPress={() => setSort(option.key)} />
            ))}
          </View>
        }
        ListEmptyComponent={
          feed.isLoading || (!coords && !locationError) ? (
            <ActivityIndicator className="mt-10" color="#A2CD87" />
          ) : (
            <View className="items-center mt-10 gap-3">
              <Text className="text-text14 font-sans text-text-300 text-center px-screen">{emptyMessage}</Text>
              {locationError && (
                <Pressable onPress={() => retryLocation()}>
                  <Text className="text-text14 font-sans text-primary-700">다시 시도</Text>
                </Pressable>
              )}
            </View>
          )
        }
        onEndReached={() => feed.hasNextPage && !feed.isFetchingNextPage && feed.fetchNextPage()}
        onEndReachedThreshold={0.5}
        onRefresh={pull.onRefresh}
        refreshing={pull.refreshing}
        contentContainerClassName="pb-[140px]"
      />

      <Pressable
        onPress={() => router.push('/community/write' as any)}
        className="absolute right-[22px] flex-row items-center gap-1.5 pl-[18px] pr-5 py-3 rounded-3xl bg-neutral-500"
        style={{ bottom: insets.bottom + NAV_BAR_HEIGHT + FAB_GAP }}
        accessibilityRole="button"
      >
        <PlusLineIcon width={18} height={18} color="#FFFFFF" />
        <Text className="text-text15 font-sans text-white">글쓰기</Text>
      </Pressable>
      <PopoverMenu anchor={distanceAnchor} items={distanceItems} onClose={() => setDistanceAnchor(null)} align="left" />
    </View>
  );
};
