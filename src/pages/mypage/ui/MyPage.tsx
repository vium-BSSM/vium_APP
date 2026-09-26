import React from 'react';
import { View } from 'react-native';
import { MyPage as MyPageFeature } from '@/features/account';
import { BottomNavigation } from '@/widgets';

export const MyPage: React.FC = () => {
  return (
    <View className="flex-1 bg-white">
      <MyPageFeature />
      <BottomNavigation />
    </View>
  );
};
