import React, { useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Alert } from '@/shared/lib/alert';
import { useRouter } from 'expo-router';
import { useIngredientUpload } from '../lib/useIngredientUpload';
import { isReceiptScanSupported, useReceiptScan } from '../lib/useReceiptScan';
import { useIngredientsList } from '../lib/useIngredientsList';
import { useIngredientDispose } from '../lib/useIngredientDispose';
import { useFridgeCleanup } from '../lib/useFridgeCleanup';
import { formatExpiringTitle, pickExpiringIngredients } from '../lib/expiringIngredients';
import { FridgeHeader, FridgeFilterBar, FridgeSelectionBar } from '../ui/FridgeHeader';
import { FridgeGrid } from '../ui/FridgeGrid';
import { FridgeCleanupModal } from '../ui/FridgeCleanupModal';
import { FridgeStorageFilter } from '../types';
import { useMyProfile } from '@/features/account';
import { AddButton, Card, HomeHeader } from '@/shared/ui';

export const FridgePage = () => {
  const router = useRouter();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const { showIngredientUploadOptions } = useIngredientUpload();
  const { scanReceipt, isScanning } = useReceiptScan();
  const { items: fridgeItems, isLoading, error, refresh, sortType, setSortType } = useIngredientsList();
  const { disposeItems, isDisposing } = useIngredientDispose();
  const { isCleanupModalVisible, openCleanupModal, closeCleanupModal } = useFridgeCleanup();
  const { profile } = useMyProfile();
  // TODO: 목록 API(GET /api/me/ingredients)에 storageMethodId가 없어 필터는 선택 표시만 함 — 응답에 추가되면 fridgeItems를 걸러서 표시
  const [storageFilter, setStorageFilter] = useState<FridgeStorageFilter>('all');
  const expiringTitle = useMemo(() => formatExpiringTitle(pickExpiringIngredients(fridgeItems)), [fridgeItems]);

  const handleReceiptPress = () => {
    if (!isReceiptScanSupported) {
      Alert.alert('영수증 인식 불가', '웹에서는 영수증 인식을 지원하지 않아요. 앱에서 이용하거나 직접 등록해주세요.', [
        { text: '취소', style: 'cancel' },
        { text: '직접 등록', onPress: () => router.push('/fridge/add' as any) },
      ]);
      return;
    }

    showIngredientUploadOptions(async (image) => {
      const purchase = await scanReceipt(image);
      if (!purchase) return;

      // TODO: 확인 화면(디자인 대기)으로 이동 → 품목 확인·수정 후 confirmPurchase로 재고 등록
      console.log('영수증 인식 결과:', JSON.stringify(purchase, null, 2));
      const names = purchase.items.map((item) => item.ingredientName ?? `${item.rawName} (미확인)`);
      Alert.alert(`${purchase.items.length}개 품목 인식`, names.join('\n'));
    });
  };

  const handleToggleSelect = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDelete = () => {
    if (selectedItems.size === 0) {
      Alert.alert('알림', '삭제할 항목을 선택해주세요.');
      return;
    }

    Alert.alert(
      '삭제 확인',
      `선택한 ${selectedItems.size}개의 항목을 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const targets = fridgeItems.filter((item) => selectedItems.has(item.id));
            const failedCount = await disposeItems(targets);

            setSelectedItems(new Set());
            setIsDeleteMode(false);
            refresh();

            if (failedCount > 0) {
              Alert.alert('오류', `${failedCount}개 항목을 삭제하지 못했습니다. 다시 시도해주세요.`);
            }
          },
        },
      ]
    );
  };

  const handleBannerPress = () => router.navigate('/recipe' as any);

  const handleCancelDelete = () => {
    setSelectedItems(new Set());
    setIsDeleteMode(false);
  };

  const isReady = !isLoading && !error;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A2CD87" />
          <Text className="mt-4 text-text14 text-text-200 font-sans">재료를 불러오는 중...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center px-screen">
          <Text className="text-text16 text-text-100 font-semibold font-sans mb-2">오류 발생</Text>
          <Text className="text-text14 text-text-200 font-sans text-center">{error}</Text>
          <Pressable onPress={() => refresh()} hitSlop={8} className="mt-4">
            <Text className="text-text14 font-medium font-sans text-text-100">다시 시도</Text>
          </Pressable>
        </View>
      );
    }

    if (!isDeleteMode) {
      return (
        <FridgeGrid
          items={fridgeItems}
          header={
            <FridgeHeader expiringTitle={expiringTitle} onBannerPress={handleBannerPress}>
              <FridgeFilterBar
                storageFilter={storageFilter}
                onStorageFilterChange={setStorageFilter}
                sortType={sortType}
                onSortToggle={() => setSortType(sortType === 'expiry' ? 'recent' : 'expiry')}
              />
            </FridgeHeader>
          }
          onAddPress={() => router.push('/fridge/add' as any)}
          onItemPress={(item) => router.push(`/fridge/${item.id}` as any)}
        />
      );
    }

    return (
      <ScrollView
        className="flex-1 px-screen md:px-8 lg:px-16"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="max-w-[1200px] mx-auto w-full">
          <FridgeHeader expiringTitle={expiringTitle} onBannerPress={handleBannerPress}>
            <FridgeSelectionBar
              selectedCount={selectedItems.size}
              isDeleting={isDisposing}
              onDelete={handleDelete}
              onCancel={handleCancelDelete}
            />
          </FridgeHeader>
          <View className="flex-row flex-wrap -mx-1.5">
            {fridgeItems.map((item) => {
              const isSelected = selectedItems.has(item.id);

              return (
                <View key={item.id} className="mb-[13px] px-1.5 w-1/3 md:w-1/4 lg:w-1/5">
                  <Pressable onPress={() => handleToggleSelect(item.id)}>
                    <View className="relative">
                      <Card
                        title={item.title}
                        subtitle={item.subtitle}
                        status={item.status}
                        image={item.image}
                        visible={true}
                      />

                      <View
                        className={`absolute -top-1.5 -right-1.5 z-20 w-[17px] h-[17px] rounded-full border-2 border-primary-700 ${
                          isSelected ? 'bg-primary-600' : 'bg-white'
                        }`}
                      />
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="mb-[42px]">
        <HomeHeader activeTab="fridge" profileImageUrl={profile.profileImageUrl} />
      </View>

      {renderContent()}

      {/* AddButton - 일반 모드: 영수증 등록/냉장고 관리하기 메뉴, 삭제 모드: 냉장고 대청소 (목록을 불러온 뒤에만 표시) */}
      {isReady && (!isDeleteMode ? (
        <AddButton
          onReceiptPress={handleReceiptPress}
          onManagePress={() => setIsDeleteMode(true)}
          style={{ position: 'absolute', bottom: 120, right: 29 }}
        />
      ) : (
        <AddButton
          onPress={openCleanupModal}
          style={{ position: 'absolute', bottom: 120, right: 29 }}
        />
      ))}


      <FridgeCleanupModal
        visible={isCleanupModalVisible}
        onClose={closeCleanupModal}
        onConfirm={() => {
          closeCleanupModal();
          router.push('/fridge/cleanup/select' as any);
        }}
      />

      {/* 인식 중에는 버튼까지 덮어 중복 실행 방지 */}
      {isScanning && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-white/80">
          <ActivityIndicator size="large" color="#A2CD87" />
          <Text className="mt-4 text-text14 text-text-200 font-sans">영수증을 인식하는 중...</Text>
        </View>
      )}
    </View>
  );
};
