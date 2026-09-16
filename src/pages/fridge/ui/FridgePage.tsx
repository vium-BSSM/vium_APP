import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useIngredientUpload } from '@/features/ingredient';
import { FridgeHeader, FridgeGrid } from '@/widgets';
import { BottomNavigation } from '@/widgets';
import { AddButton } from '@/shared/ui';
import { MOCK_FRIDGE_ITEMS } from '@/shared/mock/fridgeData';

export const FridgePage = () => {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'fridge' | 'receipt' | 'settings'>('fridge');
  const { showIngredientUploadOptions } = useIngredientUpload();

  const fridgeItems = MOCK_FRIDGE_ITEMS.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    status: item.status,
  }));

  const handleNavItemPress = (item: 'home' | 'fridge' | 'receipt' | 'settings') => {
    setActiveNavItem(item);
    if (item === 'home') {
      router.push('/main');
    } else if (item === 'settings') {
      router.push('/debug');
    }
    // fridge is current page, no navigation needed
  };

  const handleReceiptPress = () => {
    showIngredientUploadOptions((uri) => {
      // TODO: 선택된 이미지 처리 로직 추가 (API 업로드, OCR 등)
      console.log('처리할 재료 이미지:', uri);
    });
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
        onItemPress={(item) => router.push(`/fridge/${item.id}` as any)}
      />

      <AddButton
        icon="photo"
        onReceiptPress={handleReceiptPress}
        onCartPress={() => console.log('온라인 장바구니 등록')}
        style={{ position: 'absolute', bottom: 120, right: 29 }}
      />

      <BottomNavigation
        activeItem={activeNavItem}
        onItemPress={handleNavItemPress}
      />
    </View>
  );
};
