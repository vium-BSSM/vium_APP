import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { FridgeHeader, FridgeGrid } from '@/features/fridge/ui';
import { BottomNavigation } from '@/widgets';
import { AddButton } from '@/shared/ui';

export default function FridgePage() {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'fridge' | 'receipt' | 'settings'>('fridge');

  const fridgeItems = [
    { id: 1, title: '당근', subtitle: '소비기한 D-3', status: '위험' as const },
    { id: 2, title: '양파', subtitle: '소비기한 D-30', status: '굿' as const },
    { id: 3, title: '카레카레', subtitle: '소비기한 D-7', status: '보통' as const },
    { id: 4, title: '양파', subtitle: '소비기한 D-30', status: '굿' as const },
    { id: 5, title: '양파', subtitle: '소비기한 D-30', status: '굿' as const },
    { id: 6, title: '당근', subtitle: '소비기한 D-3', status: '위험' as const },
    { id: 7, title: '양파', subtitle: '소비기한 D-30', status: '굿' as const },
    { id: 8, title: '양파', subtitle: '소비기한 D-7', status: '보통' as const },
    { id: 9, title: '당근', subtitle: '소비기한 D-3', status: '위험' as const },
    { id: 10, title: '양파', subtitle: '소비기한 D-30', status: '굿' as const },
    { id: 11, title: '양파', subtitle: '소비기한 D-7', status: '보통' as const },
    { id: 12, title: '당근', subtitle: '소비기한 D-3', status: '위험' as const },
    { id: 13, title: '양파', subtitle: '소비기한 D-30', status: '굿' as const },
    { id: 14, title: '양파', subtitle: '소비기한 D-7', status: '보통' as const }
  ];

  const handleNavItemPress = (item: 'home' | 'fridge' | 'receipt' | 'settings') => {
    setActiveNavItem(item);
    if (item === 'home') {
      router.push('/');
    }
    // fridge is current page, no navigation needed
  };

  return (
    <View className="flex-1 bg-white">
      <FridgeHeader
        title="픽도화이팅의 냉장고"
        onBackPress={() => router.back()}
        onManagePress={() => console.log('Manage')}
      />

      <FridgeGrid
        items={fridgeItems}
        onAddPress={() => console.log('Add new item')}
        onItemPress={(item) => console.log('Item pressed:', item.title)}
      />

      <AddButton
        icon="photo"
        onReceiptPress={() => console.log('영수증 등록')}
        onCartPress={() => console.log('온라인 장바구니 등록')}
        style={{ position: 'absolute', bottom: 120, right: 29 }}
      />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemPress={handleNavItemPress}
      />
    </View>
  );
}
