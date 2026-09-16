import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface LabelInputProps extends TextInputProps {
  label: string;
  style?: any;
}

export const LabelInput: React.FC<LabelInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = '입력하세요',
  style,
  ...props
}) => {
  return (
    <View className="flex-row items-center justify-between" style={style}>
      <Text className="text-text16 text-neutral-200 font-medium font-sans">
        {label}
      </Text>
      <View className="bg-neutral-50 rounded-lg px-2.5 h-[27px] w-[199px] justify-center">
        <TextInput
          className="text-text15 font-sans"
          style={{ color: value ? '#242529' : '#767676', fontFamily: 'Paperlogy' }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#767676"
          {...props}
        />
      </View>
    </View>
  );
};
