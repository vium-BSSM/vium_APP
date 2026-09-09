import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { router } from 'expo-router';

const SHOPPING_FREQUENCY_OPTIONS = [
  '3일에 한 번',
  '1주일에 한 번',
  '1달에 한 번',
  '1년에 한 번',
] as const;

export const OnboardingPage = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleStart = () => {
    // TODO: Save onboarding data
    router.push('/main');
  };

  return (
    <View className="flex-1 bg-white px-[45px] pt-[166px]">
      <View className="mb-[137px]">
        <Text className="text-title font-medium text-text-100 mb-[9px] font-sans">
          마지막으로{'\n'}얼마나 자주 장을 보시나요?
        </Text>
        <Text className="text-text14 text-text-300 mb-[49px] font-sans">
          냉장고 정리 알림에 참고해요!
        </Text>

        <View className="gap-[14px]">
          {SHOPPING_FREQUENCY_OPTIONS.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedOption(index)}
              className={`h-[42px] rounded-lg px-3 justify-center ${
                selectedOption === index ? 'bg-neutral-300' : 'bg-neutral-50'
              }`}
            >
              <Text
                className={`text-text15 font-sans ${
                  selectedOption === index ? 'text-white' : 'text-text-100'
                }`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="items-center">
        <View className="flex-row items-center justify-center gap-[11px] mb-[62px]">
          <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
          <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
          <View className="h-[14px] w-[22px] bg-neutral-100 rounded-full" />
        </View>

        <Button onPress={handleStart}>
          시작하기
        </Button>

        <View className="h-[54px]" />
      </View>
    </View>
  );
};
