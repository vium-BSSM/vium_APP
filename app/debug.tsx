import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Check, StateBall, Banner, InputBox, Button, AddButton } from '@/shared/ui';

export default function DebugPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailWithCheck, setEmailWithCheck] = useState('25_57@bssm.hs.kr');
  const [passwordWithCheck, setPasswordWithCheck] = useState('password123');

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-title font-bold mt-6 mb-4 text-text-100">
          Component Debug Page
        </Text>

        {/* Check Component */}
        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100">
            Check Component
          </Text>
          <View className="flex-row" style={{ gap: 16 }}>
            <View className="items-center">
              <Check variant="true" />
              <Text className="text-text14 mt-2 text-text-100">True</Text>
            </View>
            <View className="items-center">
              <Check variant="false" />
              <Text className="text-text14 mt-2 text-text-100">False</Text>
            </View>
          </View>
        </View>

        {/* StateBall Component */}
        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100">
            StateBall Component
          </Text>
          <View className="flex-row items-center" style={{ gap: 16 }}>
            <View className="items-center">
              <StateBall state="위험" />
              <Text className="text-text14 mt-2 text-text-100">위험</Text>
            </View>
            <View className="items-center">
              <StateBall state="보통" />
              <Text className="text-text14 mt-2 text-text-100">보통</Text>
            </View>
            <View className="items-center">
              <StateBall state="굿" />
              <Text className="text-text14 mt-2 text-text-100">굿</Text>
            </View>
          </View>
        </View>

        {/* Banner Component */}
        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100">
            Banner Component
          </Text>
          <View style={{ gap: 16 }}>
            <Banner variant="tomato" onPress={() => console.log('Tomato banner pressed')} />
            <Banner variant="potato" onPress={() => console.log('Potato banner pressed')} />
            <Banner variant="onion" onPress={() => console.log('Onion banner pressed')} />
          </View>
        </View>

        {/* InputBox Component */}
        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100">
            InputBox Component
          </Text>
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-text14 mb-2 text-text-100">Email Input</Text>
              <InputBox
                type="email"
                value={email}
                onChangeText={setEmail}
                placeholder="이메일 입력"
              />
            </View>
            <View>
              <Text className="text-text14 mb-2 text-text-100">Password Input</Text>
              <InputBox
                type="password"
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호 입력"
              />
            </View>
            <View>
              <Text className="text-text14 mb-2 text-text-100">Email with Check</Text>
              <InputBox
                type="email"
                value={emailWithCheck}
                onChangeText={setEmailWithCheck}
                showCheck={true}
              />
            </View>
            <View>
              <Text className="text-text14 mb-2 text-text-100">Password with Check</Text>
              <InputBox
                type="password"
                value={passwordWithCheck}
                onChangeText={setPasswordWithCheck}
                showCheck={true}
              />
            </View>
          </View>
        </View>

        {/* Button Component */}
        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100">
            Button Component
          </Text>
          <View className="items-center" style={{ gap: 16 }}>
            <Button onPress={() => console.log('Button pressed')}>
              눌러서 시작하기
            </Button>
            <Button fullWidth onPress={() => console.log('Full width button pressed')}>
              전체 너비 버튼
            </Button>
            <Button disabled>
              비활성화된 버튼
            </Button>
          </View>
        </View>

        {/* AddButton Component */}
        <View className="mb-8">
          <Text className="text-subtitle font-medium mb-3 text-text-100">
            AddButton Component
          </Text>
          <View className="flex-row justify-center" style={{ gap: 16 }}>
            <AddButton
              icon="photo"
              onReceiptPress={() => console.log('Receipt pressed')}
              onCartPress={() => console.log('Cart pressed')}
            />
            <AddButton icon="plus" />
          </View>
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
