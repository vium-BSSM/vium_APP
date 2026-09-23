import React from 'react';
import { Pressable, Text, View } from 'react-native';
import PlusIcon from '@/../assets/icons/plus-icon.svg';

interface RecipeIngredientCircleProps {
  name: string;
  onPress?: () => void;
  isAddButton?: boolean;
}

export const RecipeIngredientCircle: React.FC<RecipeIngredientCircleProps> = ({
  name,
  onPress,
  isAddButton = false,
}) => {
  const content = (
    <View className="items-center justify-center gap-3 w-[66px]">
      {isAddButton ? (
        <View className="w-[38px] h-[38px] rounded-full border-2 border-dashed border-neutral-200 items-center justify-center">
          <PlusIcon width={16} height={16} color="#767676" />
        </View>
      ) : (
        <View className="w-[38px] h-[38px] rounded-full bg-neutral-50" />
      )}
      <Text
        className="text-[12px] font-sans text-black text-center"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
};
