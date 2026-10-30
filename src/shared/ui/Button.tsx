import React from 'react';
import { ActivityIndicator, Pressable, Text, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  children: string;
  fullWidth?: boolean;
  // true면 글자 대신 스피너를 보여주고 누를 수 없음
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    // 로딩 중에도 버튼 크기가 바뀌지 않도록 높이 고정, 내용만 교체
    <Pressable
      className={`bg-neutral-500 rounded-3xl items-center justify-center px-2.5 h-[54px] ${fullWidth ? 'w-full' : 'w-[299px]'} ${isDisabled ? 'opacity-50' : ''}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FAFAFA" />
      ) : (
        <Text className="text-text-400 text-heading-md text-center font-sans">
          {children}
        </Text>
      )}
    </Pressable>
  );
};
