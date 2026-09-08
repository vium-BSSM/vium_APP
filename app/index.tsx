import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // 앱 시작 시 splash 페이지로 리다이렉트
    router.replace('/splash');
  }, []);

  return null;
}
