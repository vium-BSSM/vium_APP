import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { PillButton } from '@/shared/ui';
import { formatDday } from '@/shared/lib/dateFormat';
import { ExpiryPopupItem } from '../types';

interface ExpiryPopupModalProps {
  visible: boolean;
  items: ExpiryPopupItem[];
  onClose: () => void;
  onHideToday: () => void;
  onShare: (item: ExpiryPopupItem) => void;
  onSeeRecipes: () => void;
}

// 하루 이하로 남으면 위험(분홍), 그 외 보통(주황)
const ddayClass = (daysLeft: number) =>
  daysLeft <= 1
    ? { box: 'bg-status-danger-bg', text: 'text-status-danger-text' }
    : { box: 'bg-status-normal-bg', text: 'text-status-normal-text' };

/** Figma notification/expiry-popup — 소비기한 임박 재료 목록 + 나눔하기 */
export const ExpiryPopupModal: React.FC<ExpiryPopupModalProps> = ({
  visible,
  items,
  onClose,
  onHideToday,
  onShare,
  onSeeRecipes,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable className="flex-1 bg-black/50 justify-center px-screen" onPress={onClose}>
      <Pressable
        className="bg-white rounded-lg px-6 pt-7 pb-5 gap-5 w-full max-w-[420px] self-center"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="gap-1.5">
          <Text className="text-heading-md font-medium font-sans text-text-100">소비기한이 얼마 안 남았어요</Text>
          <Text className="text-text14 font-sans text-text-200">버리기 전에 요리하거나 이웃에게 나눠보세요</Text>
        </View>

        <View className="gap-2">
          {items.map((item) => {
            const dday = ddayClass(item.daysLeft);
            return (
              <View key={item.inventoryItemId} className="flex-row items-center gap-2.5 pl-[14px] pr-2.5 py-2.5 rounded-lg">
                <View className={`px-1.5 py-0.5 rounded ${dday.box}`}>
                  <Text className={`text-text12 font-bold font-sans ${dday.text}`}>{formatDday(item.daysLeft)}</Text>
                </View>
                <Text className="flex-1 text-text15 font-sans text-text-100" numberOfLines={1}>
                  {item.name}
                </Text>
                <Pressable
                  onPress={() => onShare(item)}
                  className="px-2.5 py-[5px] rounded-[14px] bg-primary-200 border border-primary-500"
                >
                  <Text className="text-text12 font-sans text-primary-700">나눔하기</Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View className="gap-3">
          <PillButton label="이 재료로 레시피 보기" onPress={onSeeRecipes} />
          <Pressable onPress={onHideToday} hitSlop={8}>
            <Text className="text-text14 font-sans text-text-300 text-center">오늘은 그만 보기</Text>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);
