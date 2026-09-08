import React from 'react';
import { View } from 'react-native';
import CheckIcon from '@/../assets/icons/check-icon.svg';
import CheckIconVariant from '@/../assets/icons/check-icon-variant.svg';

interface CheckProps {
  variant?: 'true' | 'false';
  style?: any;
}

export const Check: React.FC<CheckProps> = ({ variant = 'true', style }) => {
  const isVariant2 = variant === 'false';
  const Icon = isVariant2 ? CheckIconVariant : CheckIcon;

  return (
    <View style={style}>
      <Icon width={18} height={18} />
    </View>
  );
};
