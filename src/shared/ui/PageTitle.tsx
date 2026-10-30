import React from 'react';
import { Text } from 'react-native';

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

/**
 * 화면 상단 안내 문구 (예: "비움에 오신걸 환영해요!\n함께 시작해요")
 * 태블릿에서 단계적으로 커짐: 24px → md 28px → lg 32px
 * 간격(margin)·정렬은 className으로 전달
 */
export const PageTitle: React.FC<PageTitleProps> = ({ children, className = '', style }) => {
  return (
    <Text
      className={`text-heading-lg md:text-[28px] lg:text-[32px] font-medium text-text-100 font-sans ${className}`}
      style={style}
    >
      {children}
    </Text>
  );
};
