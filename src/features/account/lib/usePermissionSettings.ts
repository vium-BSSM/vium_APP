import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { PermissionKey, PermissionState } from '../types';

interface PermissionResult {
  granted: boolean;
  canAskAgain: boolean;
  accessPrivileges?: 'all' | 'limited' | 'none';
}

// 권한별 확인·요청 함수
const PERMISSIONS: Record<PermissionKey, { get: () => Promise<PermissionResult>; request: () => Promise<PermissionResult> }> = {
  location: {
    get: Location.getForegroundPermissionsAsync,
    request: Location.requestForegroundPermissionsAsync,
  },
  photos: {
    get: () => ImagePicker.getMediaLibraryPermissionsAsync(),
    request: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
  },
  camera: {
    get: ImagePicker.getCameraPermissionsAsync,
    request: ImagePicker.requestCameraPermissionsAsync,
  },
};

const toState = (result: PermissionResult): PermissionState => {
  if (result.granted) return result.accessPrivileges === 'limited' ? 'limited' : 'granted';
  // 한 번도 안 물어봤으면 앱에서 바로 요청 가능, 거절했으면 기기 설정에서만 바꿀 수 있음
  return result.canAskAgain ? 'undetermined' : 'denied';
};

const KEYS = Object.keys(PERMISSIONS) as PermissionKey[];

/**
 * 위치·사진·카메라 권한 상태 확인과 변경
 * - 앱은 권한을 직접 끌 수 없어서, 허용된 권한을 바꾸려면 기기 설정을 열어줌
 * - 설정 앱에서 돌아오면 상태를 다시 읽음
 */
export const usePermissionSettings = () => {
  const [states, setStates] = useState<Partial<Record<PermissionKey, PermissionState>>>({});

  const refresh = useCallback(async () => {
    const entries = await Promise.all(
      KEYS.map(async (key) => {
        try {
          return [key, toState(await PERMISSIONS[key].get())] as const;
        } catch {
          return [key, 'denied'] as const;
        }
      })
    );
    setStates(Object.fromEntries(entries));
  }, []);

  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  // 웹은 기기 설정 화면이 없음
  const canOpenSettings = Platform.OS !== 'web';

  const change = async (key: PermissionKey) => {
    const state = states[key];
    if (state === 'undetermined') {
      const result = await PERMISSIONS[key].request().catch(() => null);
      if (result) setStates((prev) => ({ ...prev, [key]: toState(result) }));
      return;
    }
    if (canOpenSettings) await Linking.openSettings();
  };

  return { states, change, canOpenSettings };
};
