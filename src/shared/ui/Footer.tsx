import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { Alert } from '@/shared/lib/alert';

export interface FooterLink {
  label: string;
  // 없으면 '준비 중' 안내
  onPress?: () => void;
}

interface FooterProps {
  links?: FooterLink[];
  className?: string;
}

// TODO: 이용약관·개인정보처리방침 페이지가 생기면 onPress에 연결
const DEFAULT_LINKS: FooterLink[] = [{ label: '이용약관' }, { label: '개인정보처리방침' }];

/** 화면 맨 아래 약관 링크 + 앱 버전 */
export const Footer: React.FC<FooterProps> = ({ links = DEFAULT_LINKS, className = '' }) => {
  const version = Constants.expoConfig?.version;

  return (
    <View className={`items-center gap-2 py-6 ${className}`}>
      <View className="flex-row items-center gap-2">
        {links.map((link, index) => (
          <React.Fragment key={link.label}>
            {index > 0 && <Text className="text-text12 font-sans text-text-300">·</Text>}
            <Pressable
              onPress={link.onPress ?? (() => Alert.alert('준비 중', `${link.label}은(는) 곧 준비돼요.`))}
              hitSlop={8}
              accessibilityRole="link"
            >
              <Text className="text-text12 font-sans text-text-200 underline">{link.label}</Text>
            </Pressable>
          </React.Fragment>
        ))}
      </View>
      <Text className="text-text12 font-sans text-text-300">ViUM{version ? ` v${version}` : ''}</Text>
    </View>
  );
};
