import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ShoppingCheckboxProps {
  checked: boolean;
}

export const ShoppingCheckbox: React.FC<ShoppingCheckboxProps> = ({ checked }) => {
  return (
    <View
      className={`w-6 h-6 rounded-md border-2 items-center justify-center ${
        checked ? 'bg-primary-600 border-primary-600' : 'bg-white border-neutral-100'
      }`}
    >
      {checked && (
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <Path
            d="M2.5 7.5L5.5 10.5L11.5 3.5"
            stroke="#FFFFFF"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  );
};
