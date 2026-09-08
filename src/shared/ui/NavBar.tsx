import React from 'react';
import { View, Pressable, Text } from 'react-native';
import HomeIcon from '@/../assets/icons/home-icon.svg';
import FridgeIcon from '@/../assets/icons/fridge-icon.svg';
import ReceiptIcon from '@/../assets/icons/receipt-icon.svg';
import SettingsIcon from '@/../assets/icons/settings-icon.svg';

type NavItem = 'home' | 'fridge' | 'receipt' | 'settings';

interface NavBarProps {
  activeItem?: NavItem;
  onItemPress?: (item: NavItem) => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  activeItem = 'home',
  onItemPress,
}) => {
  const navItems: { key: NavItem; label: string; Icon: any }[] = [
    { key: 'home', label: '홈', Icon: HomeIcon },
    { key: 'fridge', label: '냉장고', Icon: FridgeIcon },
    { key: 'receipt', label: '레시피', Icon: ReceiptIcon },
    { key: 'settings', label: '설정', Icon: SettingsIcon },
  ];

  return (
    <View className="bg-white rounded-[40px] px-6 py-4 flex-row justify-between items-center shadow-sm">
      {navItems.map((item) => {
        const isActive = activeItem === item.key;
        const { Icon } = item;
        return (
          <Pressable
            key={item.key}
            onPress={() => onItemPress?.(item.key)}
            className="items-center flex-1"
          >
            <View className={`w-8 h-8 items-center justify-center mb-1`}>
              <Icon
                width={32}
                height={32}
                color={isActive ? '#333333' : '#C0C0C0'}
              />
            </View>
            <Text className={`text-text14 font-sans ${isActive ? 'text-neutral-500' : 'text-neutral-100'}`}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
