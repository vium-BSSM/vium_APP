import { useState } from 'react';
import { Alert } from 'react-native';
import { registerIngredient } from '../api/ingredientsApi';
import { IngredientRegisterRequest } from '../types';

export interface IngredientFormData {
  name: string;
  amount: string;      // 수량 (quantity)
  price: string;       // 가격 (amount)
  registeredDate: string;  // 등록일자 (purchasedOn)
  expiryDate: string;  // 소비기한 (expiresOn)
  imageUri?: string;
}

export const useIngredientRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (formData: IngredientFormData): Promise<boolean> => {
    try {
      console.log('[useIngredientRegister] register 함수 시작');
      console.log('[useIngredientRegister] formData:', formData);

      setIsLoading(true);
      setError(null);

      // 폼 검증
      if (!formData.name.trim()) {
        console.log('[useIngredientRegister] 검증 실패: 이름 없음');
        Alert.alert('알림', '식재료 이름을 입력해주세요.');
        return false;
      }

      if (!formData.amount.trim()) {
        console.log('[useIngredientRegister] 검증 실패: 양 없음');
        Alert.alert('알림', '양을 입력해주세요.');
        return false;
      }

      if (!formData.expiryDate.trim()) {
        console.log('[useIngredientRegister] 검증 실패: 소비기한 없음');
        Alert.alert('알림', '소비기한을 입력해주세요.');
        return false;
      }

      // 백엔드 API 요청 데이터로 변환
      const request: IngredientRegisterRequest = {
        customName: formData.name,
        quantity: parseFloat(formData.amount) || 1,
        unitId: 1, // TODO: 단위 선택 기능 추가 필요 (임시로 1 사용)
        purchasedOn: formData.registeredDate ? formatDateToISO(formData.registeredDate) : undefined,
        expiresOn: formatDateToISO(formData.expiryDate),
        amount: formData.price ? parseInt(formData.price.replace(/,/g, ''), 10) : undefined,
      };

      console.log('[useIngredientRegister] API 요청 데이터:', request);

      const response = await registerIngredient(request);

      console.log('[useIngredientRegister] API 응답:', response);

      if (response.success) {
        Alert.alert('성공', '재료가 등록되었습니다.');
        return true;
      } else {
        const errorMessage = response.error?.message || '재료 등록에 실패했습니다.';
        Alert.alert('오류', errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error('Failed to register ingredient:', err);
      const errorMessage = err.message || '서버와 연결할 수 없습니다.';
      Alert.alert('오류', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};

/**
 * 날짜 문자열을 ISO 형식(YYYY-MM-DD)으로 변환
 * 입력: "2024/09/17" 또는 "2024-09-17"
 * 출력: "2024-09-17"
 */
const formatDateToISO = (dateString: string): string => {
  const cleaned = dateString.replace(/\//g, '-');
  return cleaned;
};
