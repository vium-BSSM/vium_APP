import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class LocationPermissionError extends Error {
  constructor() {
    super('위치 권한이 필요해요. 설정에서 위치 접근을 허용해주세요.');
  }
}

const getCurrentCoordinates = async (): Promise<Coordinates> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new LocationPermissionError();

  // 마지막 위치가 있으면 바로 쓰고, 없을 때만 GPS를 새로 잡음 (주변 글 조회는 정밀도보다 속도가 중요)
  const last = await Location.getLastKnownPositionAsync();
  const position = last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  return { latitude: position.coords.latitude, longitude: position.coords.longitude };
};

/** 현재 위치 (서버에 저장하지 않고 요청마다 보내는 용도) — 5분간 캐시 */
export const useCurrentLocation = () => {
  const query = useQuery({
    queryKey: ['currentLocation'],
    queryFn: getCurrentCoordinates,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return {
    coords: query.data ?? null,
    isLoading: query.isPending,
    error: query.error ? query.error.message : null,
    refetch: query.refetch,
  };
};
