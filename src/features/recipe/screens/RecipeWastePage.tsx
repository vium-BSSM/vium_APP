import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRecipeCookStore } from '../lib/recipeCookStore';
import { useRecipeComplete } from '../lib/useRecipeComplete';
import { useCookInventoryQuantities } from '../lib/useCookInventoryQuantities';
import { AppHeader, Button, QuantitySlider } from '@/shared/ui';
import BackIcon from '@/../assets/icons/back-icon.svg';

export const RecipeWastePage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);
  const { items, setRemainingAmount, reset } = useRecipeCookStore();
  const { complete, isSubmitting } = useRecipeComplete();
  const { isLoading: isQuantityLoading } = useCookInventoryQuantities(items.length > 0);
  const isFinishingRef = useRef(false);

  // 선택된 재료 없이 이 화면으로 바로 들어온 경우 상세 화면으로 돌려보냄
  useEffect(() => {
    if (items.length === 0 && !isFinishingRef.current) {
      router.replace(`/recipe/${recipeId}` as any);
    }
  }, [items.length]);

  const handleComplete = async () => {
    const success = await complete(recipeId, items);
    if (!success) return;
    isFinishingRef.current = true;
    reset();
    router.replace('/recipe' as any);
  };

  if (items.length === 0 && !isFinishingRef.current) {
    return <View className="flex-1" />;
  }

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <AppHeader />

        <View className="px-screen md:px-10 lg:px-20 pt-6 items-center">
          <View className="w-full max-w-[480px] gap-[72px]">
            <View className="gap-12">
              <View className="gap-6">
                <Pressable
                  onPress={() => (router.canGoBack() ? router.back() : router.replace(`/recipe/${recipeId}` as any))}
                  hitSlop={8}
                  className="self-start"
                >
                  <BackIcon width={30} height={30} />
                </Pressable>
                <Text className="text-heading-lg font-medium font-sans text-neutral-600">
                  맛있게 드셨나요?{'\n'}재료를 얼마나 남겼는지 말해주세요
                </Text>
              </View>

              <View className="gap-7">
                {items.map((item) => (
                  <View key={item.id} className="gap-[19px] p-2.5">
                    <Text className="text-heading-md font-medium font-sans text-text-100">{item.name}</Text>
                    {item.maxQuantity == null ? (
                      <ActivityIndicator className="self-start" />
                    ) : (
                      <QuantitySlider
                        value={item.remainingAmount}
                        max={item.maxQuantity}
                        unit={item.unit}
                        onChange={(value) => setRemainingAmount(item.id, value)}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={handleComplete} loading={isSubmitting} disabled={isQuantityLoading}>
          완료
        </Button>
      </View>
    </View>
  );
};
