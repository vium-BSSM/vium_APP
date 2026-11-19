import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Keyboard } from 'react-native';
import { AppTextInput } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { pickImageFromLibrary } from '@/shared/lib/pickImage';
import {
  ImageUpload,
  LabelInput,
  LabelInputWithUnit,
  DatePicker,
  Button,
  AppHeader,
  Coachmark,
  CoachmarkStep,
} from '@/shared/ui';
import { useIngredientRegister } from '../lib/useIngredientRegister';
import { toDateString } from '../lib/dateUtils';
import { StorageMethodSelect, STORAGE_METHOD_OPTIONS } from '../ui/StorageMethodSelect';
import { useIngredientCatalogSearch } from '../lib/useIngredientCatalogSearch';
import { CatalogSuggestions } from '../ui/CatalogSuggestions';
import { IngredientCatalogItem } from '../types';
import { useCoachmarkSeen } from '@/shared/lib/hooks/useCoachmarkSeen';
import BackIcon from '@/../assets/icons/back-icon.svg';
import CharacterTomato from '@/../assets/splash/character-tomato.svg';

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

  // 첫 진입 튜토리얼 — 재료 이름 → 소비기한
  const nameInputRef = useRef<View>(null);
  const expiryRef = useRef<View>(null);
  const coachmark = useCoachmarkSeen('fridgeAdd');
  const coachmarkSteps: CoachmarkStep[] = [
    {
      targetRef: nameInputRef,
      speaker: '토마토',
      message: '재료 이름을 쓰고 목록에서 골라줘.\n그래야 레시피 추천에 쓸 수 있어!',
      character: <CharacterTomato width={62} height={66} />,
    },
    {
      targetRef: expiryRef,
      speaker: '토마토',
      message: '소비기한을 넣어두면\n다가올 때 미리 알려줄게!',
      character: <CharacterTomato width={62} height={66} />,
    },
  ];

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
          <Pressable onPress={() => router.back()} hitSlop={8} className="self-start">
            <BackIcon width={30} height={30} />
          </Pressable>

          <View className="gap-6 w-full max-w-[346px]">
            <ImageUpload imageUri={imageUri} onPress={handleImagePick} />

            <View ref={nameInputRef} collapsable={false} className="gap-2">
              <AppTextInput
                className="text-heading-lg font-medium font-sans"
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
              <View ref={expiryRef} collapsable={false}>
                <DatePicker
                  label="소비기한"
                  value={expiryDate}
                  onChange={setExpiryDate}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="w-full items-center pb-[100px]">
        <Button onPress={handleRegister} loading={isLoading}>
          등록하기
        </Button>
      </View>

      <Coachmark visible={coachmark.shouldShow} steps={coachmarkSteps} onFinish={coachmark.markSeen} />
    </View>
  );
};
