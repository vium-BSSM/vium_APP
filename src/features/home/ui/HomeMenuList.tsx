import React from 'react';
import { View, Text, Pressable } from 'react-native';
import ChevronRightIcon from '@/../assets/icons/chevron-right-icon.svg';

interface HomeMenuListProps {
  items: { label: string; onPress: () => void }[];
}

export const HomeMenuList: React.FC<HomeMenuListProps> = ({ items }) => (
  <View className="w-full bg-white rounded-lg p-2.5 gap-2">
    {items.map((item) => (
      <Pressable
        key={item.label}
        onPress={item.onPress}
        className="p-2.5 rounded-lg flex-row items-center justify-between active:bg-neutral-10"
      >
        <Text className="text-text-100 text-text14 font-sans">{item.label}</Text>
        <ChevronRightIcon width={8} height={12} color="#A1A1A1" />
      </Pressable>
    ))}
  </View>
);
