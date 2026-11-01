import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';
import { cssInterop } from 'nativewind';

const FONT_BY_WEIGHT: Record<string, string> = {
  '100': 'Paperlogy-Thin',
  '200': 'Paperlogy-ExtraLight',
  '300': 'Paperlogy-Light',
  '400': 'Paperlogy-Regular',
  normal: 'Paperlogy-Regular',
  '500': 'Paperlogy-Medium',
  '600': 'Paperlogy-SemiBold',
  '700': 'Paperlogy-Bold',
  bold: 'Paperlogy-Bold',
  '800': 'Paperlogy-ExtraBold',
  '900': 'Paperlogy-Black',
};

// 기본 TextInput의 문제 보정
// - 플랫폼 기본 세로 패딩/폰트 패딩 때문에 낮은 박스에서 글자가 잘림 → 패딩 0
// - lineHeight가 걸리면 iOS에서 글자가 위아래로 잘림 → lineHeight 제거
// - 커스텀 폰트 + fontWeight 조합은 iOS가 폰트를 못 찾아 placeholder가 시스템 폰트로 풀림
//   → fontWeight를 굵기별 폰트 파일 이름으로 바꾸고 fontWeight는 제거
export const AppTextInput = forwardRef<TextInput, TextInputProps>(({ style, ...props }, ref) => {
  const { fontWeight, ...flat } = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const fontFamily = FONT_BY_WEIGHT[String(fontWeight ?? '400')] ?? 'Paperlogy-Regular';

  return (
    <TextInput
      ref={ref}
      {...props}
      style={[
        flat,
        {
          fontFamily,
          lineHeight: undefined,
          paddingVertical: 0,
          paddingTop: 0,
          paddingBottom: 0,
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
      ]}
    />
  );
});

AppTextInput.displayName = 'AppTextInput';

// className을 style로 먼저 바꿔 받아야 위에서 fontWeight·패딩을 보정할 수 있음
cssInterop(AppTextInput, { className: 'style' });
