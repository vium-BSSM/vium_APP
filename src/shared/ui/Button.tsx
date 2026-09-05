import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  children: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  fullWidth = false,
  disabled,
  ...props
}) => {
  return (
    <Pressable
      className={`bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px] ${fullWidth ? 'w-full' : 'w-[299px]'} ${disabled ? 'opacity-50' : ''}`}
      disabled={disabled}
      {...props}
    >
      <Text className="text-text-400 text-subtitle text-center">
        {children}
      </Text>
    </Pressable>
  );
};
