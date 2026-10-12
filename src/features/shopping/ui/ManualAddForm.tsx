import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { UnitOption } from '@/shared/ui';
import { ManualShoppingItemInput } from '../types';
import { UnitPickerModal } from './UnitPickerModal';


const LABEL_CLASS = 'w-[76px] text-text16 font-medium font-sans text-neutral-300';
const INPUT_BOX_CLASS = 'h-10 rounded-lg bg-neutral-50 px-3 justify-center';

const INPUT_CLASS = 'flex-1 py-0 text-text15 font-sans text-text-100';
const PLACEHOLDER_COLOR = '#A1A1A1';

interface ManualAddFormProps {
  isSubmitting: boolean;

  onSubmit: (input: ManualShoppingItemInput) => Promise<string | null>;
  onError: (message: string) => void;
}

export const ManualAddForm: React.FC<ManualAddFormProps> = ({ isSubmitting, onSubmit, onError }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitId, setUnitId] = useState(0);
  const [unitLabel, setUnitLabel] = useState('');
  const [isUnitPickerOpen, setIsUnitPickerOpen] = useState(false);

  const reset = () => {
    setName('');
    setQuantity('');
    setUnitId(0);
    setUnitLabel('');
  };

  const handleUnitSelect = (option: UnitOption) => {
    setUnitId(option.id);
    setUnitLabel(option.label);
    setIsUnitPickerOpen(false);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      onError('재료명을 입력해 주세요.');
      return;
    }

 
    const trimmedQuantity = quantity.trim();
    let parsedQuantity: number | undefined;
    if (trimmedQuantity) {
      parsedQuantity = Number(trimmedQuantity);
      if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
        onError('양은 0보다 큰 숫자로 입력해 주세요.');
        return;
      }
      if (!unitId) {
        onError('단위를 선택해 주세요.');
        return;
      }
    }

    Keyboard.dismiss();
    const message = await onSubmit({
      name: trimmedName,
      quantity: parsedQuantity,
      unitId: parsedQuantity != null ? unitId : undefined,
      unitLabel: parsedQuantity != null ? unitLabel : undefined,
    });
    if (message) {
      onError(message);
    } else {
      reset();
    }
  };

  if (!isOpen) {
    return (
      <Pressable
        className="rounded-lg border border-dashed border-neutral-100 py-3 items-center"
        onPress={() => setIsOpen(true)}
      >
        <Text className="text-text14 font-medium font-sans text-text-200">+ 직접 추가하기</Text>
      </Pressable>
    );
  }

  return (
    <View className="rounded-lg bg-white border border-neutral-100 p-4 gap-3">
      <View className="flex-row items-center">
        <Text className={LABEL_CLASS}>재료명</Text>
        <View className={`flex-1 ${INPUT_BOX_CLASS}`}>
          <TextInput
            className={INPUT_CLASS}
            style={{ fontFamily: 'Paperlogy' }}
            value={name}
            onChangeText={setName}
            placeholder="예: 두부"
            placeholderTextColor={PLACEHOLDER_COLOR}
            maxLength={120}
            returnKeyType="done"
            textAlignVertical="center"
          />
        </View>
      </View>

      <View className="flex-row items-center">
        <Text className={LABEL_CLASS}>양 (선택)</Text>
        <View className="flex-1 flex-row gap-2">
          <View className={`flex-1 ${INPUT_BOX_CLASS}`}>
            <TextInput
              className={INPUT_CLASS}
              style={{ fontFamily: 'Paperlogy' }}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="숫자 입력"
              placeholderTextColor={PLACEHOLDER_COLOR}
              keyboardType="decimal-pad"
              textAlignVertical="center"
            />
          </View>
          <Pressable className={`w-[64px] items-center ${INPUT_BOX_CLASS}`} onPress={() => setIsUnitPickerOpen(true)}>
            <Text className={`text-text15 font-sans ${unitLabel ? 'text-text-100' : 'text-neutral-200'}`}>
              {unitLabel || '단위'}
            </Text>
          </Pressable>
        </View>
      </View>

      <UnitPickerModal
        visible={isUnitPickerOpen}
        selectedUnitId={unitId}
        onSelect={handleUnitSelect}
        onClose={() => setIsUnitPickerOpen(false)}
      />

      <View className="flex-row gap-2 mt-3">
        <Pressable
          className="flex-1 rounded-3xl bg-neutral-50 py-3 items-center"
          onPress={() => {
            reset();
            setIsOpen(false);
          }}
        >
          <Text className="text-text14 font-medium font-sans text-text-200">닫기</Text>
        </Pressable>
        <Pressable
          className={`flex-1 rounded-3xl bg-primary-500 py-3 items-center ${isSubmitting ? 'opacity-60' : ''}`}
          disabled={isSubmitting}
          onPress={handleSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#242529" />
          ) : (
            <Text className="text-text14 font-medium font-sans text-text-100">추가</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
