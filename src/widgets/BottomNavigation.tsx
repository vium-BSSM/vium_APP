import React from 'react';
import { View } from 'react-native';
import { NavBar } from '@/shared/ui';

type NavItem = 'home' | 'fridge' | 'receipt' | 'settings';

interface BottomNavigationProps {
  activeItem: NavItem;
  onItemPress: (item: NavItem) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeItem,
  onItemPress,
}) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 px-4 pb-6">
      <NavBar activeItem={activeItem} onItemPress={onItemPress} />
    </View>
  );
};
