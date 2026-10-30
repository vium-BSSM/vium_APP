import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StateBall } from './StateBall';

interface CardProps {
  variant?: 'default' | 'empty';
  title?: string;
  subtitle?: string;
  image?: any;
  status?: '위험' | '보통' | '양호';
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
  if (variant === 'empty') {
    return (
      <Pressable onPress={onPress}>
        <View
          className="w-full aspect-[111/140] bg-white rounded-lg border-2 border-dashed border-neutral-300 items-center justify-center"
          style={style}
        >
          <Text className="text-neutral-300 text-heading-lg md:text-[28px] font-medium font-sans">+</Text>
        </View>
      </Pressable>
    );
  }

  const content = (
    <View className="w-full aspect-[111/140] bg-white rounded-lg border-2 border-neutral-100 p-2.5 gap-[7px]" style={style}>
      <View className="flex-1 w-full bg-neutral-10">
        {image && <Image source={image} contentFit="cover" className="w-full h-full" />}
      </View>

      <View className="gap-1">
        <View className="flex-row items-center justify-between gap-1">
          <Text
            className="text-black text-text14 md:text-text15 font-medium font-sans flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {visible && status && <StateBall state={status} />}
        </View>
        <Text
          className="text-black text-text10 md:text-text12 font-light font-sans"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
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
