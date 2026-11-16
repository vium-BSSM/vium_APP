import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppTextInput, Avatar, BackHeader, Button, HeaderActions } from '@/shared/ui';
import { useMyProfile } from '@/features/account';
import { Alert } from '@/shared/lib/alert';
import StarIcon from '@/../assets/icons/star-icon.svg';
import { formatPrice } from '../lib/communityFormat';
import { TradeSummary } from '../types';

const SCORE_LABELS = ['', '별로예요', '아쉬워요', '보통이에요', '좋았어요', '최고예요'];
const QUICK_PHRASES = ['시간 약속을 잘 지켜요', '친절해요', '상태가 좋아요'];
// Figma 기준 200자 (API 최대는 500자)
const CONTENT_MAX_LENGTH = 200;

export const TradeReviewPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useMyProfile();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tradeId = Number(id);
  // TODO(API): 내 거래 목록(GET /api/me/trades)에서 tradeId로 상대·게시물 정보 찾기
  const trade: TradeSummary | undefined = undefined as TradeSummary | undefined;
  const [score, setScore] = useState(0);
  const [content, setContent] = useState('');

  const appendPhrase = (phrase: string) =>
    setContent((prev) => (prev.includes(phrase) ? prev : `${prev.trim() ? `${prev.trim()} ` : ''}${phrase}`).slice(0, CONTENT_MAX_LENGTH));

  // TODO(API): POST /api/me/trades/{tradeId}/review { mannerScore, content }
  const handleSubmit = () =>
    Alert.alert('후기를 보냈어요', `거래 ${tradeId} · ${score}점`, [{ text: '확인', onPress: () => router.back() }]);

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader right={<HeaderActions profileImageUrl={profile.profileImageUrl} />} />
      <View className="mt-2">
        <BackHeader title="거래 후기" />
      </View>

      <ScrollView contentContainerClassName="px-screen md:px-10 lg:px-20 pt-6 pb-10 gap-9" keyboardShouldPersistTaps="handled">
        <View className="items-center gap-7">
          <View className="items-center gap-[19px]">
            <Avatar uri={trade?.partner.profileImageUrl} size={64} />
            <View className="items-center gap-3">
              <Text className="text-heading-md font-medium font-sans text-text-100">
                {trade ? `${trade.partner.displayName}님과의 거래는 어떠셨나요?` : '거래는 어떠셨나요?'}
              </Text>
              {trade && (
                <View className="px-3 py-1.5 rounded-2xl bg-neutral-10">
                  <Text className="text-text12 font-sans text-text-200">
                    {trade.post.title} · {formatPrice(trade.price, trade.post.type, '무료')}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="items-center gap-2.5">
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setScore(value)}
                  hitSlop={4}
                  accessibilityRole="button"
                  accessibilityLabel={`${value}점`}
                  accessibilityState={{ selected: value <= score }}
                >
                  <StarIcon width={40} height={40} color={value <= score ? '#FDCF73' : '#EBEBEB'} />
                </Pressable>
              ))}
            </View>
            <Text className="text-text15 font-sans text-text-200">{score > 0 ? SCORE_LABELS[score] : '별점을 눌러주세요'}</Text>
          </View>
        </View>

        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-text14 font-sans text-text-100">후기 (선택)</Text>
            <Text className="text-text12 font-sans text-text-300">
              {content.length}/{CONTENT_MAX_LENGTH}
            </Text>
          </View>
          <AppTextInput
            value={content}
            onChangeText={setContent}
            maxLength={CONTENT_MAX_LENGTH}
            multiline
            textAlignVertical="top"
            placeholder="거래 후기를 남겨주세요"
            placeholderTextColor="#A7A9B5"
            className="h-[120px] px-[14px] pt-3 rounded-lg border border-neutral-50 text-text15 font-sans text-text-100"
          />
          <View className="flex-row flex-wrap gap-1.5">
            {QUICK_PHRASES.map((phrase) => (
              <Pressable key={phrase} onPress={() => appendPhrase(phrase)} className="px-2.5 py-[5px] rounded-[14px] border border-neutral-50">
                <Text className="text-text12 font-sans text-text-200">{phrase}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="px-screen md:px-10 lg:px-20 pt-3 gap-2 items-center" style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
        <Text className="text-text12 font-sans text-text-300">후기는 거래당 한 번만 남길 수 있고, 수정할 수 없어요</Text>
        <Button fullWidth onPress={handleSubmit} disabled={score === 0}>
          후기 보내기
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
