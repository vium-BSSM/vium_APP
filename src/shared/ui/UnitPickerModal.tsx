import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

export interface UnitOption {
  id: number;
  label: string;
}

// 백엔드 units 테이블 ID와 일치
export const UNIT_OPTIONS: UnitOption[] = [
  { id: 1, label: '개' },
  { id: 2, label: 'g' },
  { id: 3, label: 'kg' },
  { id: 4, label: 'ml' },
  { id: 5, label: 'L' },
  { id: 6, label: '팩' },
  { id: 7, label: '봉' },
  { id: 8, label: '병' },
  { id: 9, label: '캔' },
  { id: 10, label: '통' },
];

interface UnitPickerModalProps {
  visible: boolean;
  selectedUnitId: number;
  onSelect: (option: UnitOption) => void;
  onClose: () => void;
}

export const UnitPickerModal: React.FC<UnitPickerModalProps> = ({ visible, selectedUnitId, onSelect, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={onClose}>
        <Pressable className="bg-white rounded-2xl w-[280px] max-h-[400px]" onPress={(e) => e.stopPropagation()}>
          <View className="py-4 border-b border-neutral-100">
            <Text className="text-subtitle font-normal text-center font-sans text-text-100">단위 선택</Text>
          </View>
          <ScrollView className="max-h-[300px]">
            {UNIT_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                className="py-4 px-6 border-b border-neutral-50"
                onPress={() => onSelect(option)}
              >
                <Text
                  className={`text-text15 font-sans text-center ${selectedUnitId === option.id ? 'text-text-100' : 'text-neutral-300'}`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
