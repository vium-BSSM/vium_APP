import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AppHeader, BackTitle } from '@/shared/ui';
import { FridgeSortType } from '../types';

const SORT_OPTIONS: { type: FridgeSortType; label: string }[] = [
  { type: 'expiry', label: '소비기한 순' },
  { type: 'recent', label: '추가 순' },
];

interface FridgeHeaderProps {
  title: string;
  onBackPress: () => void;
  onManagePress: () => void;
  sortType: FridgeSortType;
  onSortChange: (sortType: FridgeSortType) => void;
}

export const FridgeHeader: React.FC<FridgeHeaderProps> = ({
  title,
  onBackPress,
  onManagePress,
  sortType,
  onSortChange,
}) => {
  return (
    <View>
      <AppHeader />
      <View className="px-screen md:px-8 lg:px-16 pt-10 pb-4 max-w-[1200px] mx-auto w-full">
        <BackTitle title={title} onPress={onBackPress} className="mb-[27px]" />

      {/* 관리 모드 헤더(FridgePage)와 높이를 h-10으로 맞춰 모드 전환 시 아래 요소가 밀리지 않게 함 */}
      <View className="flex-row items-center justify-between h-10">
        <View className="flex-row items-center pl-[10px]">
          {SORT_OPTIONS.map(({ type, label }, index) => (
            <React.Fragment key={type}>
              {index > 0 && <Text className="mx-2 text-text-200 text-text14 font-sans">|</Text>}
              <Pressable onPress={() => onSortChange(type)} hitSlop={8}>
                <Text
                  className={`text-text14 md:text-text15 font-sans ${
                    sortType === type ? 'text-text-100' : 'text-text-200'
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>

        <Pressable onPress={onManagePress} hitSlop={8} className="px-4">
          <Text className="text-text-200 text-text14 md:text-text15 font-sans">관리하기 {'>'}</Text>
        </Pressable>
      </View>
      </View>
    </View>
  );
};
