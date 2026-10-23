import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';

interface FridgeCleanupModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const FridgeCleanupModal: React.FC<FridgeCleanupModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50 items-center justify-center py-10" onPress={onClose}>
        <Pressable
          className="bg-white rounded-lg items-center justify-center gap-[31px] px-[30px] pt-[30px] pb-[25px]"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="items-center gap-[14px]">
            <Text className="text-heading-lg font-medium font-sans text-text-100 text-center">냉장고 정리</Text>
            <Text className="text-text14 font-sans text-text-200 text-center w-[244px]">
              냉장고 정리란, 한 번에 다 먹은 음식을{'\n'}선택하여 제거할 수 있는 기능입니다.
            </Text>
          </View>

          <Pressable
            className="bg-primary-400 rounded-2xl items-center justify-center p-2.5 w-[256px]"
            onPress={onConfirm}
          >
            <Text className="text-text15 font-sans text-black text-center">계속진행</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
