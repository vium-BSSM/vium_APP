import React, { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ShareIcon from '@/../assets/icons/share-icon.svg';
import { useMonthlyReport } from '../lib/useMonthlyReport';
import { formatCount, formatWon, formatYearMonth } from '../lib/formatters';
import { YearMonth, getCurrentYearMonth } from '../lib/reportMonths';
import { ReportMonthPicker } from './ReportMonthPicker';
import { WasteBar } from './WasteBar';

const BAR_MAX_HEIGHT = 153;
const BAR_MIN_HEIGHT = 11;

export const ReportPage: React.FC = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<YearMonth>(getCurrentYearMonth);
  const { report } = useMonthlyReport(selectedMonth.year, selectedMonth.month);

  const animationKey = `${report.year}-${report.month}`;

  const maxWasted = Math.max(...report.wasteCategories.map((c) => c.wastedAmount), 1);
  const mostWasted = report.wasteCategories.find((c) => c.wastedAmount === maxWasted);

  const summaryRows = [
    { label: '등록한 재료', value: report.registeredCount },
    { label: '전부 섭취한 재료', value: report.consumedCount },
    { label: '소비기한을 지키지 못한 재료', value: report.expiredCount },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${formatYearMonth(report.year, report.month)} 식비 총 ${formatWon(report.totalSpent)}원, 그중 ${formatWon(report.totalWasted)}원치를 폐기했어요.`,
      });
    } catch (err) {
      console.error('Failed to share report:', err);
    }
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
      <View className="px-5 md:px-10 lg:px-20 pt-[75px] items-center">
        <View className="w-full max-w-[480px] items-center gap-[50px]">
          {/* 월 선택 */}
          <ReportMonthPicker value={selectedMonth} onChange={setSelectedMonth} />

          <View className="w-full gap-16">
            <View className="w-full gap-[54px]">
              {/* 이번달 식비 */}
              <View className="gap-4">
                <Text className="text-text16 font-medium font-sans text-text-100">이번달 식비</Text>
                <View className="bg-primary-300 rounded-lg p-5 gap-2">
                  <Text className="text-[20px] font-medium font-sans text-text-100">
                    총 {formatWon(report.totalSpent)}원
                  </Text>
                  <Text className="text-[12px] font-sans text-text-50">
                    그중에 총 {formatWon(report.totalWasted)}원치를 폐기했어요.
                  </Text>
                </View>
              </View>

              {/* 재료 요약 */}
              <View className="px-[14px] gap-8">
                <View className="px-[5px] gap-3">
                  {summaryRows.map((row) => (
                    <View key={row.label} className="flex-row items-center justify-between">
                      <Text className="text-text14 font-medium font-sans text-text-300">
                        {row.label}
                      </Text>
                      <Text className="text-text15 font-medium font-sans text-text-100">
                        {formatCount(row.value)}
                      </Text>
                    </View>
                  ))}
                </View>
                <View className="h-px bg-neutral-100" />
              </View>

              {/* 폐기 카테고리 */}
              <View className="px-[7px] gap-[15px]">
                <View className="gap-4">
                  <Text className="text-text16 font-medium font-sans text-text-100">
                    <Text className="text-primary-700">{mostWasted?.category}</Text>
                    를{'\n'}가장 많이 버렸어요!
                  </Text>
                  <View className="flex-row items-end justify-center gap-6 p-5">
                    {report.wasteCategories.map((category, index) => (
                      <WasteBar
                        key={category.category}
                        label={category.category}
                        height={Math.max(
                          BAR_MIN_HEIGHT,
                          Math.round((category.wastedAmount / maxWasted) * BAR_MAX_HEIGHT)
                        )}
                        isHighlighted={category === mostWasted}
                        index={index}
                        animationKey={animationKey}
                      />
                    ))}
                  </View>
                </View>

                {/* 폐기 순위 */}
                <View key={animationKey} className="px-[7px] gap-[6px]">
                  {report.topWastedItems.map((item, index) => (
                    <Animated.View
                      key={item.rank}
                      entering={FadeInDown.delay(400 + index * 100).duration(400)}
                    >
                      {index > 0 && <View className="h-px bg-neutral-100 mb-[6px]" />}
                      <View className="flex-row items-end justify-between p-2.5 rounded-lg bg-white">
                        <View className="flex-row items-center gap-4">
                          <Text className="text-[20px] font-bold font-sans text-text-100">
                            {item.rank}
                          </Text>
                          <View className="gap-1">
                            <Text className="text-[13px] font-sans text-text-100">{item.name}</Text>
                            <Text className="text-text14 font-medium font-sans text-text-100">
                              -{formatWon(item.lossAmount)}
                            </Text>
                          </View>
                        </View>
                        <View className="items-end gap-1">
                          <Text className="text-[12px] font-sans text-text-200">
                            구매 : {formatWon(item.purchaseAmount)}
                          </Text>
                          <Text className="text-[12px] font-sans text-text-200">
                            폐기 : {item.wastePercent}%
                          </Text>
                        </View>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </View>

            {/* 하단 액션 */}
            <View className="gap-16 items-center">
              <Text className="text-[12px] font-sans text-text-50 text-center">
                이제 해당 내용을 바탕으로 장보기 리스트를 추천 받을 수 있어요!
              </Text>
              <View className="w-full flex-row items-center gap-4">
                <Pressable
                  className="flex-1 bg-neutral-500 rounded-3xl items-center justify-center px-2.5 py-[15px]"
                  onPress={() => router.push('/main')}
                >
                  <Text className="text-text-400 text-subtitle text-center font-sans">홈으로</Text>
                </Pressable>
                <Pressable
                  className="w-[71px] bg-primary-500 rounded-3xl items-center justify-center px-2.5 py-[15px]"
                  onPress={handleShare}
                >
                  <ShareIcon width={24} height={24} color="#FAFAFA" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
