import React from 'react';
import { View } from 'react-native';

interface StateBallProps {
  state?: '위험' | '보통' | '굿';
  style?: any;
}

export const StateBall: React.FC<StateBallProps> = ({ state = '위험', style }) => {
  const getBackgroundColor = () => {
    switch (state) {
      case '굿':
        return 'bg-[#88e0c3]';
      case '보통':
        return 'bg-[#fdcf73]';
      case '위험':
      default:
        return 'bg-[#ff7171]';
    }
  };

  return (
    <View
      className={`w-[10px] h-[10px] rounded-full ${getBackgroundColor()}`}
      style={style}
    />
  );
};
