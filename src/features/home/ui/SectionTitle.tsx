import React from 'react';
import { Text, Pressable } from 'react-native';
import ChevronRightIcon from '@/../assets/icons/chevron-right-icon.svg';

interface SectionTitleProps {
  title: string;
  onPress: () => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, onPress }) => (
  <Pressable onPress={onPress} hitSlop={8} className="w-full flex-row items-center justify-between">
    <Text className="text-text-100 text-text15 font-sans">{title}</Text>
    <ChevronRightIcon width={9} height={14} color="#A1A1A1" />
  </Pressable>
);
