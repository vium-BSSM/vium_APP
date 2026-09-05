import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-title font-bold mb-4 text-text-100">Welcome</Text>
      <Pressable
        className="bg-neutral-500 rounded-3xl px-6 py-4"
        onPress={() => router.push('/debug')}
      >
        <Text className="text-text-400 text-subtitle">Go to Debug Page</Text>
      </Pressable>
    </View>
  );
}
