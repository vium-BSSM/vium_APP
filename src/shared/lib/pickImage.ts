import * as ImagePicker from 'expo-image-picker';
import { Alert } from './alert';

/**
 * 사진 라이브러리에서 이미지 한 장을 골라 uri를 반환 (권한 거부·선택 취소 시 null)
 * @param options 화면별로 다른 값만 넘김 (예: 프로필은 aspect [1, 1])
 */
export const pickImageFromLibrary = async (
  options: ImagePicker.ImagePickerOptions = {}
): Promise<string | null> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
    ...options,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
};
