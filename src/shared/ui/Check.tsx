import React from 'react';
import { Image } from 'react-native';

const checkIcon = require('@/../assets/icons/check-icon.svg');
const checkIconVariant = require('@/../assets/icons/check-icon-variant.svg');

interface CheckProps {
  variant?: 'true' | 'false';
  style?: any;
}

export const Check: React.FC<CheckProps> = ({ variant = 'true', style }) => {
  const isVariant2 = variant === 'false';

  return (
    <Image
      source={isVariant2 ? checkIconVariant : checkIcon}
      className="w-[18px] h-[18px]"
      style={style}
      resizeMode="contain"
    />
  );
};
