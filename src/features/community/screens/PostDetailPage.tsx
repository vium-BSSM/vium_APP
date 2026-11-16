import React, { useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, PillButton } from '@/shared/ui';
import { Alert } from '@/shared/lib/alert';
import { formatDday, formatDistance, formatDotDate, formatRelativeTime, getDaysLeft } from '@/shared/lib/dateFormat';
import BackIcon from '@/../assets/icons/back-icon.svg';
import HeartIcon from '@/../assets/icons/heart-icon.svg';
import StarIcon from '@/../assets/icons/star-icon.svg';
import { formatPrice, postStatusBadge, postTypeBadge } from '../lib/communityFormat';
import { CommunityBadge } from '../ui/CommunityBadge';
import { PostDetail } from '../types';
import { getMockPostDetail } from '../lib/mockData';

const IMAGE_HEIGHT = 320;

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View className="flex-row">
    <Text className="flex-1 text-text14 font-sans text-text-200">{label}</Text>
    <Text className="text-text14 font-medium font-sans text-text-100">{value}</Text>
  </View>
);

export const PostDetailPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  // TODO(API): GET /api/posts/{postId} 연결 (feature/community-api 브랜치)
  const [post, setPost] = useState<PostDetail | null>(() => getMockPostDetail(postId));
  const [imageIndex, setImageIndex] = useState(0);

  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/community' as any));

  if (!post) {
    return (
      <View className="flex-1 bg-white items-center justify-center gap-4">
        <Text className="text-text14 font-sans text-text-300">게시물을 찾을 수 없어요 (postId {postId})</Text>
        <Pressable onPress={handleBack}>
          <Text className="text-text14 font-sans text-primary-700">돌아가기</Text>
        </Pressable>
      </View>
    );
  }

  const { ingredient, author } = post;
  const daysLeft = getDaysLeft(ingredient.expiresOn);
  const statusBadge = postStatusBadge(post.status);
  const meta = [
    post.distanceMeters != null ? formatDistance(post.distanceMeters) : null,
    formatRelativeTime(post.createdAt),
    `좋아요 ${post.likeCount}`,
  ]
    .filter(Boolean)
    .join(' · ');
  const canRequest = !post.isMine && post.status === 'OPEN' && post.activeTradeId === null;

  // TODO(API): POST /api/posts/{postId}/chat-rooms 후 채팅방으로 이동
  const goToChat = () => router.push('/community/chat' as any);

  // TODO(API): POST /api/posts/{postId}/trades
  const handleRequestTrade = () => {
    const message =
      post.type === 'SALE'
        ? `요청하면 ${post.price} 크레딧이 보류되고, 거래가 끝나면 판매자에게 전달돼요.`
        : '작성자에게 나눔을 요청할까요?';
    Alert.alert('거래 요청', message, [
      { text: '취소', style: 'cancel' },
      { text: '요청하기', onPress: goToChat },
    ]);
  };

  // TODO(API): PUT/DELETE /api/posts/{postId}/like — 지금은 화면에서만 토글
  const toggleLike = () =>
    setPost({ ...post, likedByMe: !post.likedByMe, likeCount: post.likeCount + (post.likedByMe ? -1 : 1) });

  const handleImageScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    setImageIndex(Math.round(event.nativeEvent.contentOffset.x / width));

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-[120px]">
        <View className="bg-neutral-10" style={{ height: IMAGE_HEIGHT + insets.top }}>
          {post.images.length > 0 ? (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handleImageScroll}>
              {post.images.map((image) => (
                <Image
                  key={image.imageId}
                  source={{ uri: image.url }}
                  contentFit="cover"
                  style={{ width, height: IMAGE_HEIGHT + insets.top }}
                />
              ))}
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center" style={{ paddingTop: insets.top }}>
              <Text className="text-text28 font-medium font-sans text-text-300">{ingredient.name}</Text>
            </View>
          )}

          <Pressable
            onPress={handleBack}
            hitSlop={10}
            className="absolute left-[14px]"
            style={{ top: insets.top + 4 }}
            accessibilityLabel="뒤로 가기"
          >
            <BackIcon width={28} height={28} color="#242529" />
          </Pressable>

          {post.images.length > 1 && (
            <View className="absolute bottom-[18px] left-0 right-0 flex-row justify-center gap-1.5">
              {post.images.map((image, index) => (
                <View
                  key={image.imageId}
                  className={`w-1.5 h-1.5 rounded-full ${index === imageIndex ? 'bg-white' : 'bg-neutral-50'}`}
                />
              ))}
            </View>
          )}
        </View>

        <View className="px-screen md:px-10 lg:px-20 pt-4 gap-6">
          <View className="flex-row items-center gap-2.5">
            <Avatar uri={author.profileImageUrl} size={40} />
            <View className="flex-1">
              <Text className="text-text16 font-medium font-sans text-text-100">{author.displayName}</Text>
              <Text className="text-text12 font-sans text-text-300">후기 {author.reviewCount}개</Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-1">
                <StarIcon width={16} height={16} color="#FDCF73" />
                <Text className="text-text16 font-bold font-sans text-text-100">
                  {author.mannerScore != null ? author.mannerScore.toFixed(1) : '-'}
                </Text>
              </View>
              <Text className="text-text12 font-sans text-text-300">매너 점수</Text>
            </View>
          </View>

          <View className="h-px bg-neutral-50" />

          <View className="gap-6">
            <View className="gap-[14px]">
              <View className="gap-1.5">
                <View className="flex-row items-center gap-2.5">
                  <CommunityBadge kind={postTypeBadge(post.type)} />
                  {statusBadge && <CommunityBadge kind={statusBadge} />}
                  <Text className="shrink text-heading-md font-medium font-sans text-text-100">{post.title}</Text>
                </View>
                <Text className="text-text12 font-sans text-text-300">{meta}</Text>
              </View>
              {post.description ? (
                <Text className="text-text15 font-sans text-text-100">{post.description}</Text>
              ) : null}
            </View>

            <View className="bg-primary-100 rounded-lg px-4 py-[14px] gap-2.5">
              {/* TODO: categoryName이 영문 코드(dairy 등)로 오면 한글 이름 매핑 필요 */}
              <InfoRow
                label="품목"
                value={ingredient.categoryName ? `${ingredient.name} · ${ingredient.categoryName}` : ingredient.name}
              />
              <InfoRow label="수량" value={`${ingredient.quantity}${ingredient.unit}`} />
              <InfoRow label="소비기한" value={`${formatDotDate(ingredient.expiresOn)} (${formatDday(daysLeft)})`} />
              <InfoRow label="보관 방법" value={ingredient.storageMethodName} />
              <InfoRow label="개봉 여부" value={ingredient.isOpened ? '개봉' : '미개봉'} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-50 flex-row items-center gap-3 px-screen md:px-10 lg:px-20 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <Pressable
          onPress={toggleLike}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={post.likedByMe ? '좋아요 취소' : '좋아요'}
          accessibilityState={{ selected: post.likedByMe }}
        >
          <HeartIcon width={26} height={26} color={post.likedByMe ? '#FF7171' : '#767676'} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-text18 font-sans text-text-100">{formatPrice(post.price, post.type)}</Text>
          <Text className="text-text12 font-sans text-text-300">{post.type === 'SALE' ? '판매가' : '나눔'}</Text>
        </View>
        {post.isMine ? (
          // TODO: 내 게시물 수정·삭제(PATCH/DELETE /api/me/posts/{postId}) 화면 디자인 필요
          <PillButton label="거래 내역" size="xs" onPress={() => router.push('/community/trades' as any)} className="w-[104px]" />
        ) : (
          <View className="flex-row gap-3">
            <PillButton
              label="채팅하기"
              variant="secondary"
              size="xs"
              onPress={goToChat}
              className="w-[96px]"
            />
            <PillButton
              label={canRequest ? '거래 요청' : post.activeTradeId !== null ? '요청 중' : '거래 불가'}
              size="xs"
              onPress={handleRequestTrade}
              disabled={!canRequest}
              className="w-[104px]"
            />
          </View>
        )}
      </View>
    </View>
  );
};
