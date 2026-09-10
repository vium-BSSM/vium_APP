import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Banner } from '@/shared/ui';
import { BottomNavigation } from '@/widgets';
import ReportIcon from '@/../assets/icons/report-icon.svg';
import CartIcon from '@/../assets/icons/cart-icon.svg';
import BrushIcon from '@/../assets/icons/brush-icon.svg';
import RefrigeratorIcon from '@/../assets/icons/refrigerator-icon.svg';
import ChefIcon from '@/../assets/icons/chef-icon.svg';

export const MainPage = () => {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState<'home' | 'fridge' | 'receipt' | 'settings'>('home');

  const handleNavItemPress = (item: 'home' | 'fridge' | 'receipt' | 'settings') => {
    setActiveNavItem(item);
    if (item === 'home') {
      router.push('/main');
    } else if (item === 'fridge') {
      router.push('/fridge');
    } else if (item === 'settings') {
      router.push('/debug');
    }
  };

  const menuItems = [
    { icon: ReportIcon, label: '식재료 리포트', onPress: () => console.log('식재료 리포트') },
    { icon: CartIcon, label: '장보기 도우미', onPress: () => console.log('장보기 도우미') },
    { icon: BrushIcon, label: '냉장고 대청소', onPress: () => console.log('냉장고 대청소') },
    { icon: RefrigeratorIcon, label: 'My 냉장고', onPress: () => router.push('/fridge') },
    { icon: ChefIcon, label: '레시피', onPress: () => console.log('레시피') },
  ];

  const recipes = [
    { id: 1, title: '당근김치찌개', ingredients: ['당근', '감자'], image: null },
    { id: 2, title: '당근김치찌개', ingredients: ['당근', '감자'], image: null },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-7 pt-[74px] pb-[35px] flex-row items-center justify-between">
          <Pressable onPress={() => router.push('/splash')}>
            <Text className="text-text-100 text-text16 font-sans">Logo</Text>
          </Pressable>
          <View className="w-[35px] h-[35px] items-center justify-center">
            <View className="w-6 h-6 bg-neutral-200 rounded-full" />
          </View>
        </View>

        {/* Banner */}
        <View className="px-5 mb-8">
          <Banner variant="tomato" onPress={() => console.log('Banner pressed')} />
        </View>

        {/* Menu Grid */}
        <View className="px-7 mb-10">
          <View className="bg-white rounded-2xl py-5 px-3">
            <View className="flex-row flex-wrap">
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  className="items-center mb-6"
                  style={{ width: '33.33%' }}
                  onPress={item.onPress}
                >
                  <View className="w-10 h-10 items-center justify-center mb-[15px]">
                    <item.icon width={40} height={40} color="#666666" />
                  </View>
                  <Text className="text-text-100 text-[14px] font-sans text-center">
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="h-px bg-neutral-50 my-[10px]" />
          </View>
        </View>

        {/* Recipe Section */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-[12px]">
            <Text className="text-text-100 text-[19px] font-medium font-sans">
              오늘의 냉털 레시피
            </Text>
            <Text className="text-text-100 text-[14px] font-sans">{'>'}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {recipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                className="bg-white rounded-2xl p-2.5 w-[212px] h-[112px]"
                style={{ borderWidth: 1, borderColor: '#E0E0E0' }}
                onPress={() => console.log('Recipe pressed:', recipe.title)}
              >
                <View className="flex-row gap-[11px] mb-[5px]">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <View
                      key={idx}
                      className="bg-primary-10 rounded-full px-[11px] py-px"
                    >
                      <Text className="text-primary-100 text-[12px] font-sans">
                        {ingredient}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text className="text-text-100 text-[19px] font-medium font-sans mb-auto">
                  {recipe.title}
                </Text>
                <View className="flex-row items-center justify-end">
                  <Text className="text-text-100 text-[14px] font-sans mr-[6px]">
                    바로가기
                  </Text>
                  <Text className="text-text-100 text-[14px] font-sans">{'>'}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNavigation activeItem={activeNavItem} onItemPress={handleNavItemPress} />
    </View>
  );
};
