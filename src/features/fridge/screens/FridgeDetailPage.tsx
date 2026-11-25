import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBadge, DetailInfoRow, AppHeader } from '@/shared/ui';
import { useIngredientDetail } from '../lib/useIngredientDetail';
import { getIngredientImage } from '../lib/ingredientImageFixtures';
import BackIcon from '@/../assets/icons/back-icon.svg';
import EditIcon from '@/../assets/icons/edit-icon.svg';
import ShareIcon from '@/../assets/icons/share-icon.svg';

export const FridgeDetailPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const itemId = parseInt(id || '1', 10);
  const { item, isLoading, error } = useIngredientDetail(itemId);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#A2CD87" />
        <Text className="mt-4 text-text14 text-text-200 font-sans">재료 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-text16 font-sans text-text-100 font-semibold mb-2">오류 발생</Text>
        <Text className="text-text14 font-sans text-text-200">
          {error || '아이템을 찾을 수 없습니다.'}
        </Text>
      </View>
    );
  }

  const detailImage = item.uploadedImageUrl ?? getIngredientImage(item.title, 'large');

  return (
    <View className="flex-1 bg-white">
      {/* 하단 탭(약 140)에 버튼이 가리지 않도록 아래 여백 확보 */}
      <ScrollView className="flex-1" contentContainerClassName="pb-[140px]">
        <AppHeader />

        <View className="px-screen pt-8">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={8}
              className="w-[30px] h-[30px] items-center justify-center"
            >
              <BackIcon width={30} height={30} />
            </TouchableOpacity>

            {/* 나눔·판매 글쓰기로 이동 — 이 재료가 미리 선택된 상태로 열림 */}
            <Pressable
              onPress={() =>
                router.navigate({ pathname: '/community/write', params: { inventoryItemId: String(itemId) } } as any)
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="이웃에게 나눔하기"
              className="w-[30px] h-[30px] items-center justify-center"
            >
              <ShareIcon width={24} height={24} color="#767676" />
            </Pressable>
          </View>

          <View className="pt-[41px]">
            <View className="w-full h-[241px] rounded-2xl overflow-hidden bg-neutral-10 items-center justify-center">
              {/* 직접 올린 사진은 칸을 꽉 채우고, 기본 이미지(배경 없는 재료 그림)는 가운데 작게 */}
              {item.uploadedImageUrl ? (
                <Image source={{ uri: item.uploadedImageUrl }} contentFit="cover" className="w-full h-full" />
              ) : (
                detailImage && <Image source={{ uri: detailImage }} contentFit="contain" className="w-[70%] h-[80%]" />
              )}
            </View>

            <View className="pt-6 px-2.5">
              <View className="flex-row justify-between items-center h-8 mb-[32px]">
                <View className="flex-row items-center gap-2 flex-1 mr-3">
                  <Text numberOfLines={1} className="text-heading-lg font-bold font-sans text-text-100 shrink">
                    {item.title}
                  </Text>
                  <Pressable
                    onPress={() => router.push(`/fridge/${itemId}/edit` as any)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="식재료 수정"
                  >
                    <EditIcon width={22} height={22} color="#767676" />
                  </Pressable>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View className="gap-y-4">
                <DetailInfoRow label="양" value={item.quantity} />
                <DetailInfoRow label="가격" value={item.price} />
                <DetailInfoRow label="등록일자" value={item.registeredDate} />
                <DetailInfoRow label="소비기한" value={item.expirationDate} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

    </View>
  );
};
