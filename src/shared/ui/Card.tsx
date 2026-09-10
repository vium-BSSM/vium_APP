import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StateBall } from './StateBall';

interface CardProps {
  variant?: 'default' | 'empty';
  title?: string;
  subtitle?: string;
  image?: any;
  status?: '위험' | '보통' | '굿';
  visible?: boolean;
  onPress?: () => void;
  style?: any;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  title,
  subtitle,
  image,
  status,
  visible = true,
  onPress,
  style,
}) => {
  // Empty Card (Add New Card)
  if (variant === 'empty') {
    return (
      <Pressable onPress={onPress}>
        <View
          className="w-[111px] h-[140px] bg-white rounded-lg border-2 border-dashed border-neutral-100 items-center justify-center"
          style={style}
        >
          <Text className="text-neutral-300 text-[40px] font-sans">+</Text>
        </View>
      </Pressable>
    );
  }

  // Default Card
  const content = (
    <View className="w-[111px] bg-white rounded-lg border-2 border-neutral-400" style={style}>
      {/* Image Area with padding */}
      <View className="p-2">
        <View className="w-full h-[90px] bg-neutral-10 rounded items-center justify-center">
          {image ? (
            <Image source={image} contentFit="cover" className="w-full h-full rounded" />
          ) : (
            <View className="w-full h-full bg-neutral-10 rounded" />
          )}
        </View>
      </View>

      {/* Text Area with Status Ball */}
      <View className="px-2 pb-2">
        <View className="flex-row items-center justify-between mb-0.5">
          <Text className="text-text-100 text-text14 font-medium font-sans flex-1">
            {title}
          </Text>
          {visible && status && (
            <View className="ml-1">
              <StateBall state={status} />
            </View>
          )}
        </View>
        <Text className="text-text-200 text-[12px] font-sans">
          {subtitle}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
};
