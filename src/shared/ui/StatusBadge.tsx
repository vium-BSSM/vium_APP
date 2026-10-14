import React from 'react';
import { Text, View } from 'react-native';
interface StatusBadgeProps {
  status: '위험' | '보통' | '양호';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeColor = () => {
    switch (status) {
      case '위험':
        return 'bg-status-danger-bg';
      case '보통':
        return 'bg-status-normal-bg';
      case '양호':
        return 'bg-status-good-bg';
      default:
        return 'bg-neutral-100';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case '위험':
        return 'text-status-danger-text';
      case '보통':
        return 'text-status-normal-text';
      case '양호':
        return 'text-status-good-text';
      default:
        return 'text-text-200';
    }
  };

  return (
    <View className={`px-3.5 py-1.5 rounded-full ${getBadgeColor()}`}>
      <Text className={`text-text14 font-sans ${getTextColor()}`}>
        {status}
      </Text>
    </View>
  );
};
