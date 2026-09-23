import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useRecipeIngredientAdd } from '../lib/useRecipeIngredientAdd';

interface RecipeAddIngredientPageProps {
  recipeId: number;
}

export const RecipeAddIngredientPage: React.FC<RecipeAddIngredientPageProps> = ({ recipeId }) => {
  const router = useRouter();
  const { candidates, selectedIds, toggleSelect, submit, isSubmitting } =
    useRecipeIngredientAdd(recipeId);

  const handleAdd = async () => {
    const ok = await submit();
    if (ok) {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="px-5 md:px-10 lg:px-20 pt-[74px]">
          <View className="bg-neutral-50 h-7 w-[79px] items-center justify-center">
            <Text className="text-text14 text-neutral-300 font-medium font-sans">Logo</Text>
          </View>
        </View>

        <View className="px-5 md:px-10 lg:px-20 pt-[66px] items-center">
          <View className="w-full max-w-[480px] gap-12">
            <Text className="text-title font-medium font-sans text-black">
              요리에 추가할 재료를{'\n'}선택하세요
            </Text>

            <View className="gap-6">
              {candidates.map((ingredient) => {
                const isSelected = selectedIds.has(ingredient.id);
                return (
                  <Pressable
                    key={ingredient.id}
                    onPress={() => toggleSelect(ingredient.id)}
                    className="w-full bg-white border-2 border-neutral-100 rounded-lg px-5 py-2.5 flex-row items-center justify-between"
                  >
                    <Text className="text-[20px] font-sans text-black">{ingredient.name}</Text>
                    <View
                      className={`w-5 h-5 rounded border-2 border-neutral-300 ${
                        isSelected ? 'bg-neutral-100' : 'bg-white'
                      }`}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-12 pb-[60px] items-center">
        <Pressable
          className={`bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px] w-[299px] ${
            selectedIds.size === 0 || isSubmitting ? 'opacity-50' : ''
          }`}
          onPress={handleAdd}
          disabled={selectedIds.size === 0 || isSubmitting}
        >
          <Text className="text-text-400 text-subtitle text-center font-sans">추가</Text>
        </Pressable>
      </View>
    </View>
  );
};
