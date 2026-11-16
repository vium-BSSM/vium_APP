import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type PillButtonVariant = 'primary' | 'secondary';
// xs: 상세 하단바(높이 29), sm: 거래 카드 액션(높이 32), md: 팝업·시트 버튼(높이 39)
type PillButtonSize = 'xs' | 'sm' | 'md';

interface PillButtonProps {
  label: string;
  onPress?: () => void;
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  disabled?: boolean;
  loading?: boolean;
  // 폭 지정용 (예: flex-1, w-[96px])
  className?: string;
}

const SIZE_CLASS: Record<PillButtonSize, { box: string; text: string }> = {
  xs: { box: 'py-[5px] rounded-3xl', text: 'text-text16' },
  sm: { box: 'py-2 rounded-2xl', text: 'text-text14' },
  md: { box: 'py-2.5 rounded-3xl', text: 'text-text16' },
};

/** Figma button/primary·secondary 작은 크기 — 큰 하단 버튼은 Button 사용 */
export const PillButton: React.FC<PillButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;
  const { box, text } = SIZE_CLASS[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={`items-center justify-center ${box} ${isPrimary ? 'bg-neutral-500' : 'bg-neutral-10'} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isPrimary ? '#FAFAFA' : '#333333'} />
      ) : (
        <Text className={`${text} font-sans ${isPrimary ? 'text-white' : 'text-neutral-500'}`}>{label}</Text>
      )}
    </Pressable>
  );
};
