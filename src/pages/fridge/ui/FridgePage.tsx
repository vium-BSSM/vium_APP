import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useIngredientUpload, useIngredientsList, FridgeHeader, FridgeGrid } from '@/features/ingredient';
import { BottomNavigation } from '@/widgets';
import { AddButton } from '@/shared/ui';

export const FridgePage = () => {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'fridge' | 'receipt' | 'settings'>('fridge');
  const { showIngredientUploadOptions } = useIngredientUpload();
  const { items: fridgeItems, isLoading, error } = useIngredientsList();

  const handleNavItemPress = (item: 'home' | 'fridge' | 'receipt' | 'settings') => {
    if (item === 'home') {
      router.push('/main');
    } else if (item === 'settings') {
      router.push('/debug');
    } else {
      setActiveNavItem(item);
    }
  };

  const handleReceiptPress = () => {
    showIngredientUploadOptions((uri) => {
      // TODO: 선택된 이미지 처리 로직 추가 (API 업로드, OCR 등)
      console.log('처리할 재료 이미지:', uri);
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <FridgeHeader
          title="픽도화이팅의 냉장고"
          onBackPress={() => router.back()}
          onManagePress={() => console.log('Manage')}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00D1A7" />
          <Text className="mt-4 text-text14 text-text-200 font-sans">재료를 불러오는 중...</Text>
        </View>
        <BottomNavigation
          activeItem={activeNavItem}
          onItemPress={handleNavItemPress}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white">
        <FridgeHeader
          title="픽도화이팅의 냉장고"
          onBackPress={() => router.back()}
          onManagePress={() => console.log('Manage')}
        />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text16 text-text-100 font-semibold font-sans mb-2">오류 발생</Text>
          <Text className="text-text14 text-text-200 font-sans text-center">{error}</Text>
        </View>
        <BottomNavigation
          activeItem={activeNavItem}
          onItemPress={handleNavItemPress}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FridgeHeader
        title="픽도화이팅의 냉장고"
        onBackPress={() => router.back()}
        onManagePress={() => console.log('Manage')}
      />

      <FridgeGrid
        items={fridgeItems}
        onAddPress={() => router.push('/fridge/add' as any)}
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
