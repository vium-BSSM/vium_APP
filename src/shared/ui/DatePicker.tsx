import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  style?: any;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  style,
}) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedDate) {
        onChange(selectedDate);
      }
    } else {
      // iOS: 임시 저장
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setShow(false);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <View className="flex-row items-center justify-between" style={style}>
      <Text className="text-text16 text-neutral-200 font-medium font-sans">
        {label}
      </Text>
      <Pressable
        className="bg-neutral-50 rounded-lg px-2.5 h-[27px] w-[199px] justify-center"
        onPress={() => setShow(true)}
      >
        <Text className="text-text15 font-sans" style={{ color: '#242529' }}>
          {formatDate(value)}
        </Text>
      </Pressable>

      {/* Android */}
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date(2030, 11, 31)}
          minimumDate={new Date(2020, 0, 1)}
        />
      )}

      {/* iOS */}
      {show && Platform.OS === 'ios' && (
        <Modal
          visible={show}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <Pressable
            className="flex-1 bg-black/50 justify-end"
            onPress={handleCancel}
          >
            <Pressable
              className="bg-white rounded-t-3xl items-center"
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View className="flex-row justify-between items-center px-4 py-3 border-b border-neutral-100 w-full">
                <Pressable onPress={handleCancel}>
                  <Text className="text-text16 text-neutral-400 font-sans">
                    취소
                  </Text>
                </Pressable>
                <Text className="text-subtitle font-normal text-text-100 font-sans">
                  날짜 선택
                </Text>
                <Pressable onPress={handleConfirm}>
                  <Text className="text-text16 text-neutral-500 font-normal font-sans">
                    확인
                  </Text>
                </Pressable>
              </View>

              {/* Date Picker */}
              <View className="py-4 items-center w-full">
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleChange}
                  maximumDate={new Date(2030, 11, 31)}
                  minimumDate={new Date(2020, 0, 1)}
                  locale="ko-KR"
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};
