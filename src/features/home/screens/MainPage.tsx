import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Banner, HomeHeader, MenuList } from '@/shared/ui';
import { useFridgeCleanup, FridgeCleanupModal, useExpiringIngredients } from '@/features/fridge';
import { useRecipesList } from '@/features/recipe';
import { useMyProfile } from '@/features/account';
import { SectionTitle } from '../ui/SectionTitle';
import { ExpiringIngredientList } from '../ui/ExpiringIngredientList';
import { RecommendRecipeCard } from '../ui/RecommendRecipeCard';

const RECIPE_LIMIT = 5;

export const MainPage = () => {
  const router = useRouter();
  const { isCleanupModalVisible, openCleanupModal, closeCleanupModal } = useFridgeCleanup();
  const { profile } = useMyProfile();
  const { ingredients: expiringIngredients } = useExpiringIngredients();
  const { recipes: allRecipes } = useRecipesList();
  const recipes = allRecipes.slice(0, RECIPE_LIMIT);
  const expiringNames = useMemo(
    () => new Set(expiringIngredients.map((ingredient) => ingredient.name)),
    [expiringIngredients]
  );

  const handleBannerPress = (variant: 'tomato' | 'potato' | 'onion') => {
    if (variant === 'tomato') router.navigate('/recipe' as any);
    if (variant === 'potato') router.navigate('/report' as any);
    if (variant === 'onion') router.navigate('/shopping' as any);
  };

  const menuItems = [
    { label: '장보기 도우미', onPress: () => router.navigate('/shopping' as any) },
    { label: '식재료 리포트', onPress: () => router.navigate('/report' as any) },
    { label: '냉장고 대청소', onPress: openCleanupModal },
    { label: '레시피', onPress: () => router.navigate('/recipe' as any) },
  ];

  return (
    <View className="flex-1 bg-white">
      <View className="mb-[42px]">
        <HomeHeader activeTab="recommend" profileImageUrl={profile.profileImageUrl} />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-screen md:px-10 lg:px-20 max-w-[1200px] w-full mx-auto gap-16">
          <View className="gap-12">
            <Banner onPress={handleBannerPress} />

            <ExpiringIngredientList
              ingredients={expiringIngredients}
              onTitlePress={() => router.navigate('/fridge' as any)}
              onItemPress={(id) => router.push(`/fridge/${id}` as any)}
            />

            <View className="gap-[22px]">
              <SectionTitle title="냉장고 털이 레시피" onPress={() => router.navigate('/recipe' as any)} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 13 }}
              >
                {recipes.map((recipe) => (
                  <RecommendRecipeCard
                    key={recipe.id}
                    title={recipe.title}
                    image={recipe.image}
                    ingredientNames={recipe.ingredientNames}
                    expiringNames={expiringNames}
                    onPress={() => router.push(`/recipe/${recipe.id}` as any)}
                  />
                ))}
              </ScrollView>
            </View>
          </View>

          <MenuList items={menuItems} />
        </View>
      </ScrollView>

      <FridgeCleanupModal
        visible={isCleanupModalVisible}
        onClose={closeCleanupModal}
        onConfirm={() => {
          closeCleanupModal();
          router.push('/fridge/cleanup/select' as any);
        }}
      />
    </View>
  );
};
