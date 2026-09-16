import React from 'react';
import { View, Text } from 'react-native';

interface DetailInfoRowProps {
  label: string;
  value: string;
}

export const DetailInfoRow: React.FC<DetailInfoRowProps> = ({ label, value }) => {
  return (
    <View className="flex-row justify-between items-center h-[19px]">
      <Text className="text-text16 font-sans text-text-200">
        {label}
      </Text>
      <Text className="text-text15 font-sans text-text-100">
        {value}
      </Text>
    </View>
  );
};
