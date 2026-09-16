import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ImageUpload, LabelInput, Button } from '@/shared/ui';
import * as ImagePicker from 'expo-image-picker';
import BackIcon from '@/../assets/icons/back-icon.svg';

export const FridgeAddPage: React.FC = () => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [registeredDate, setRegisteredDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleImagePick = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRegister = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('알림', '식재료 이름을 입력해주세요.');
      return;
    }

    // TODO: API call to register ingredient
    console.log('등록:', { name, amount, price, registeredDate, expiryDate, imageUri });

    // Navigate back
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-20 px-7 gap-3">
          {/* Logo */}
          <View className="bg-neutral-50 h-[28px] w-[79px] items-center justify-center">
            <Text className="text-text14 text-neutral-300 font-medium font-sans">
              Logo
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-7 gap-10 pt-10">
          {/* Back Button */}
          <Pressable onPress={() => router.back()}>
            <BackIcon width={30} height={30} />
          </Pressable>

          {/* Image Upload & Form */}
          <View className="gap-6 w-full max-w-[346px]">
            {/* Image Upload */}
            <ImageUpload imageUri={imageUri} onPress={handleImagePick} />

            {/* Name Input with Divider */}
            <View className="gap-[5px] flex-row items-center">
              <TextInput
                className="text-title font-medium font-sans flex-1"
                style={{ fontFamily: 'Paperlogy' }}
                value={name}
                onChangeText={setName}
                placeholder="입력해주세요"
                placeholderTextColor="#878787"
              />
            </View>

            {/* Form Inputs */}
            <View className="gap-4">
              <LabelInput
                label="양"
                value={amount}
                onChangeText={setAmount}
                placeholder="입력하세요"
              />
              <LabelInput
                label="가격"
                value={price}
                onChangeText={setPrice}
                placeholder="입력하세요"
                keyboardType="numeric"
              />
              <LabelInput
                label="등록일자"
                value={registeredDate}
                onChangeText={setRegisteredDate}
                placeholder="입력하세요"
              />
              <LabelInput
                label="소비기한"
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="입력하세요"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Register Button */}
      <View className="px-12 pb-[100px] items-center">
        <Button onPress={handleRegister}>
          등록하기
        </Button>
      </View>
    </View>
  );
};
