import React from 'react';
import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';

export interface PopoverMenuItem {
  label: string;
  onPress: () => void;
}

export interface PopoverAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PopoverMenuProps {
  /** 기준 버튼의 화면 좌표 (measureInWindow) — null이면 닫힘 */
  anchor: PopoverAnchor | null;
  items: PopoverMenuItem[];
  onClose: () => void;
  /** 메뉴를 기준 버튼의 어느 쪽 끝에 맞출지 (기본: 오른쪽) */
  align?: 'left' | 'right';
}

/** 버튼 아래에 뜨는 작은 메뉴 (냉장고 + 버튼 메뉴와 같은 모양) */
export const PopoverMenu: React.FC<PopoverMenuProps> = ({ anchor, items, onClose, align = 'right' }) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <Modal visible={anchor !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable className="flex-1" onPress={onClose} accessibilityLabel="메뉴 닫기">
        {anchor && (
          <View
            className="absolute bg-white border border-neutral-50 rounded-lg p-2.5 gap-2 w-[153px] md:w-[180px]"
            style={{
              top: anchor.y + anchor.height + 6,
              ...(align === 'left'
                ? { left: Math.max(anchor.x, 8) }
                : { right: Math.max(windowWidth - (anchor.x + anchor.width), 8) }),
            }}
          >
            {items.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.onPress}
                hitSlop={{ top: 4, bottom: 4 }}
                className="p-[5px] rounded-lg active:bg-neutral-10"
                accessibilityRole="menuitem"
              >
                <Text className="text-black text-text14 md:text-text15 leading-tight font-sans">{item.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </Pressable>
    </Modal>
  );
};
