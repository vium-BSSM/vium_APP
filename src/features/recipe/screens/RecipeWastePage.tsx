import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRecipeCookStore } from '../lib/recipeCookStore';
import { useRecipeComplete } from '../lib/useRecipeComplete';
import { useCookInventoryQuantities } from '../lib/useCookInventoryQuantities';
import { AppHeader, Button, Coachmark, CoachmarkStep, QuantitySlider } from '@/shared/ui';
import { useCoachmarkSeen } from '@/shared/lib/hooks/useCoachmarkSeen';
import BackIcon from '@/../assets/icons/back-icon.svg';
import CharacterOnion from '@/../assets/splash/character-onion.svg';

export const RecipeWastePage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = parseInt(id || '1', 10);
  const { items, setUsedAmount, setWasteAmount, reset } = useRecipeCookStore();
  const { complete, isSubmitting } = useRecipeComplete();
  const { isLoading: isQuantityLoading } = useCookInventoryQuantities(items.length > 0);
  const isFinishingRef = useRef(false);
  // effect는 ref로, 렌더는 state로 확인 (store 비우기와 렌더 순서가 어긋나도 리다이렉트되지 않게)
  const [isFinishing, setIsFinishing] = useState(false);
  // 첫 진입 튜토리얼 — 첫 재료의 사용량 슬라이더 → 버린 양 슬라이더
  const usedSliderRef = useRef<View>(null);
  const wasteSliderRef = useRef<View>(null);
  const coachmark = useCoachmarkSeen('recipeWaste');
  const firstItem = items[0];
  const coachmarkSteps: CoachmarkStep[] = [
    {
      targetRef: usedSliderRef,
      speaker: '양파',
      message: '요리에 쓴 만큼만 밀어줘.\n남은 건 냉장고에 그대로 있어!',
      character: <CharacterOnion width={58} height={73} />,
    },
    // 비율(%) 대체 모드에는 버린 양 슬라이더가 없음
    ...(firstItem?.unit !== '%'
      ? [
          {
            targetRef: wasteSliderRef,
            speaker: '양파',
            message: '쓴 것 중에 버린 게 있으면 여기서 알려줘.\n버린 양은 리포트에 모아둘게!',
            character: <CharacterOnion width={58} height={73} />,
          },
        ]
      : []),
  ];
  // 슬라이더 최대값(재고 수량)을 다 불러온 뒤에 띄움
  const isCoachmarkReady = !isQuantityLoading && firstItem?.maxQuantity != null;

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
    setIsFinishing(true);
    reset();
    router.replace('/recipe' as any);
  };

  if (items.length === 0 && !isFinishing) {
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
                {items.map((item, index) => (
                  <View key={item.id} className="gap-[19px] p-2.5">
                    <Text className="text-heading-md font-medium font-sans text-text-100">{item.name}</Text>
                    {item.maxQuantity == null ? (
                      <ActivityIndicator className="self-start" />
                    ) : (
                      <View className="gap-5">
                        <View
                          ref={index === 0 ? usedSliderRef : undefined}
                          collapsable={false}
                          className="gap-2"
                        >
                          <Text className="text-text14 font-sans text-text-200">사용한 양 (남긴 만큼 냉장고에 남아요)</Text>
                          <QuantitySlider
                            value={item.usedAmount}
                            max={item.maxQuantity}
                            unit={item.unit}
                            onChange={(value) => setUsedAmount(item.id, value)}
                          />
                        </View>
                        {/* 비율(%) 대체 모드는 수량을 몰라 폐기량을 기록할 수 없음 */}
                        {item.unit !== '%' && (
                          <View
                            ref={index === 0 ? wasteSliderRef : undefined}
                            collapsable={false}
                            className="gap-2"
                          >
                            <Text className="text-text14 font-sans text-text-200">그중 버린 양</Text>
                            <QuantitySlider
                              value={item.wasteAmount}
                              max={item.usedAmount}
                              unit={item.unit}
                              onChange={(value) => setWasteAmount(item.id, value)}
                            />
                          </View>
                        )}
                      </View>
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

      <Coachmark
        visible={coachmark.shouldShow && isCoachmarkReady}
        steps={coachmarkSteps}
        onFinish={coachmark.markSeen}
      />
    </View>
  );
};
