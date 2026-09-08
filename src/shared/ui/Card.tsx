import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
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
    <View className="w-[111px] bg-white rounded-lg border border-neutral-50 overflow-hidden" style={style}>
      {/* Image Area */}
      <View className="w-full h-[90px] bg-neutral-10 items-center justify-center relative">
        {image ? (
          <Image source={image} contentFit="cover" className="w-full h-full" />
        ) : (
          <View className="w-full h-full bg-neutral-10" />
        )}

        {/* Status Ball - Top Right */}
        {visible && status && (
          <View className="absolute top-2 right-2">
            <StateBall state={status} />
          </View>
        )}
      </View>

      {/* Text Area */}
      <View className="p-2">
        <Text className="text-text-100 text-text14 font-medium font-sans mb-0.5">
          {title}
        </Text>
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
