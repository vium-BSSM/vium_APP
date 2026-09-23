import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { RecipePage as RecipePageFeature } from '@/features/recipe';
import { BottomNavigation } from '@/widgets';

export const RecipePage: React.FC = () => {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'fridge' | 'receipt' | 'settings'>('receipt');

  const handleNavItemPress = (item: 'home' | 'fridge' | 'receipt' | 'settings') => {
    if (item === 'home') {
      router.push('/main');
    } else if (item === 'fridge') {
      router.push('/fridge');
    } else if (item === 'settings') {
      router.push('/debug');
    } else {
      setActiveNavItem(item);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <RecipePageFeature />
      <BottomNavigation activeItem={activeNavItem} onItemPress={handleNavItemPress} />
    </View>
  );
};
