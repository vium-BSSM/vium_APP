import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';

const MAX_CHIPS = 3;

interface RecommendRecipeCardProps {
  title: string;
  image?: string;
  ingredientNames: string[];
  /** 소비기한 임박 재료 이름 — 초록 칩으로 강조 */
  expiringNames: Set<string>;
  onPress: () => void;
}

export const RecommendRecipeCard: React.FC<RecommendRecipeCardProps> = ({
  title,
  image,
  ingredientNames,
  expiringNames,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} className="bg-text-400 rounded-lg p-2.5 w-[114px] h-[156px] overflow-hidden gap-2">
      <View className="h-[49px] w-full rounded bg-neutral-10 overflow-hidden">
        {image && <Image source={{ uri: image }} contentFit="cover" className="w-full h-full" />}
      </View>

      <View className="h-[79px] justify-between">
        <View className="gap-1">
          <Text className="text-black text-text14 font-sans" numberOfLines={1}>
            {title}
          </Text>
          <View className="flex-row gap-1 overflow-hidden">
            {ingredientNames.slice(0, MAX_CHIPS).map((name) => {
              const isExpiring = expiringNames.has(name);
              return (
                <View
                  key={name}
                  className={`px-1 py-0.5 rounded-lg ${isExpiring ? 'bg-primary-200' : 'bg-neutral-50'}`}
                >
                  <Text
                    className={`text-text10 font-sans ${isExpiring ? 'text-primary-700' : 'text-text-200'}`}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <Text className="text-text-200 text-text10 font-sans">보유 재료 {ingredientNames.length}개 사용</Text>
      </View>
    </Pressable>
  );
};
