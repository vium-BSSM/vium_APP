import React from 'react';
import { View, Text, Pressable } from 'react-native';
import TomatoImage from '@/../assets/tomato.svg';
import PotatoImage from '@/../assets/potato.svg';
import OnionImage from '@/../assets/onion.svg';

interface BannerProps {
  variant?: 'tomato' | 'potato' | 'onion';
  onPress?: () => void;
  style?: any;
}

export const Banner: React.FC<BannerProps> = ({ variant = 'tomato', onPress, style }) => {
  const getContent = () => {
    switch (variant) {
      case 'tomato':
        return {
          subtitle: '냉털 레시피를 추천 받을까요?',
          title1: '지금 무지방 우유의 ',
          title2: '소비기한이 3일 남았어요!',
          action: '레시피 바로가기 >',
          ImageComponent: TomatoImage,
          imageSize: { width: 104, height: 114 },
        };
      case 'potato':
        return {
          subtitle: '이번달 리포트를 확인할까요?',
          title1: '이번달에 가장',
          title2: '많이 남긴 음식은 뭘까요?',
          action: '리포트 바로가기 >',
          ImageComponent: PotatoImage,
          imageSize: { width: 104, height: 114 },
        };
      case 'onion':
        return {
          subtitle: '장보기 추천을 받아보실래요?',
          title1: '곧 마트를 가야할',
          title2: '시기네요!',
          action: '추천 장보기 목록 >',
          ImageComponent: OnionImage,
          imageSize: { width: 100, height: 136 },
        };
    }
  };

  const content = getContent();
  const activeIndex = variant === 'tomato' ? 0 : variant === 'potato' ? 1 : 2;

  return (
    <View className="w-[361px]" style={style}>
      <Pressable
        className="bg-primary-400 rounded-lg px-5 py-2.5 flex-row items-center justify-between h-[162px]"
        onPress={onPress}
      >
        <View className="flex-1 justify-between h-full py-2">
          <View>
            <Text className="text-text-50 text-[14px] mb-1 font-sans">
              {content.subtitle}
            </Text>
            <Text className="text-text-100 text-subtitle font-medium font-sans">
              {content.title1}
            </Text>
            <Text className="text-text-100 text-subtitle font-medium font-sans">
              {content.title2}
            </Text>
          </View>
          <Text className="text-text-50 text-[12px] font-sans">
            {content.action}
          </Text>
        </View>
        <content.ImageComponent {...content.imageSize} />
      </Pressable>

      <View className="flex-row items-center justify-center gap-[11px] mt-[19px]">
        <View className={`h-[14px] rounded-full ${activeIndex === 0 ? 'w-[22px] bg-neutral-100' : 'w-[14px] bg-neutral-50'}`} />
        <View className={`h-[14px] rounded-full ${activeIndex === 1 ? 'w-[22px] bg-neutral-100' : 'w-[14px] bg-neutral-50'}`} />
        <View className={`h-[14px] rounded-full ${activeIndex === 2 ? 'w-[22px] bg-neutral-100' : 'w-[14px] bg-neutral-50'}`} />
      </View>
    </View>
  );
};
