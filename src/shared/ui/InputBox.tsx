import React, { useState } from 'react';
import { View, TextInput, Pressable, TextInputProps } from 'react-native';
import { Check } from '@/shared/ui/Check';
import EyeIcon from '@/../assets/icons/eye-icon.svg';
import EyeOffIcon from '@/../assets/icons/eye-off-icon.svg';

interface InputBoxProps extends Omit<TextInputProps, 'secureTextEntry'> {
  type?: 'email' | 'password';
  showCheck?: boolean;
  style?: any;
}

export const InputBox: React.FC<InputBoxProps> = ({
  type = 'email',
  showCheck = false,
  value,
  onChangeText,
  placeholder,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasValue = value && value.length > 0;
  const isActive = isFocused || hasValue;

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return type === 'email' ? '이메일 입력' : '비밀번호 입력';
  };

  const getTextColor = () => {
    if (hasValue) return '#242529'; // text-100
    return '#A7A9B5'; // text-300
  };

  return (
    <View className="bg-neutral-50 rounded-lg px-2.5 py-[15px] flex-row items-center justify-between h-12" style={style}>
      <TextInput
        className="flex-1 text-text15 font-sans"
        style={{ color: getTextColor(), fontFamily: 'Paperlogy' }}
        value={value}
        onChangeText={onChangeText}
        placeholder={getPlaceholder()}
        placeholderTextColor="#A7A9B5"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={type === 'password' && !isPasswordVisible}
        {...props}
      />

      <View className="flex-row items-center gap-2.5">
        {type === 'password' && isActive && (
          <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            {isPasswordVisible ? (
              <EyeIcon width={22} height={22} />
            ) : (
              <EyeOffIcon width={22} height={22} />
            )}
          </Pressable>
        )}
        {showCheck && <Check />}
      </View>
    </View>
  );
};
