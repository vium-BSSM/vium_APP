import React from 'react';
import { Text, View } from 'react-native';
import { BADGE_LABEL } from '../lib/communityFormat';
import { BadgeKind } from '../types';

const BADGE_CLASS: Record<BadgeKind, { box: string; text: string }> = {
  requested: { box: 'bg-status-normal-bg', text: 'text-status-normal-text' },
  reserved: { box: 'bg-status-good-bg', text: 'text-status-good-text' },
  completed: { box: 'bg-neutral-10', text: 'text-text-200' },
  rejected: { box: 'bg-status-danger-bg', text: 'text-status-danger-text' },
  canceled: { box: 'bg-neutral-10', text: 'text-text-300' },
  expired: { box: 'bg-neutral-10', text: 'text-text-300' },
  share: { box: 'bg-primary-200', text: 'text-primary-800' },
  sale: { box: 'bg-secondary-200', text: 'text-secondary-700' },
};

/** Figma badge — 거래 status · 게시물 type/status */
// sm: 목록·카드(11px), md: 채팅방 상단 게시물 띠(12px)
export const CommunityBadge: React.FC<{ kind: BadgeKind; size?: 'sm' | 'md' }> = ({ kind, size = 'sm' }) => {
  const { box, text } = BADGE_CLASS[kind];
  return (
    <View className={`px-2 py-[3px] rounded ${box}`}>
      <Text className={`${size === 'md' ? 'text-text12' : 'text-text11'} font-medium font-sans ${text}`}>{BADGE_LABEL[kind]}</Text>
    </View>
  );
};
