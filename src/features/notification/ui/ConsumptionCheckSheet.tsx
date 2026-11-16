import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BottomSheet, PillButton } from '@/shared/ui';

interface ConsumptionCheckSheetProps {
  visible: boolean;
  ingredientName: string;
  // 예: '11.10 구매 · 1모 · 소비기한 D-1'
  description: string;
  onClose: () => void;
  onRemaining: () => void;
  onConsumed: () => void;
  onDisposed: () => void;
  isSubmitting?: boolean;
}

/** Figma notification/consumption-check — '다 드셨어요?'에 예/아니오/버렸어요로 답하는 시트 */
export const ConsumptionCheckSheet: React.FC<ConsumptionCheckSheetProps> = ({
  visible,
  ingredientName,
  description,
  onClose,
  onRemaining,
  onConsumed,
  onDisposed,
  isSubmitting = false,
}) => (
  <BottomSheet visible={visible} onClose={onClose}>
    <View className="w-full items-center gap-[47px] pt-[26px]">
      <View className="items-center gap-2.5">
        <Text className="text-heading-lg font-medium font-sans text-text-100">{ingredientName} 다 드셨어요?</Text>
        <Text className="text-text14 font-sans text-text-200">{description}</Text>
      </View>

      <View className="w-full items-center gap-[26px]">
        <View className="w-full flex-row gap-2">
          <PillButton label="아니요, 남았어요" variant="secondary" onPress={onRemaining} className="flex-1" disabled={isSubmitting} />
          <PillButton label="네, 다 먹었어요" onPress={onConsumed} className="flex-1" loading={isSubmitting} />
        </View>
        <Pressable onPress={onDisposed} disabled={isSubmitting} hitSlop={8}>
          <Text className="text-text14 font-sans text-text-300 underline">사실 버렸어요</Text>
        </Pressable>
      </View>
    </View>
  </BottomSheet>
);
