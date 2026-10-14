import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AppHeader, BackTitle } from '@/shared/ui';

interface FridgeHeaderProps {
  title: string;
  onBackPress: () => void;
  onManagePress: () => void;
}

export const FridgeHeader: React.FC<FridgeHeaderProps> = ({
  title,
  onBackPress,
  onManagePress,
}) => {
  return (
    <View>
      <AppHeader />
      <View className="px-screen md:px-8 lg:px-16 pt-10 pb-4 max-w-[1200px] mx-auto w-full">
        <BackTitle title={title} onPress={onBackPress} className="mb-2" />

      <View className="items-end">
        <Pressable onPress={onManagePress} className="py-2 px-4">
          <Text className="text-text-200 text-text14 md:text-text15 font-sans">관리하기 {'>'}</Text>
        </Pressable>
      </View>
      </View>
    </View>
  );
};
