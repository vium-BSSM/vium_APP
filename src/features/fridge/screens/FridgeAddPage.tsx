import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { pickImageFromLibrary } from '@/shared/lib/pickImage';
import { ImageUpload, LabelInput, LabelInputWithUnit, DatePicker, Button, AppHeader } from '@/shared/ui';
import { useIngredientRegister } from '../lib/useIngredientRegister';
import { toDateString } from '../lib/dateUtils';
import { StorageMethodSelect, STORAGE_METHOD_OPTIONS } from '../ui/StorageMethodSelect';
import { useIngredientCatalogSearch } from '../lib/useIngredientCatalogSearch';
import { CatalogSuggestions } from '../ui/CatalogSuggestions';
import { IngredientCatalogItem } from '../types';
import BackIcon from '@/../assets/icons/back-icon.svg';

export const FridgeAddPage: React.FC = () => {
  const router = useRouter();
  const { register, isLoading } = useIngredientRegister();
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [catalogItem, setCatalogItem] = useState<IngredientCatalogItem | null>(null);
  const [amount, setAmount] = useState('');
  const [unitId, setUnitId] = useState(0);
  const [unitLabel, setUnitLabel] = useState('');
  const [storageMethodId, setStorageMethodId] = useState<number>(STORAGE_METHOD_OPTIONS[0].id);
  const [price, setPrice] = useState('');
  const [registeredDate, setRegisteredDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());

  const handleImagePick = async () => {
    const uri = await pickImageFromLibrary({ aspect: [16, 9] });
    if (uri) setImageUri(uri);
  };

  const { items: catalogItems, isLoading: isSearchingCatalog } = useIngredientCatalogSearch(name, catalogItem === null);

  // 카탈로그 재료를 고른 뒤 이름을 고치면 직접 입력 재료로 전환
  const handleNameChange = (text: string) => {
    setName(text);
    if (catalogItem && text !== catalogItem.name) setCatalogItem(null);
  };

  const handleSelectCatalog = (item: IngredientCatalogItem) => {
    setCatalogItem(item);
    setName(item.name);
    setUnitId(item.defaultUnitId);
    Keyboard.dismiss();
  };

  const handleUnitChange = (id: number, label: string) => {
    setUnitId(id);
    setUnitLabel(label);
  };

  const handleRegister = async () => {
    const success = await register({
      name,
      ingredientCatalogId: catalogItem?.ingredientCatalogId,
      amount,
      unitId,
      storageMethodId,
      price,
      registeredDate: toDateString(registeredDate),
      expiryDate: toDateString(expiryDate),
      imageUri,
    });

    if (success) {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <AppHeader />

        <View className="px-screen gap-10 pt-10">
          <Pressable onPress={() => router.back()}>
            <BackIcon width={30} height={30} />
          </Pressable>

          <View className="gap-6 w-full max-w-[346px]">
            <ImageUpload imageUri={imageUri} onPress={handleImagePick} />

            <View className="gap-2">
              <TextInput
                className="text-title font-medium font-sans"
                style={{ fontFamily: 'Paperlogy' }}
                value={name}
                onChangeText={handleNameChange}
                placeholder="입력해주세요"
                placeholderTextColor="#767676"
              />
              {catalogItem ? (
                <Text className="text-text14 font-sans text-primary-800">기본 식재료로 등록돼요 · 레시피 추천에 쓰여요</Text>
              ) : name.trim() ? (
                <CatalogSuggestions
                  items={catalogItems}
                  isLoading={isSearchingCatalog}
                  onSelect={handleSelectCatalog}
                />
              ) : null}
            </View>

            <View className="gap-4">
              <LabelInputWithUnit
                label="양"
                value={amount}
                onChangeText={setAmount}
                unitId={unitId}
                onUnitChange={handleUnitChange}
                placeholder="입력하세요"
              />
              <LabelInput
                label="가격"
                value={price}
                onChangeText={setPrice}
                placeholder="입력하세요"
                keyboardType="numeric"
              />
              <StorageMethodSelect label="보관방법" value={storageMethodId} onChange={setStorageMethodId} />
              <DatePicker
                label="등록일자"
                value={registeredDate}
                onChange={setRegisteredDate}
              />
              <DatePicker
                label="소비기한"
                value={expiryDate}
                onChange={setExpiryDate}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={handleRegister} loading={isLoading}>
          등록하기
        </Button>
      </View>
    </View>
  );
};
