import React from 'react';
import { View } from 'react-native';
import { ReportPage as ReportPageFeature } from '@/features/report';
import { BottomNavigation } from '@/widgets';

export const ReportPage: React.FC = () => {
  return (
    <View className="flex-1 bg-white">
      <ReportPageFeature />
      <BottomNavigation />
    </View>
  );
};
