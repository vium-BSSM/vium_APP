import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { RecipeCategory } from '../types';
import { useRecipesList } from '../lib/useRecipesList';
import { RecipeCategoryFilter } from '../ui/RecipeCategoryFilter';
import { RecipeListCard } from '../ui/RecipeListCard';
import { AppHeader, BackTitle, Coachmark, CoachmarkStep } from '@/shared/ui';
import { useCoachmarkSeen } from '@/shared/lib/hooks/useCoachmarkSeen';
import CharacterOnion from '@/../assets/splash/character-onion.svg';

export const RecipePage: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState<RecipeCategory>('전체');
  const { recipes, isLoading, error, needsCatalogIngredients, refresh } = useRecipesList(category);
  // 첫 진입 튜토리얼 — 첫 레시피 카드 → 카테고리 (레시피가 없으면 카테고리만)
  const categoryRef = useRef<View>(null);
  const firstCardRef = useRef<View>(null);
  const coachmark = useCoachmarkSeen('recipeList');
  const hasRecipes = !error && !needsCatalogIngredients && recipes.length > 0;
  const coachmarkSteps: CoachmarkStep[] = [
    ...(hasRecipes
      ? [
          {
            targetRef: firstCardRef,
            speaker: '양파',
            message: '냉장고 재료로 만들 수 있는 요리야.\n눌러서 재료와 순서를 확인해봐!',
            character: <CharacterOnion width={58} height={73} />,
          },
        ]
      : []),
    {
      targetRef: categoryRef,
      speaker: '양파',
      message: '먹고 싶은 종류만 골라볼 수도 있어!',
      character: <CharacterOnion width={58} height={73} />,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* 헤더(로고·제목·카테고리)는 고정하고 레시피 목록만 스크롤 */}
      <AppHeader />

      {/* 아래 패딩: 스크롤된 카드가 필터 바로 밑에 붙어 잘려 보이지 않게 */}
      <View className="px-screen md:px-10 lg:px-20 pt-10 pb-4 gap-[26px]">
        <BackTitle
          title="맞춤 레시피"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/main'))}
        />

        <View ref={categoryRef} collapsable={false}>
          <RecipeCategoryFilter selected={category} onSelect={setCategory} />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-screen md:px-10 lg:px-20 pt-9">
          {isLoading ? (
            <View className="items-center py-10 gap-4">
              <ActivityIndicator size="large" color="#A2CD87" />
              {/* 처음 추천받을 때는 AI가 레시피를 만들어 몇 초 걸릴 수 있음 */}
              <Text className="text-text14 text-text-200 font-sans">냉장고 재료로 레시피를 찾고 있어요</Text>
            </View>
          ) : needsCatalogIngredients ? (
            <View className="items-center py-10 gap-4">
              <Text className="text-text14 text-text-200 font-sans text-center">
                레시피를 추천하려면 재료를 등록할 때{'\n'}목록에서 재료를 골라주세요.
              </Text>
              <Pressable onPress={() => router.push('/fridge/add' as any)} hitSlop={8}>
                <Text className="text-text14 font-medium font-sans text-text-100">재료 등록하러 가기</Text>
              </Pressable>
            </View>
          ) : error ? (
            <View className="items-center py-10 gap-4">
              <Text className="text-text14 text-text-200 font-sans text-center">{error}</Text>
              <Pressable onPress={refresh} hitSlop={8}>
                <Text className="text-text14 font-medium font-sans text-text-100">다시 시도</Text>
              </Pressable>
            </View>
          ) : recipes.length === 0 ? (
            <Text className="text-text14 text-text-200 font-sans text-center py-10">
              추천할 수 있는 레시피가 없어요.{'\n'}냉장고에 재료를 등록하면 레시피를 추천해 드려요.
            </Text>
          ) : (
            <View className="gap-[26px]">
              {recipes.map((recipe, index) => (
                <View key={recipe.id} ref={index === 0 ? firstCardRef : undefined} collapsable={false}>
                  <RecipeListCard recipe={recipe} onPress={() => router.push(`/recipe/${recipe.id}` as any)} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 추천이 끝난 뒤(로딩 중엔 카드 위치를 모름)에 띄움 */}
      <Coachmark visible={coachmark.shouldShow && !isLoading} steps={coachmarkSteps} onFinish={coachmark.markSeen} />
    </View>
  );
};
