import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Image, Alert } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import PhotoIcon from '@/../assets/icons/photo-icon.svg';

export const ProfilePage = () => {
  const [nickname, setNickname] = useState('');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  const handleNext = () => {
    // TODO: Save profile data
    router.push('/onboarding');
  };

  const handleClearNickname = () => {
    setNickname('');
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-5 md:px-10 lg:px-20 pt-[164px] items-center">
        <View className="w-full max-w-[480px]">
          <Text className="text-title md:text-[28px] lg:text-[32px] font-medium text-text-100 mb-[54px] font-sans text-left">
            환영합니다,{'\n'}어떤 이름으로 불러드릴까요?
          </Text>

          <View className="items-center">
            <View className="items-center">
              <View className="relative w-[117px] h-[117px] md:w-[140px] md:h-[140px] mb-[42px]">
                <View className="w-full h-full bg-neutral-100 rounded-full overflow-hidden">
                  {profileImageUri && (
                    <Image
                      source={{ uri: profileImageUri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  )}
                </View>

                <Pressable
                  onPress={handleImagePick}
                  className="absolute bottom-0 right-0 w-[36px] h-[36px] md:w-[42px] md:h-[42px]"
                >
                  <PhotoIcon width="100%" height="100%" />
                </Pressable>
              </View>

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
        </View>
      </View>

      <View className="w-full items-center pb-[100px]">
        <Text className="text-text14 md:text-text15 text-text-300 mb-2 font-sans text-center">
          지금 정한 이름은 나중에 수정할 수 있어요
        </Text>

        <Button onPress={handleNext}>
          다음
        </Button>
      </View>
    </View>
  );
};
