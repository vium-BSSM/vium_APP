import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

interface AvatarProps {
  uri?: string | null;
  // 32(채팅 말풍선), 40(작성자), 48(채팅 목록), 64(후기)
  size: 30 | 32 | 40 | 48 | 64;
}

const SIZE_CLASS: Record<AvatarProps['size'], string> = {
  30: 'w-[30px] h-[30px]',
  32: 'w-8 h-8',
  40: 'w-10 h-10',
  48: 'w-12 h-12',
  64: 'w-16 h-16',
};

/** 원형 프로필 사진 — 사진이 없으면 회색 원 */
export const Avatar: React.FC<AvatarProps> = ({ uri, size }) => (
  <View className={`${SIZE_CLASS[size]} rounded-full overflow-hidden bg-neutral-50`}>
    {uri ? <Image source={{ uri }} contentFit="cover" className="w-full h-full" /> : null}
  </View>
);
