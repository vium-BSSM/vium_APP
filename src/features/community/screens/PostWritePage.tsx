import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppTextInput, BackHeader, Button, HeaderActions, SegmentedControl } from '@/shared/ui';
import { useMyProfile } from '@/features/account';
import { useIngredientsList } from '@/features/fridge';
import { Alert } from '@/shared/lib/alert';
import { useCurrentLocation } from '@/shared/lib/useCurrentLocation';
import { formatDday, formatDotDate, getDaysLeft } from '@/shared/lib/dateFormat';
import CameraLineIcon from '@/../assets/icons/camera-line-icon.svg';
import { DESCRIPTION_MAX_LENGTH, MAX_POST_IMAGES, TITLE_MAX_LENGTH, usePostWrite } from '../lib/usePostWrite';
import { STORAGE_METHOD_OPTIONS } from '../lib/communityFormat';
import { IngredientPickerSheet } from '../ui/IngredientPickerSheet';
import { PostType } from '../types';

const TYPE_OPTIONS: { key: PostType; label: string }[] = [
  { key: 'SHARE', label: '나눔 (무료)' },
  { key: 'SALE', label: '판매 (크레딧)' },
];

const OPENED_OPTIONS = [
  { key: 'closed', label: '미개봉' },
  { key: 'opened', label: '개봉' },
] as const;

const FieldLabel: React.FC<{ children: string }> = ({ children }) => (
  <Text className="text-text14 font-sans text-text-100">{children}</Text>
);

export const PostWritePage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useMyProfile();
  const params = useLocalSearchParams<{ inventoryItemId?: string }>();
  const { coords } = useCurrentLocation();
  const { items: fridgeItems, isLoading: isFridgeLoading } = useIngredientsList();
  const [inventoryItemId, setInventoryItemId] = useState<number | null>(
    params.inventoryItemId ? Number(params.inventoryItemId) : null
  );
  const [isPickerVisible, setIsPickerVisible] = useState(!params.inventoryItemId);
  const selected = fridgeItems.find((item) => item.id === inventoryItemId) ?? null;

  const form = usePostWrite({ inventoryItemId, defaultStorageMethodId: selected?.storageMethodId ?? null });

  // 게시할 수 없는 재료면 이유를 알려주고 다른 재료를 고르게 함
  useEffect(() => {
    if (form.ineligibleMessage) {
      Alert.alert('올릴 수 없는 재료예요', form.ineligibleMessage, [
        { text: '다른 재료 고르기', onPress: () => setIsPickerVisible(true) },
      ]);
    }
  }, [form.ineligibleMessage]);

  const handleSubmit = async () => {
    const postId = await form.submit(coords);
    if (postId !== null) router.replace(`/community/${postId}` as any);
  };

  const handleRemoveImage = (index: number) =>
    Alert.alert('사진 삭제', '이 사진을 뺄까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => form.removeImage(index) },
    ]);

  const saleDisabled = form.preview !== null && !form.preview.saleAllowed;

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      <View className="mt-2">
        <BackHeader title="나눔·판매 글쓰기" />
      </View>

      <ScrollView contentContainerClassName="px-screen md:px-10 lg:px-20 pt-6 pb-10 gap-[46px]" keyboardShouldPersistTaps="handled">
        <View className="gap-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2.5">
            <Pressable
              onPress={form.addImage}
              disabled={form.images.length >= MAX_POST_IMAGES}
              className="w-16 h-16 rounded-lg border border-neutral-50 items-center justify-center gap-0.5"
              accessibilityLabel="사진 추가"
            >
              <CameraLineIcon width={24} height={24} color="#737785" />
              <Text className="text-text12 font-sans text-text-300">
                {form.images.length}/{MAX_POST_IMAGES}
              </Text>
            </Pressable>
            {form.images.map((picked, index) => (
              <Pressable
                key={picked.image.uri}
                onPress={() => handleRemoveImage(index)}
                className="w-16 h-16 rounded-lg bg-neutral-10 overflow-hidden"
              >
                <Image source={{ uri: picked.image.uri }} contentFit="cover" className="w-full h-full" />
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={() => setIsPickerVisible(true)}
            className="flex-row items-center gap-2.5 px-[14px] py-3 rounded-lg bg-primary-100"
          >
            <View className="flex-1 gap-1.5">
              <Text className="text-text15 font-medium font-sans text-text-100">
                {selected ? `내 냉장고 · ${selected.title} ${selected.remainingQuantity}${selected.unit}` : '올릴 재료를 골라주세요'}
              </Text>
              {selected && (
                <Text className="text-text12 font-sans text-text-200">
                  소비기한 {formatDotDate(selected.expiresOn)} ({formatDday(getDaysLeft(selected.expiresOn))})
                </Text>
              )}
            </View>
            <Text className="text-text13 font-medium font-sans text-primary-700">{selected ? '변경' : '선택'}</Text>
          </Pressable>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <FieldLabel>거래 방식</FieldLabel>
            <SegmentedControl
              options={TYPE_OPTIONS}
              value={form.type}
              onChange={form.setType}
              disabledKeys={saleDisabled ? ['SALE'] : []}
            />
          </View>

          {form.type === 'SALE' && (
            <View className="gap-2">
              <FieldLabel>가격</FieldLabel>
              <View className="h-12 flex-row items-center px-[14px] rounded-lg bg-primary-200">
                <AppTextInput
                  value={form.price}
                  onChangeText={(text) => form.setPrice(text.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  placeholder={form.preview?.creditEstimate ? String(form.preview.creditEstimate.recommendedPrice) : '0'}
                  placeholderTextColor="#A7A9B5"
                  className="flex-1 text-text16 font-sans text-text-100"
                />
                <Text className="text-text15 font-sans text-text-200">크레딧</Text>
              </View>
              {form.priceError && <Text className="text-text12 font-sans text-status-danger-text">{form.priceError}</Text>}
            </View>
          )}

          <View className="flex-row gap-3">
            <View className="flex-1 gap-2">
              <FieldLabel>보관 방법</FieldLabel>
              <SegmentedControl
                options={[...STORAGE_METHOD_OPTIONS]}
                value={String(form.storageMethodId) as '1' | '2' | '3'}
                onChange={(key) => form.setStorageMethodId(Number(key) as 1 | 2 | 3)}
              />
            </View>
            <View className="flex-1 gap-2">
              <FieldLabel>개봉 여부</FieldLabel>
              <SegmentedControl
                options={[...OPENED_OPTIONS]}
                value={form.isOpened ? 'opened' : 'closed'}
                onChange={(key) => form.setIsOpened(key === 'opened')}
              />
            </View>
          </View>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <FieldLabel>제목</FieldLabel>
            <AppTextInput
              value={form.title}
              onChangeText={form.setTitle}
              maxLength={TITLE_MAX_LENGTH}
              placeholder="예: 우유 1L 팔아요"
              placeholderTextColor="#A7A9B5"
              className="h-12 px-[14px] rounded-lg bg-neutral-10 text-text15 font-sans text-text-100"
            />
          </View>
          <View className="gap-2">
            <FieldLabel>설명</FieldLabel>
            <AppTextInput
              value={form.description}
              onChangeText={form.setDescription}
              maxLength={DESCRIPTION_MAX_LENGTH}
              multiline
              placeholder="상태, 거래 가능한 시간 등을 적어주세요"
              placeholderTextColor="#A7A9B5"
              className="min-h-[42px] px-[14px] py-2.5 rounded-lg bg-neutral-10 text-text15 font-sans text-text-100"
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-screen md:px-10 lg:px-20 pt-3 bg-white" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <Button fullWidth onPress={handleSubmit} disabled={!form.canSubmit} loading={form.isSubmitting}>
          등록하기
        </Button>
      </View>

      <IngredientPickerSheet
        visible={isPickerVisible}
        items={fridgeItems}
        isLoading={isFridgeLoading}
        selectedId={inventoryItemId}
        onSelect={(item) => {
          setInventoryItemId(item.id);
          setIsPickerVisible(false);
        }}
        onClose={() => setIsPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};
