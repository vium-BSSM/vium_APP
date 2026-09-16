import { Button } from "@/shared/ui/Button";
import { InputBox } from "@/shared/ui/InputBox";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Implement login logic
    router.push("/signUp");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-5 md:px-10 lg:px-20 pt-[161px] items-center">
        <View className="w-full max-w-[480px]">
          <View className="mb-[50px]">
            <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 mb-[74px] font-sans">
              비움에 오신걸 환영해요!{"\n"}함께 시작해요
            </Text>

            <View>
              <Text className="text-text16 md:text-[18px] font-medium text-text-100 mb-[14px] font-sans">
                메일 로그인
              </Text>
              <View className="gap-4">
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
                SNS 계정으로 로그인
              </Text>
              <View className="h-px w-[68px] md:w-[100px] bg-neutral-200" />
            </View>

            <View className="flex-row gap-[23px]">
              <View className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-neutral-100 rounded-full" />
              <View className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-neutral-100 rounded-full" />
              <View className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-neutral-100 rounded-full" />
            </View>
          </View>
        </View>
      </View>

      <View className="w-full items-center pb-[100px]">
        <Pressable onPress={() => router.push("/signUp")} className="mb-2">
          <Text className="text-text14 md:text-text15 text-text-300 font-sans">
            혹시 계정이 없나요?{" "}
            <Text className="text-text-100 text-text-300 font-sans">회원가입하기</Text>
          </Text>
        </Pressable>

        <Button onPress={handleLogin}>로그인</Button>
      </View>
    </View>
  );
};
