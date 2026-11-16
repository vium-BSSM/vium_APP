import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface TabOption<T extends string> {
  key: T;
  label: string;
}

interface UnderlineTabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  // 탭 아래 전체 폭 구분선
  bordered?: boolean;
  className?: string;
}

/** Figma type tabs / role tabs — 선택된 탭에 2px 밑줄 */
export const UnderlineTabs = <T extends string>({
  options,
  value,
  onChange,
  bordered = false,
  className = '',
}: UnderlineTabsProps<T>) => (
  <View
    className={`flex-row gap-5 px-screen md:px-10 lg:px-20 ${bordered ? 'border-b border-neutral-50' : ''} ${className}`}
  >
    {options.map((option) => {
      const selected = option.key === value;
      return (
        <Pressable
          key={option.key}
          onPress={() => !selected && onChange(option.key)}
          accessibilityRole="tab"
          accessibilityState={{ selected }}
          className={`py-2 border-b-2 ${selected ? 'border-neutral-500' : 'border-transparent'}`}
        >
          <Text className={`text-text16 font-sans ${selected ? 'text-text-100' : 'text-text-300'}`}>
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
