import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import PhotoIcon from '@/../assets/icons/photo-icon.svg';
import PlusIcon from '@/../assets/icons/plus-icon.svg';

interface AddButtonProps {
  icon?: 'photo' | 'plus';
  onReceiptPress?: () => void;
  onCartPress?: () => void;
  style?: any;
}

export const AddButton: React.FC<AddButtonProps> = ({
  icon = 'photo',
  onReceiptPress,
  onCartPress,
  style,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isPhoto = icon === 'photo';

  const handlePress = () => {
    if (isPhoto) {
      setShowMenu(!showMenu);
    }
  };

  return (
    <View className="relative items-end" style={style}>
      {showMenu && isPhoto && (
        <View className="absolute bottom-[53px] md:bottom-[60px] right-0 bg-white rounded-lg p-2.5 md:p-3 shadow-md w-[153px] md:w-[180px] z-10">
          <Pressable
            onPress={() => {
              setShowMenu(false);
              onReceiptPress?.();
            }}
          >
            <Text className="text-text-100 text-text14 md:text-text15 text-right font-sans">
              영수증 등록
            </Text>
          </Pressable>
          <View className="h-px bg-neutral-200 rounded-lg my-2" />
          <Pressable
            onPress={() => {
              setShowMenu(false);
              onCartPress?.();
            }}
          >
            <Text className="text-text-100 text-text14 md:text-text15 text-right font-sans">
              온라인 장바구니 등록
            </Text>
          </Pressable>
        </View>
      )}

      <Pressable
        className="w-[43px] h-[43px] md:w-[52px] md:h-[52px] bg-neutral-500 rounded-full items-center justify-center"
        onPress={handlePress}
      >
        {isPhoto ? (
          <PhotoIcon width={24} height={24} />
        ) : (
          <PlusIcon width={24} height={24} />
        )}
      </Pressable>
    </View>
  );
};
