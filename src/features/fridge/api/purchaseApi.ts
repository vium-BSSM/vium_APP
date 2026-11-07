import { apiClient } from '@/shared/api/client';
import {
  PurchaseConfirmApiResponse,
  PurchaseConfirmRequest,
  PurchaseDeleteApiResponse,
  PurchaseDetailApiResponse,
  PurchaseListApiResponse,
  PurchaseListParams,
  PurchaseScanApiResponse,
  PurchaseScanRequest,
  PurchaseType,
  ReceiptImageUploadApiResponse,
} from '../types';

const SCAN_PATHS: Record<PurchaseType, string> = {
  RECEIPT: '/api/me/receipts/scan',
  ONLINE_ORDER: '/api/me/online-orders/scan',
};

/**
 * OCR 인식 결과 등록 → 확인 대기(DRAFT) 구매 내역 생성 (아직 재고 등록 안 됨)
 * 품목을 못 찾으면 422 SCAN_UNRECOGNIZABLE
 */
export const scanPurchase = async (
  type: PurchaseType,
  request: PurchaseScanRequest
): Promise<PurchaseScanApiResponse> => {
  const response = await apiClient.post<PurchaseScanApiResponse>(SCAN_PATHS[type], request);
  return response.data;
};

/**
 * 확인한 품목을 재고에 등록. items는 최종 목록 전체
 * 이미 확정된 내역이면 409 PURCHASE_ALREADY_CONFIRMED
 */
export const confirmPurchase = async (
  purchaseId: number,
  request: PurchaseConfirmRequest
): Promise<PurchaseConfirmApiResponse> => {
  const response = await apiClient.post<PurchaseConfirmApiResponse>(
    `/api/me/purchases/${purchaseId}/confirm`,
    request
  );
  return response.data;
};

export const getPurchases = async (params: PurchaseListParams = {}): Promise<PurchaseListApiResponse> => {
  const response = await apiClient.get<PurchaseListApiResponse>('/api/me/purchases', { params });
  return response.data;
};

export const getPurchaseDetail = async (purchaseId: number): Promise<PurchaseDetailApiResponse> => {
  const response = await apiClient.get<PurchaseDetailApiResponse>(`/api/me/purchases/${purchaseId}`);
  return response.data;
};

export const deletePurchase = async (purchaseId: number): Promise<PurchaseDeleteApiResponse> => {
  const response = await apiClient.delete<PurchaseDeleteApiResponse>(`/api/me/purchases/${purchaseId}`);
  return response.data;
};

/** 영수증 원본 사진 보관용 업로드 (선택). 받은 imageId를 scanPurchase에 같이 보냄 */
export const uploadReceiptImage = async (uri: string): Promise<ReceiptImageUploadApiResponse> => {
  const formData = new FormData();
  // React Native FormData는 { uri, name, type } 객체로 파일을 받음
  formData.append('file', { uri, name: 'receipt.jpg', type: 'image/jpeg' } as unknown as Blob);
  formData.append('purpose', 'RECEIPT');

  const response = await apiClient.post<ReceiptImageUploadApiResponse>('/api/me/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
