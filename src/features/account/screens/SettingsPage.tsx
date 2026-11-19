import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { Alert } from '@/shared/lib/alert';
import { hasUnseenCoachmarks, markAllCoachmarksSeen, resetAllCoachmarks } from '@/shared/lib/hooks/useCoachmarkSeen';
import { AppHeader, BackHeader } from '@/shared/ui';
import { usePermissionSettings } from '../lib/usePermissionSettings';
import { PermissionKey, PermissionState } from '../types';

const PERMISSION_ROWS: { key: PermissionKey; label: string; description: string }[] = [
  { key: 'location', label: '위치 (GPS)', description: '내 주변 나눔·판매 글을 보고 올릴 때 써요' },
  { key: 'photos', label: '사진첩', description: '영수증·프로필·게시글 사진을 고를 때 써요' },
  { key: 'camera', label: '카메라', description: '영수증을 바로 찍을 때 써요' },
];

const STATE_LABEL: Record<PermissionState, string> = {
  granted: '허용됨',
  limited: '일부 허용',
  undetermined: '허용하기',
  denied: '허용 안 됨',
};

// 토글 색 — primary-500 / neutral-50 (Switch는 className을 받지 않음)
const TRACK_COLOR = { true: '#B2E194', false: '#EBEBEB' };

const SectionTitle = ({ children }: { children: string }) => (
  <Text className="text-text14 font-medium font-sans text-text-200 px-2.5">{children}</Text>
);

export const SettingsPage: React.FC = () => {
  const { states, change, canOpenSettings } = usePermissionSettings();
  // 튜토리얼 켜짐 = 아직 안 본 튜토리얼이 남아 있음
  const [isTutorialOn, setIsTutorialOn] = useState<boolean | null>(null);

  useEffect(() => {
    hasUnseenCoachmarks()
      .then(setIsTutorialOn)
      .catch(() => setIsTutorialOn(false));
  }, []);

  const handlePermissionPress = (key: PermissionKey) => {
    const state = states[key];
    if (!state) return;
    if (state === 'undetermined') {
      change(key);
      return;
    }
    if (!canOpenSettings) {
      Alert.alert('권한 변경', '브라우저의 사이트 설정에서 권한을 바꿀 수 있어요.');
      return;
    }
    // 앱에서 권한을 직접 끄거나 다시 켤 수 없어 기기 설정으로 안내
    Alert.alert('권한 변경', '기기 설정에서 권한을 바꿀 수 있어요.\n설정으로 이동할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '설정 열기', onPress: () => change(key) },
    ]);
  };

  const handleTutorialToggle = async (value: boolean) => {
    setIsTutorialOn(value);
    await (value ? resetAllCoachmarks() : markAllCoachmarksSeen());
  };

  const handleTutorialReset = () => {
    Alert.alert('튜토리얼 다시 보기', '모든 화면의 튜토리얼을 처음부터 다시 보여줄게요.', [
      { text: '취소', style: 'cancel' },
      {
        text: '다시 보기',
        onPress: async () => {
          await resetAllCoachmarks();
          setIsTutorialOn(true);
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 140 }}>
      <AppHeader />
      <BackHeader title="설정" />

      <View className="items-center px-screen md:px-10 lg:px-20 pt-6">
        <View className="w-full max-w-[480px] gap-10">
          <View className="gap-3">
            <SectionTitle>권한</SectionTitle>
            <View className="bg-neutral-10 rounded-2xl p-2.5 gap-1">
              {PERMISSION_ROWS.map((row) => {
                const state = states[row.key];
                const isGranted = state === 'granted' || state === 'limited';
                return (
                  <Pressable
                    key={row.key}
                    onPress={() => handlePermissionPress(row.key)}
                    disabled={!state}
                    className="flex-row items-center gap-3 p-2.5 rounded-lg active:bg-neutral-50"
                  >
                    <View className="flex-1 gap-1">
                      <Text className="text-text16 font-sans text-text-100">{row.label}</Text>
                      <Text className="text-text12 font-sans text-text-200">{row.description}</Text>
                    </View>
                    <View className={`rounded-full px-3 py-1.5 ${isGranted ? 'bg-primary-300' : 'bg-white'}`}>
                      <Text
                        className={`text-text13 font-medium font-sans ${isGranted ? 'text-primary-800' : 'text-text-200'}`}
                      >
                        {state ? STATE_LABEL[state] : '확인 중'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <Text className="text-text12 font-sans text-text-300 px-2.5">
              허용한 권한을 끄려면 기기 설정에서 바꿔야 해요.
            </Text>
          </View>

          <View className="gap-3">
            <SectionTitle>튜토리얼</SectionTitle>
            <View className="bg-neutral-10 rounded-2xl p-2.5 gap-1">
              <View className="flex-row items-center gap-3 p-2.5">
                <View className="flex-1 gap-1">
                  <Text className="text-text16 font-sans text-text-100">화면 튜토리얼 보기</Text>
                  <Text className="text-text12 font-sans text-text-200">처음 들어간 화면에서 채소 친구들이 설명해줘요</Text>
                </View>
                <Switch
                  value={isTutorialOn ?? false}
                  disabled={isTutorialOn === null}
                  onValueChange={handleTutorialToggle}
                  trackColor={TRACK_COLOR}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor={TRACK_COLOR.false}
                />
              </View>
              <Pressable onPress={handleTutorialReset} className="p-2.5 rounded-lg active:bg-neutral-50">
                <Text className="text-text16 font-sans text-text-100">튜토리얼 처음부터 다시 보기</Text>
              </Pressable>
            </View>
          </View>

          <View className="gap-3">
            <SectionTitle>앱 정보</SectionTitle>
            <View className="bg-neutral-10 rounded-2xl p-2.5">
              <View className="flex-row items-center p-2.5">
                <Text className="flex-1 text-text16 font-sans text-text-100">버전</Text>
                <Text className="text-text14 font-sans text-text-200">{Constants.expoConfig?.version ?? '-'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
