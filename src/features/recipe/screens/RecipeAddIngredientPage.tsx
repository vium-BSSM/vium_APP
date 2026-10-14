import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRecipeIngredientAdd } from '../lib/useRecipeIngredientAdd';
import { AppHeader, Button } from '@/shared/ui';

export const RecipeAddIngredientPage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);
  const { candidates, selectedIds, toggleSelect } = useRecipeIngredientAdd();

  // 레시피 API 연동 전까지는 서버에 저장하지 않고 상세 화면으로 돌아갑니다.
  const handleAdd = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/recipe/${recipeId}` as any);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }}>
        <AppHeader />

        <View className="px-screen md:px-10 lg:px-20 pt-[66px] items-center">
          <View className="w-full max-w-[480px] gap-12">
            <Text className="text-title font-medium font-sans text-text-100">
              요리에 추가할 재료를{'\n'}선택하세요
            </Text>

            <View className="gap-6">
              {candidates.map((ingredient) => {
                const isSelected = selectedIds.has(ingredient.id);
                return (
                  <Pressable
                    key={ingredient.id}
                    onPress={() => toggleSelect(ingredient.id)}
                    className={`w-full border-2 rounded-lg px-5 py-2.5 flex-row items-center justify-between ${
                      isSelected ? 'bg-primary-200 border-primary-600' : 'bg-white border-neutral-100'
                    }`}
                  >
                    <Text className="text-subtitle font-sans text-text-100">{ingredient.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={handleAdd} disabled={selectedIds.size === 0}>
          추가
        </Button>
      </View>
    </View>
  );
};
