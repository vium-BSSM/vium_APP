import { useState } from 'react';
import { Platform } from 'react-native';
import { isAxiosError } from 'axios';
import { Alert } from '@/shared/lib/alert';
import { PickedImage } from '@/shared/lib/pickImage';
import { recognizeText } from '@/shared/lib/textRecognition';
import { scanPurchase } from '../api/purchaseApi';
import { PurchaseDetail } from '../types';

// ML Kit은 네이티브 전용 — 웹은 기기에서 글자를 읽을 수 없어 영수증 인식 불가
export const isReceiptScanSupported = Platform.OS !== 'web';

/**
 * 영수증 사진 → 기기에서 텍스트 인식(ML Kit) → 서버에 인식 결과 등록 → 확인 대기(DRAFT) 구매 내역
 * 아직 재고에 등록되지 않음 (확인 화면에서 confirmPurchase로 확정)
 */
export const useReceiptScan = () => {
  const [isScanning, setIsScanning] = useState(false);

  const scanReceipt = async (image: PickedImage): Promise<PurchaseDetail | null> => {
    try {
      setIsScanning(true);

      const ocr = await recognizeText(image);
      if (ocr.lines.length === 0) {
        Alert.alert('인식 실패', '영수증에서 글자를 찾지 못했어요.\n밝은 곳에서 영수증 전체가 보이게 다시 찍어주세요.');
        return null;
      }

      // TODO: 영수증 원본 보관 여부 결정 후 uploadReceiptImage → imageId를 같이 보내기
      const response = await scanPurchase('RECEIPT', ocr);

      if (response.success && response.data) {
        return response.data;
      }

      Alert.alert('오류', response.error?.message || '영수증을 인식하지 못했습니다.');
      return null;
    } catch (err) {
      console.error('Failed to scan receipt:', err);

      if (isAxiosError(err) && err.response?.data?.error?.code === 'SCAN_UNRECOGNIZABLE') {
        Alert.alert('인식 실패', '영수증에서 식재료를 찾지 못했어요.\n직접 등록해주세요.');
        return null;
      }

      const message = isAxiosError(err) && !err.response ? '서버와 연결할 수 없습니다.' : '영수증을 인식하지 못했습니다.';
      Alert.alert('오류', message);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  return { scanReceipt, isScanning };
};
