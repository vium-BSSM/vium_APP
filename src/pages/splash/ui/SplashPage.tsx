import { Button } from '@/shared/ui/Button';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export const SplashPage = () => {
  return (
    <View className="flex-1 bg-white items-center justify-center px-[51.5px]">
      <View className="items-center mb-[200px]">
        <Text className="text-[48px] leading-tight tracking-normal font-extrabold text-text-100 text-center font-sans mt-[130px]">
          문구로고{"\n"}뭐그런거
        </Text>
        <Text className="text-subtitle font-medium text-text-100 text-center mt-4 font-sans">
          나만의 폐기관리 도우미
        </Text>
      </View>

      <View className="w-full items-center">
        <View className="flex-row items-center justify-center gap-[11px] mb-[61px]">
          <View className="h-[14px] w-[22px] bg-neutral-100 rounded-full" />
          <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
          <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
        </View>

        <Button onPress={() => router.push('/login')}>
          시작하기
        </Button>
      </View>
    </View>
  );
};
