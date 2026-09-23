import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { RecipeCategory } from '../types';
import { useRecipesList } from '../lib/useRecipesList';
import { RecipeCategoryFilter } from './RecipeCategoryFilter';
import { RecipeListCard } from './RecipeListCard';

export const RecipePage: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState<RecipeCategory>('전체');
  const { recipes, isLoading, error } = useRecipesList(category);

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="px-5 md:px-10 lg:px-20 pt-[74px]">
        <View className="bg-neutral-50 h-7 w-[79px] items-center justify-center">
          <Text className="text-text14 text-neutral-300 font-medium font-sans">Logo</Text>
        </View>
      </View>

      <View className="px-5 md:px-10 lg:px-20 pt-[26px] gap-[26px]">
        <View className="flex-row items-center gap-4">
          <Text className="text-title font-medium font-sans text-black">맞춤 레시피</Text>
        </View>

        <RecipeCategoryFilter selected={category} onSelect={setCategory} />
      </View>

      <View className="px-5 md:px-10 lg:px-20 pt-[26px]">
        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#A2CD87" />
          </View>
        ) : error ? (
          <Text className="text-text14 text-text-200 font-sans text-center py-10">{error}</Text>
        ) : recipes.length === 0 ? (
          <Text className="text-text14 text-text-200 font-sans text-center py-10">
            추천할 수 있는 레시피가 없어요.
          </Text>
        ) : (
          <View className="gap-[26px]">
            {recipes.map((recipe) => (
              <RecipeListCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}` as any)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
