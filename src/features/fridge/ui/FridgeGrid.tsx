import React, { ReactNode } from 'react';
import { View, ScrollView } from 'react-native';
import { Card } from '@/shared/ui';

interface FridgeItem {
  id: number;
  title: string;
  subtitle: string;
  status: '위험' | '보통' | '양호';
  image?: any;
}

interface FridgeGridProps {
  items: FridgeItem[];
  /** 그리드 위에 함께 스크롤되는 영역 */
  header?: ReactNode;
  onAddPress: () => void;
  onItemPress: (item: FridgeItem) => void;
}

export const FridgeGrid: React.FC<FridgeGridProps> = ({
  items,
  header,
  onAddPress,
  onItemPress,
}) => {
  return (
    <ScrollView className="flex-1 px-screen md:px-8 lg:px-16" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="max-w-[1200px] mx-auto w-full">
        {header}
        <View className="flex-row flex-wrap -mx-1.5">
          <View className="mb-[13px] px-1.5 w-1/3 md:w-1/4 lg:w-1/5">
            <Card variant="empty" onPress={onAddPress} />
          </View>

          {items.map((item) => (
            <View key={item.id} className="mb-[13px] px-1.5 w-1/3 md:w-1/4 lg:w-1/5">
              <Card
                title={item.title}
                subtitle={item.subtitle}
                status={item.status}
                image={item.image}
                visible={true}
                onPress={() => onItemPress(item)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
