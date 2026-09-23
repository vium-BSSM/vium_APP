import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RecipeWastePage as RecipeWastePageFeature } from '@/features/recipe';
import { BottomNavigation } from '@/widgets';

export const RecipeWastePage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);
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
      <RecipeWastePageFeature recipeId={recipeId} />
      <BottomNavigation activeItem={activeNavItem} onItemPress={handleNavItemPress} />
    </View>
  );
};
