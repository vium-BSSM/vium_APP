import React, { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

// Figma bottom-sheet 하단 여백 40 (홈 인디케이터 영역보다 작으면 안전 영역 사용)
const SHEET_BOTTOM_PADDING = 40;

/** 화면 아래에서 올라오는 시트 — 상단 핸들 + 둥근 모서리(24), 바깥을 누르면 닫힘 */
export const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl pt-3 px-screen items-center"
          style={{ paddingBottom: Math.max(insets.bottom, SHEET_BOTTOM_PADDING) }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-10 h-1 rounded-sm bg-neutral-50" />
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
