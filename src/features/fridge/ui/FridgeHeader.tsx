import React, { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FridgeSortType, FridgeStorageFilter } from '../types';
import { STORAGE_METHOD_OPTIONS } from './StorageMethodSelect';
import ArrowIcon from '@/../assets/icons/outlined-left-icon.svg';
import SortArrowIcon from '@/../assets/icons/outlined-left-small-icon.svg';
import TrashIcon from '@/../assets/icons/trash-icon.svg';

const STORAGE_FILTERS: { value: FridgeStorageFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  ...STORAGE_METHOD_OPTIONS.map((option) => ({ value: option.id, label: option.label })),
];

const SORT_LABEL: Record<FridgeSortType, string> = {
  expiry: '임박순',
  recent: '추가순',
};

interface FridgeHeaderProps {
  /** 가장 임박한 재료 문구 — 없으면 배너 숨김 */
  expiringTitle: string | null;
  onBannerPress: () => void;
  /** 배너 아래 줄 (필터·정렬 또는 선택 상태) */
  children: ReactNode;
}

/** 냉장고 그리드 위: 임박 재료 배너 + 툴바 */
export const FridgeHeader: React.FC<FridgeHeaderProps> = ({ expiringTitle, onBannerPress, children }) => {
  return (
    <View className="gap-[53px]">
      {expiringTitle && (
        <Pressable
          onPress={onBannerPress}
          className="bg-primary-300 rounded-lg p-5 h-[86px] flex-row items-center gap-3"
        >
          <View className="flex-1 gap-2">
            <Text className="text-text-100 text-heading-md font-medium font-sans" numberOfLines={1}>
              {expiringTitle}
            </Text>
            <Text className="text-text-50 text-text12 font-sans">사용할 수 있는 레시피를 추천해드릴게요</Text>
          </View>
          <View className="rotate-180">
            <ArrowIcon width={24} height={24} />
          </View>
        </Pressable>
      )}

      {children}
    </View>
  );
};

interface FridgeFilterBarProps {
  storageFilter: FridgeStorageFilter;
  onStorageFilterChange: (filter: FridgeStorageFilter) => void;
  sortType: FridgeSortType;
  onSortToggle: () => void;
}

/** 일반 모드 툴바: 보관 방법 필터 + 정렬 */
export const FridgeFilterBar: React.FC<FridgeFilterBarProps> = ({
  storageFilter,
  onStorageFilterChange,
  sortType,
  onSortToggle,
}) => (
  <View className="flex-row items-center justify-between mb-[22px]">
    <View className="flex-row items-center gap-2">
      {STORAGE_FILTERS.map(({ value, label }) => {
        const isActive = storageFilter === value;
        return (
          <Pressable
            key={label}
            onPress={() => onStorageFilterChange(value)}
            className={`w-[55px] h-8 rounded-2xl items-center justify-center border-2 ${
              isActive ? 'bg-primary-300 border-primary-200' : 'bg-neutral-10 border-neutral-10'
            }`}
          >
            <Text className="text-text-50 text-text14 font-sans">{label}</Text>
          </Pressable>
        );
      })}
    </View>

    <Pressable onPress={onSortToggle} hitSlop={8} className="flex-row items-end gap-1">
      <Text className="text-text-100 text-text12 font-sans">{SORT_LABEL[sortType]}</Text>
      <View className="-rotate-90">
        <SortArrowIcon width={14} height={14} />
      </View>
    </Pressable>
  </View>
);

interface FridgeSelectionBarProps {
  selectedCount: number;
  isDeleting: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

/** 관리 모드 툴바: 선택 개수 + 취소·삭제 */
export const FridgeSelectionBar: React.FC<FridgeSelectionBarProps> = ({
  selectedCount,
  isDeleting,
  onDelete,
  onCancel,
}) => (
  <View className="flex-row items-center justify-between px-3 mb-8">
    <Text className="text-neutral-700 text-text14 font-sans">{selectedCount}개의 식재료가 선택됨</Text>
    <View className="flex-row items-center gap-4">
      <Pressable onPress={onCancel} hitSlop={8}>
        <Text className="text-text-200 text-text14 font-sans">취소</Text>
      </Pressable>
      <Pressable onPress={onDelete} disabled={isDeleting} hitSlop={8} className={isDeleting ? 'opacity-50' : ''}>
        <TrashIcon width={24} height={24} />
      </Pressable>
    </View>
  </View>
);
