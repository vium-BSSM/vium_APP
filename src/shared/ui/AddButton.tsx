import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import PlusIcon from '@/../assets/icons/plus-icon.svg';

interface AddButtonProps {
  /** 넘기면 메뉴 없이 바로 실행, 없으면 메뉴(영수증 등록 / 냉장고 관리하기)를 연다 */
  onPress?: () => void;
  onReceiptPress?: () => void;
  onManagePress?: () => void;
  style?: any;
}

const MenuItem: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <Pressable onPress={onPress} hitSlop={{ top: 4, bottom: 4 }} className="p-[5px] rounded-lg active:bg-neutral-10">
    <Text className="text-black text-text14 md:text-text15 leading-tight font-sans">
      {label}
    </Text>
  </Pressable>
);

export const AddButton: React.FC<AddButtonProps> = ({
  onPress,
  onReceiptPress,
  onManagePress,
  style,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setShowMenu(!showMenu);
    }
  };

  const selectMenu = (action?: () => void) => {
    setShowMenu(false);
    action?.();
  };

  return (
    <View className="relative items-end" style={style}>
      {showMenu && (
        <View className="absolute bottom-[59px] md:bottom-[68px] right-0 bg-white border border-neutral-50 rounded-lg p-2.5 gap-2 w-[153px] md:w-[180px] z-10">
          <MenuItem label="영수증 등록" onPress={() => selectMenu(onReceiptPress)} />
          <MenuItem label="냉장고 관리하기" onPress={() => selectMenu(onManagePress)} />
        </View>
      )}

      <Pressable className="w-[43px] h-[43px] md:w-[52px] md:h-[52px]" onPress={handlePress}>
        <PlusIcon width="100%" height="100%" />
      </Pressable>
    </View>
  );
};
