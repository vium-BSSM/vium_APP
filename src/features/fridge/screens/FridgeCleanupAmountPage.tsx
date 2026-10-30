import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useFridgeCleanupStore } from '../lib/fridgeCleanupStore';
import { useFridgeCleanupFinish } from '../lib/useFridgeCleanupFinish';
import { AppHeader, Button, PageTitle, QuantitySlider } from '@/shared/ui';
import BackIcon from '@/../assets/icons/back-icon.svg';

export const FridgeCleanupAmountPage: React.FC = () => {
  const router = useRouter();
  const { items, setRemainingAmount, reset } = useFridgeCleanupStore();
  const { finish, isSubmitting } = useFridgeCleanupFinish();
  const isFinishingRef = useRef(false);

  // 선택된 재료 없이 이 화면으로 바로 들어온 경우 선택 화면으로 돌려보냄
  // (단, 정리 종료로 인해 store가 비워진 경우는 제외)
  useEffect(() => {
    if (items.length === 0 && !isFinishingRef.current) {
      router.replace('/fridge/cleanup/select' as any);
    }
  }, [items.length]);

  const handleFinish = async () => {
    const isSuccess = await finish();
    if (!isSuccess) return;

    isFinishingRef.current = true;
    reset();
    router.replace('/fridge' as any);
  };

  if (items.length === 0 && !isFinishingRef.current) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AppHeader />

        <View className="flex-1 px-screen md:px-10 lg:px-20 pt-6 items-center">
          <View className="w-full max-w-[480px] gap-12">
            <View className="gap-6">
              {/* 뒤로 가도 선택 화면이 스택에 남아 있어 고른 재료가 유지됨 */}
              <Pressable
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/fridge/cleanup/select' as any))}
                hitSlop={8}
                className="self-start"
              >
                <BackIcon width={30} height={30} />
              </Pressable>
              <PageTitle>
                마지막 단계예요!{'\n'}얼마나 남겼는지 말해주세요
              </PageTitle>
            </View>

            <View className="gap-7">
              {items.map((item) => (
                <View key={item.id} className="gap-[19px] p-2.5">
                  <Text className="text-heading-md font-medium font-sans text-text-100">
                    {item.title}
                  </Text>
                  <QuantitySlider
                    value={item.remainingAmount}
                    max={item.remainingQuantity}
                    unit={item.unit}
                    onChange={(value) => setRemainingAmount(item.id, value)}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={handleFinish} loading={isSubmitting}>
          냉장고 정리 종료
        </Button>
      </View>
    </View>
  );
};
