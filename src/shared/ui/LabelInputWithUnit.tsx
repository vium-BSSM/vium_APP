import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { UNIT_OPTIONS, UnitOption, UnitPickerModal } from './UnitPickerModal';

interface LabelInputWithUnitProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  unitId: number;
  onUnitChange: (unitId: number, unitLabel: string) => void;
  style?: any;
}

export const LabelInputWithUnit: React.FC<LabelInputWithUnitProps> = ({
  label,
  value,
  onChangeText,
  unitId,
  onUnitChange,
  placeholder = '입력하세요',
  style,
  ...props
}) => {
  const [showUnitModal, setShowUnitModal] = useState(false);

  const handleUnitSelect = (option: UnitOption) => {
    onUnitChange(option.id, option.label);
    setShowUnitModal(false);
  };

  const selectedUnit = UNIT_OPTIONS.find(opt => opt.id === unitId);

  return (
    <>
      <View className="flex-row items-center justify-between" style={style}>
        <Text className="text-text16 text-neutral-200 font-medium font-sans">
          {label}
        </Text>
        <View className="flex-row gap-2 items-center">
          <View className="bg-neutral-50 rounded-lg px-2.5 h-[27px] w-[139px] justify-center">
            <TextInput
              className="text-text15 font-sans"
              style={{ color: value ? '#242529' : '#767676', fontFamily: 'Paperlogy' }}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#767676"
              keyboardType="numeric"
              {...props}
            />
          </View>
          <Pressable
            className="bg-neutral-50 rounded-lg px-2.5 h-[27px] w-[50px] justify-center items-center"
            onPress={() => setShowUnitModal(true)}
          >
            <Text className="text-text15 font-sans" style={{ color: selectedUnit ? '#242529' : '#767676' }}>
              {selectedUnit?.label || '단위'}
            </Text>
          </Pressable>
        </View>
      </View>

      <UnitPickerModal
        visible={showUnitModal}
        selectedUnitId={unitId}
        onSelect={handleUnitSelect}
        onClose={() => setShowUnitModal(false)}
      />
    </>
  );
};
