import React from 'react';
import { View } from 'react-native';
import { NavBar } from '@/shared/ui';

export const BottomNavigation: React.FC = () => {
  return (
    <View className="absolute bottom-0 left-0 right-0 px-4 pb-6">
      <NavBar />
    </View>
  );
};
