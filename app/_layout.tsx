import '../global.css';
import { Stack } from 'expo-router';
import { AppProvider } from '@/providers/AppProvider';

// 네브바 탭 화면은 스택 전환 대신 페이드로 전환 (추후 Tabs 레이아웃으로 마이그레이션 예정)
const TAB_SCREENS = ['main', 'fridge', 'recipe', 'mypage', 'debug'];

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {TAB_SCREENS.map((name) => (
          <Stack.Screen key={name} name={name} options={{ animation: 'none' }} />
        ))}
      </Stack>
    </AppProvider>
  );
}
