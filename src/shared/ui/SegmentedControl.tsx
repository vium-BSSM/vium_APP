import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { TabOption } from './UnderlineTabs';

interface SegmentedControlProps<T extends string> {
  options: TabOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabledKeys?: T[];
  className?: string;
}

/** Figma segmented — 회색 트랙 안에서 선택된 칸만 흰색 */
export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  disabledKeys = [],
  className = '',
}: SegmentedControlProps<T>) => (
  <View className={`flex-row gap-1 p-1 rounded-lg bg-neutral-10 ${className}`}>
    {options.map((option) => {
      const selected = option.key === value;
      const disabled = disabledKeys.includes(option.key);
      return (
        <Pressable
          key={option.key}
          onPress={() => onChange(option.key)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ selected, disabled }}
          className={`flex-1 items-center py-2 rounded-md ${selected ? 'bg-white' : ''} ${disabled ? 'opacity-40' : ''}`}
        >
          <Text
            className={`text-text14 font-sans ${selected ? 'text-text-100 font-medium' : 'text-text-200'}`}
          >
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
