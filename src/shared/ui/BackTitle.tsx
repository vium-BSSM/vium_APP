import React from 'react';
import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import BackIcon from '@/../assets/icons/back-icon.svg';

interface BackTitleProps {
  title: string;
  onPress?: () => void;
  className?: string;
  style?: any;
}

export const BackTitle: React.FC<BackTitleProps> = ({ title, onPress, className = '', style }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      hitSlop={8}
      className={`flex-row items-center gap-2 self-start ${className}`}
      style={style}
    >
      <BackIcon width={30} height={30} color="#242529" />
      <Text className="text-title font-medium font-sans text-text-100">{title}</Text>
    </Pressable>
  );
};
