import React from 'react';
import { Text, View } from 'react-native';
import { FridgeItemStatus } from '@/shared/types/fridge';

interface StatusBadgeProps {
  status: FridgeItemStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeColor = () => {
    switch (status) {
      case '위험':
        return 'bg-[#FFE5EF]';
      case '보통':
        return 'bg-[#FFF4E5]';
      case '굿':
        return 'bg-[#E5F5FF]';
      default:
        return 'bg-neutral-100';
    }
  };

  const getTextColor = () => {
    switch (status) {
      case '위험':
        return 'text-[#FF3B8C]';
      case '보통':
        return 'text-[#FF9500]';
      case '굿':
        return 'text-[#007AFF]';
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
