import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { InputBox } from '@/shared/ui/InputBox';
import { router } from 'expo-router';

export const SignUpPage = () => {
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
    <View className="flex-1 bg-white px-5 md:px-10 lg:px-20 pt-[161px] items-center">
      <View className="w-full max-w-[480px]">
        <View className="mb-[50px]">
          <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 mb-[74px] font-sans">
            어서오세요,{'\n'}비움이 처음이신가요?
          </Text>

          <View>
            <Text className="text-text16 md:text-[18px] font-medium text-text-100 mb-[14px] font-sans">
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
                  className="bg-neutral-50 rounded-lg px-[9.5px] md:px-4 py-2"
                >
                  <Text className="text-text16 md:text-[18px] text-text-100 font-sans">
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

        <View className="items-center mb-[40px]">
          <View className="flex-row items-center mb-[23px]">
            <View className="h-px w-[68px] md:w-[100px] bg-neutral-200" />
            <Text className="text-text16 md:text-[18px] text-text-300 mx-[9px] md:mx-[15px] font-sans">
              SNS 계정으로 빠른 회원가입
            </Text>
            <View className="h-px w-[68px] md:w-[100px] bg-neutral-200" />
          </View>

          <View className="flex-row gap-[23px]">
            <View className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-neutral-100 rounded-full" />
            <View className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-neutral-100 rounded-full" />
            <View className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-neutral-100 rounded-full" />
          </View>
        </View>

        <View className="items-center">
          <View className="flex-row items-center justify-center gap-[11px] mb-[62px]">
            <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
            <View className="h-[14px] w-[14px] bg-neutral-50 rounded-full" />
            <View className="h-[14px] w-[22px] bg-neutral-100 rounded-full" />
          </View>

          <Button onPress={handleSignUp} style={{ marginLeft: 4 }}>
            회원가입
          </Button>

          <View className="h-[54px]" />
        </View>
      </View>
    </View>
  );
};
