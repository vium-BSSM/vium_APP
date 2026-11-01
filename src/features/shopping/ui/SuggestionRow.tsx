import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ShoppingSuggestion } from '../types';

interface SuggestionRowProps {
  suggestion: ShoppingSuggestion;
  isAdded: boolean;
  isPending: boolean;
  onAdd: () => void;
}

export const SuggestionRow: React.FC<SuggestionRowProps> = ({ suggestion, isAdded, isPending, onAdd }) => {
  return (
    <View className="flex-row items-center justify-between rounded-lg bg-primary-100 px-4 py-3">
      <View className="gap-1 flex-1">
        <Text className="text-text15 font-medium font-sans text-text-100">{suggestion.name}</Text>
        {!!suggestion.quantityLabel && (
          <Text className="text-text12 font-sans text-text-200">추천 수량 {suggestion.quantityLabel}</Text>
        )}
      </View>
      <Pressable
        className={`rounded-3xl px-4 py-2 min-w-[64px] items-center ${isAdded ? 'bg-neutral-50' : 'bg-primary-500'}`}
        disabled={isAdded || isPending}
        onPress={onAdd}
        hitSlop={6}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#242529" />
        ) : (
          <Text className={`text-text14 font-medium font-sans ${isAdded ? 'text-text-300' : 'text-text-100'}`}>
            {isAdded ? '담김' : '담기'}
          </Text>
        )}
      </Pressable>
    </View>
  );
};
