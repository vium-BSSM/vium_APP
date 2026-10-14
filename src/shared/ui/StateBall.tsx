import React from 'react';
import { View } from 'react-native';

interface StateBallProps {
  state?: '위험' | '보통' | '양호';
  style?: any;
}

export const StateBall: React.FC<StateBallProps> = ({ state = '위험', style }) => {
  const getBackgroundColor = () => {
    switch (state) {
      case '양호':
        return 'bg-status-good';
      case '보통':
        return 'bg-status-normal';
      case '위험':
      default:
        return 'bg-status-danger';
    }
  };

  return (
    <View
      className={`w-[10px] h-[10px] rounded-full ${getBackgroundColor()}`}
      style={style}
    />
  );
};
