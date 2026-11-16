import React from 'react';
import { Pressable, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  // md: 정렬·읽음 필터, sm: 크레딧 내역 필터
  size?: 'md' | 'sm';
}

/** 필터용 알약 버튼 — 선택 시 연두(primary-300) 배경 */
export const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress, size = 'md' }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    className={`rounded-2xl ${size === 'md' ? 'px-[14px] py-1.5' : 'px-3 py-[5px]'} ${
      selected ? 'bg-primary-300' : 'bg-neutral-10'
    }`}
  >
    <Text className={`text-text14 font-sans ${selected ? 'text-text-100' : 'text-text-200'}`}>{label}</Text>
  </Pressable>
);
