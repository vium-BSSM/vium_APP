import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { formatDday, formatDistance, getDaysLeft } from '@/shared/lib/dateFormat';
import HeartIcon from '@/../assets/icons/heart-icon.svg';
import { formatPrice, postStatusBadge, postTypeBadge } from '../lib/communityFormat';
import { PostSummary } from '../types';
import { CommunityBadge } from './CommunityBadge';

interface PostCardProps {
  post: PostSummary;
  onPress: () => void;
}

/** Figma post-card — 제목·배지·거리/소비기한·가격·좋아요 */
export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  const statusBadge = postStatusBadge(post.status);
  // TODO: 목록 응답에 보관 방법이 없어 '냉장' 등은 생략 (상세에서만 표시)
  const meta = `${formatDistance(post.distanceMeters)} · 소비기한 ${formatDday(getDaysLeft(post.expiresOn))}`;

  return (
    <Pressable onPress={onPress} className="py-[14px] border-b border-neutral-50 gap-2.5 bg-white">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1.5">
          <View className="flex-row items-center gap-1.5">
            <Text className="shrink text-text16 font-sans text-text-100" numberOfLines={1}>
              {post.title}
            </Text>
            <CommunityBadge kind={postTypeBadge(post.type)} />
            {statusBadge && <CommunityBadge kind={statusBadge} />}
          </View>
          <Text className="text-text12 font-sans text-text-200">{meta}</Text>
        </View>
        <Text className="text-text16 font-sans text-text-100">{formatPrice(post.price, post.type)}</Text>
      </View>
      <View className="flex-row items-center gap-[3px]">
        <HeartIcon width={16} height={16} color="#A7A9B5" />
        <Text className="text-text12 font-sans text-text-300">{post.likeCount}</Text>
      </View>
    </Pressable>
  );
};
