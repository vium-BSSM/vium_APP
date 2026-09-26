import { RefObject, useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

// 막대·순위·금액 애니메이션이 모두 끝나는 시간 (중간 상태가 캡처되지 않도록 대기)
const REPORT_ANIMATION_MS = 1000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useReportShare = (targetRef: RefObject<View | null>, animationKey: string) => {
  const [isSharing, setIsSharing] = useState(false);
  const animationStartedAtRef = useRef(Date.now());

  useEffect(() => {
    animationStartedAtRef.current = Date.now();
  }, [animationKey]);

  const shareAsImage = async () => {
    if (isSharing) return;

    try {
      setIsSharing(true);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('공유할 수 없어요', '이 기기에서는 이미지 공유를 지원하지 않아요.');
        return;
      }

      const elapsed = Date.now() - animationStartedAtRef.current;
      if (elapsed < REPORT_ANIMATION_MS) {
        await wait(REPORT_ANIMATION_MS - elapsed);
      }

      const uri = await captureRef(targetRef, { format: 'png', quality: 1, result: 'tmpfile' });
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        UTI: 'public.png',
        dialogTitle: '리포트 공유하기',
      });
    } catch (err) {
      console.error('Failed to share report image:', err);
      Alert.alert('공유에 실패했어요', '잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSharing(false);
    }
  };

  return { isSharing, shareAsImage };
};
