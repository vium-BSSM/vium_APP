import React, { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { ShoppingListItem } from '../types';
import { ShoppingCheckbox } from './ShoppingCheckbox';

interface ShoppingListRowProps {
  item: ShoppingListItem;
  disabled: boolean;
  onToggle: () => void;
  /** 실패 시 false를 돌려주면 열린 스와이프를 닫음 */
  onDelete: () => Promise<boolean>;
}

const DELETE_ACTION_WIDTH = 80;

export const ShoppingListRow: React.FC<ShoppingListRowProps> = ({ item, disabled, onToggle, onDelete }) => {
  const swipeableRef = useRef<SwipeableMethods>(null);

  const handleDelete = async () => {
    const deleted = await onDelete();
    if (!deleted) swipeableRef.current?.close();
  };

  const renderDeleteAction = () => (
    <Pressable
      className="bg-secondary-500 items-center justify-center"
      style={{ width: DELETE_ACTION_WIDTH }}
      disabled={disabled}
      onPress={handleDelete}
      accessibilityLabel={`${item.name} 삭제`}
    >
      <Text className="text-text15 font-medium font-sans text-text-400">삭제</Text>
    </Pressable>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={DELETE_ACTION_WIDTH / 2}
      overshootRight={false}
      renderRightActions={renderDeleteAction}
    >
      <Pressable
        className="flex-row items-center gap-3 px-2.5 py-4 bg-white"
        disabled={disabled}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.isChecked }}
      >
        <ShoppingCheckbox checked={item.isChecked} />
        <View className="flex-1 flex-row items-center justify-between">
          <Text
            className={`text-text16 font-medium font-sans ${item.isChecked ? 'text-text-300 line-through' : 'text-text-100'}`}
          >
            {item.name}
          </Text>
          {!!item.quantityLabel && (
            <Text className={`text-text15 font-sans ${item.isChecked ? 'text-text-300' : 'text-text-200'}`}>
              {item.quantityLabel}
            </Text>
          )}
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );
};
