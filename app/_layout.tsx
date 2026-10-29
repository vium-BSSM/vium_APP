import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/providers/AppProvider';
import { useIsSessionReady, useSessionUser } from '@/shared/lib/sessionUser';

const RootNavigator = () => {
  const user = useSessionUser();
  const isSessionReady = useIsSessionReady();

  // 저장된 로그인 정보를 읽기 전에는 화면을 그리지 않음 (로그인 화면이 잠깐 보이는 것 방지)
  if (!isSessionReady) return null;

  const isLoggedIn = user !== null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
      </Stack.Protected>

      <Stack.Screen name="index" />
      <Stack.Screen name="debug" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AppProvider>
      {/* 앱은 라이트 전용 → 시스템 다크 모드에서도 상태바 글자를 어둡게 고정 (흰 배경 위에서 안 보이는 것 방지) */}
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProvider>
  );
}
