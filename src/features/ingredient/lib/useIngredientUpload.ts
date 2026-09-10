import { Alert, ActionSheetIOS, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';

export const useIngredientUpload = () => {
  const isCameraAvailable = async () => {
    // 시뮬레이터/에뮬레이터에서는 카메라를 사용할 수 없음
    console.log('Device.isDevice:', Device.isDevice);
    if (!Device.isDevice) {
      console.log('Running on simulator/emulator - camera disabled');
      return false;
    }

    // 카메라 권한 확인
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    console.log('Camera permission status:', status);
    return status !== 'denied';
  };

  const pickImageFromCamera = async () => {
    // 카메라 사용 가능 여부 확인
    const available = await isCameraAvailable();

    if (!available) {
      Alert.alert(
        '카메라 사용 불가',
        '시뮬레이터에서는 카메라를 사용할 수 없습니다. 실제 기기에서 테스트해주세요.'
      );
      return null;
    }

    // 카메라 권한 요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      return null;
    }

    try {
      // 카메라 실행
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }
    } catch (error) {
      Alert.alert('오류', '카메라를 실행할 수 없습니다.');
      console.error('Camera error:', error);
    }

    return null;
  };

  const pickImageFromGallery = async () => {
    // 미디어 라이브러리 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return null;
    }

    // 갤러리에서 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }

    return null;
  };

  const showIngredientUploadOptions = async (onImageSelected?: (uri: string) => void) => {
    const handleImageSelected = async (picker: () => Promise<string | null>) => {
      const uri = await picker();
      if (uri) {
        console.log('선택된 재료 이미지:', uri);
        onImageSelected?.(uri);
      }
    };

    if (Platform.OS === 'ios') {
      // iOS: 항상 모든 옵션 표시 (시뮬레이터에서도 UI 확인 가능)
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '사진 촬영', '갤러리에서 선택'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleImageSelected(pickImageFromCamera);
          } else if (buttonIndex === 2) {
            handleImageSelected(pickImageFromGallery);
          }
        }
      );
    } else {
      // Android: 항상 모든 옵션 표시
      Alert.alert(
        '재료 등록',
        '재료를 등록할 방법을 선택하세요',
        [
          { text: '취소', style: 'cancel' },
          { text: '사진 촬영', onPress: () => handleImageSelected(pickImageFromCamera) },
          { text: '갤러리에서 선택', onPress: () => handleImageSelected(pickImageFromGallery) },
        ]
      );
    }
  };

  return {
    pickImageFromCamera,
    pickImageFromGallery,
    showIngredientUploadOptions,
  };
};
