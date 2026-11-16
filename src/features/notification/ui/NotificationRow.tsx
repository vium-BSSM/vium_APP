import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { NotificationItem } from '../types';

interface NotificationRowProps {
  item: NotificationItem;
  onPress?: () => void;
}

/** Figma notification-row — 아이콘 원(40) + 제목·시간·본문 + 안 읽음 점 */
export const NotificationRow: React.FC<NotificationRowProps> = ({ item, onPress }) => (
  <Pressable onPress={onPress} className="flex-row items-start gap-3 px-2.5 py-4 rounded-lg bg-white active:bg-text-400">
    <View className="w-10 h-10 rounded-full bg-primary-200 items-center justify-center">
      <Text className="text-text11 font-medium font-sans text-text-100">{item.iconLabel}</Text>
    </View>
    <View className="flex-1 gap-1.5">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="flex-1 text-text14 font-sans text-text-100" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-text12 font-sans text-text-300">{item.timeLabel}</Text>
      </View>
      <Text className="text-text12 font-sans text-text-200">{item.body}</Text>
    </View>
    {/* 안 읽음 점 자리는 항상 비워둬서 읽음 여부와 상관없이 시간 위치가 같게 */}
    <View className={`w-1.5 h-1.5 rounded-full ${item.unread ? 'bg-status-danger' : ''}`} />
  </Pressable>
);
