import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import BackIcon from '@/../assets/icons/back-icon.svg';

interface BackHeaderProps {
  title?: string;
  onBack?: () => void;
  // 오른쪽 글자 버튼 (예: '모두 읽음')
  actionLabel?: string;
  onActionPress?: () => void;
  // 제목 대신/옆에 넣을 내용 (예: 채팅방 상대 이름 + 매너 점수)
  children?: ReactNode;
  // 오른쪽 아이콘 등 자유 영역 (actionLabel보다 우선)
  right?: ReactNode;
  className?: string;
}

/**
 * Figma app-bar/back — 뒤로가기(24) + 제목(20 Medium) + 선택 액션, 높이 52
 * 화면 좌우 마진(px-screen)을 포함
 */
export const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  onBack,
  actionLabel,
  onActionPress,
  children,
  right,
  className = '',
}) => {
  const router = useRouter();
  const handleBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/main' as any)));

  return (
    <View className={`h-[52px] flex-row items-center gap-2 px-screen md:px-10 lg:px-20 ${className}`}>
      <Pressable onPress={handleBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="뒤로 가기">
        <BackIcon width={24} height={24} color="#242529" />
      </Pressable>
      <View className="flex-1 flex-row items-center">
        {title !== undefined && (
          <Text className="flex-1 text-heading-md font-medium font-sans text-text-100" numberOfLines={1}>
            {title}
          </Text>
        )}
        {children}
      </View>
      {right ??
        (actionLabel ? (
          <Pressable onPress={onActionPress} hitSlop={8}>
            <Text className="text-text14 font-sans text-text-200">{actionLabel}</Text>
          </Pressable>
        ) : null)}
    </View>
  );
};
