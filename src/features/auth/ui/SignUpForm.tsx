import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { InputBox } from '@/shared/ui/InputBox';
import { router } from 'expo-router';

export const SignUpForm = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // TODO: Implement signup logic
    router.push('/profile');
  };

  const handleCheckDuplicate = () => {
    // TODO: Implement duplicate check logic
    console.log('Check duplicate for:', nickname);
  };

  return (
    <View className="flex-1 bg-white px-[22px] pt-[161px]">
      <View className="mb-[111px]">
        <Text className="text-title font-medium text-text-100 mb-[64px] font-sans">
          어서오세요,{'\n'}비움이 처음이신가요?
        </Text>

        <View>
          <Text className="text-text16 font-medium text-text-100 mb-[14px] font-sans">
            회원가입
          </Text>
          <View className="gap-4">
            <View className="flex-row items-center gap-3">
              <InputBox
                type="email"
                value={nickname}
                onChangeText={setNickname}
                placeholder="닉네임 입력"
                style={{ flex: 1 }}
              />
              <Pressable
                onPress={handleCheckDuplicate}
                className="bg-neutral-50 rounded-lg px-[9.5px] py-2"
              >
                <Text className="text-text16 text-text-100 font-sans">
                  중복 확인
                </Text>
              </Pressable>
            </View>
            <InputBox
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="이메일 입력"
            />
            <InputBox
              type="password"
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호 입력"
            />
          </View>
        </View>
      </View>

      <View className="items-center mb-[30px]">
        <View className="flex-row items-center mb-[23px]">
          <View className="h-px w-[48px] bg-neutral-200" />
          <Text className="text-text16 text-text-300 mx-[9px] font-sans">
            SNS 계정으로 빠른 회원가입
          </Text>
          <View className="h-px w-[48px] bg-neutral-200" />
        </View>

        <View className="flex-row gap-[23px]">
          <View className="w-[50px] h-[50px] bg-neutral-100 rounded-full" />
          <View className="w-[50px] h-[50px] bg-neutral-100 rounded-full" />
          <View className="w-[50px] h-[50px] bg-neutral-100 rounded-full" />
        </View>
      </View>

      <View className="items-center">
        <View className="flex-row items-center justify-center gap-[11px] mb-[61px]">
          <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
          <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
          <View className="h-[14px] w-[22px] bg-neutral-100 rounded-full" />
        </View>

        <Button onPress={handleSignUp} style={{ marginLeft: 4 }}>
          회원가입
        </Button>
      </View>
    </View>
  );
};
