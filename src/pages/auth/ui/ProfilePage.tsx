import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { router } from 'expo-router';

export const ProfilePage = () => {
  const [nickname, setNickname] = useState('');

  const handleNext = () => {
    // TODO: Save profile data
    router.push('/onboarding');
  };

  const handleClearNickname = () => {
    setNickname('');
  };

  return (
    <View className="flex-1 bg-white px-5 md:px-10 lg:px-20 pt-[164px] items-center">
      <View className="w-full max-w-[480px]">
        <View className="items-center mb-[120px]">
          <View className='text-left'>
          <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 mb-[54px] font-sans text-center">
            환영합니다,{'\n'}어떤 이름으로 불러드릴까요?
          </Text>
          </View>

          <View className="items-center">
            <View className="w-[117px] h-[117px] md:w-[140px] md:h-[140px] bg-neutral-100 rounded-full mb-[42px]" />

            <View className="w-[232px] md:w-[280px]">
              <View className="flex-row items-center justify-between mb-[6px]">
                <TextInput
                  className="text-subtitle md:text-[24px] text-text-100 font-sans flex-1"
                  style={{ fontFamily: 'Paperlogy' }}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder="픽도화이팅"
                  placeholderTextColor="#A7A9B5"
                  maxLength={8}
                />
                <Pressable
                  onPress={handleClearNickname}
                  className="w-6 h-6 md:w-8 md:h-8 items-center justify-center"
                >
                  <Text className="text-text-100 text-[18px] md:text-[20px] font-sans">✕</Text>
                </Pressable>
              </View>

              <View className="h-[2px] bg-neutral-100 rounded-full mb-[6px]" />
              <Text className="text-text14 md:text-text15 text-text-300 text-right font-sans">
                {nickname.length}/8자
              </Text>
            </View>
          </View>
        </View>

        <View className="items-center">
          <View className="flex-row items-center justify-center gap-[11px] mb-[62px]">
            <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
            <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
            <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
          </View>

          <Button onPress={handleNext}>
            다음
          </Button>

          <Text className="text-text14 md:text-text15 text-text-300 mt-[8px] font-sans text-center">
            지금 정한 이름은 나중에 수정할 수 있어요
          </Text>
        </View>
      </View>
    </View>
  );
};
