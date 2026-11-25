import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/shared/ui';
import { ConsumptionCheckPrompt, UnreadNotificationsWatcher } from '@/features/notification';
import { ChatEventsWatcher } from '@/features/community';
import { useUserEventStream } from '@/shared/lib/userEventStream';

export default function TabsLayout() {
  // 실시간 이벤트(SSE) 연결은 하나만 — 채팅·알림이 각각 구독
  useUserEventStream();

  return (
    <>
      {/* 로그인 후 어느 탭에서든 헤더 종 아이콘의 빨간 점을 맞춤 (notification 이벤트가 오면 다시 조회) */}
      <UnreadNotificationsWatcher />
      {/* 실시간 채팅(SSE) — 새 메시지가 오면 채팅 목록·메시지를 갱신 */}
      <ChatEventsWatcher />
      {/* 소진 확인 '다 드셨어요?' — 홈 진입 시 또는 알림을 눌렀을 때 */}
      <ConsumptionCheckPrompt />
      <Tabs
        tabBar={() => <BottomNavigation />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#FFFFFF' } }}
      >
        <Tabs.Screen name="main" />
        <Tabs.Screen name="fridge" />
        <Tabs.Screen name="recipe" />
        <Tabs.Screen name="community" />
        <Tabs.Screen name="mypage" />
        {/* 탭 버튼은 없지만 하단 탭을 유지한 채 홈에서 이동하는 화면 */}
        <Tabs.Screen name="report" options={{ href: null }} />
        <Tabs.Screen name="shopping" options={{ href: null }} />
        <Tabs.Screen name="purchase-suggestions" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
      </Tabs>
    </>
  );
}
