// NativeWind가 플랫폼별로 Tailwind를 컴파일할 때 설정하는 값 ('ios' | 'android' | 'web')
const isWeb = process.env.NATIVEWIND_OS === 'web';

// 웹(PWA)은 app/+html.tsx에서 화면을 아이폰 크기(402px)로 고정하지만, 미디어쿼리는 브라우저 창 너비 기준이라
// 데스크톱에서 md:/lg: 태블릿 스타일이 적용되어 버림 → 웹에서는 breakpoint를 꺼서 항상 폰 레이아웃 사용
const webScreens = {
  sm: '99999px',
  md: '99999px',
  lg: '99999px',
  xl: '99999px',
  '2xl': '99999px',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    ...(isWeb && { screens: webScreens }),
    extend: {
      spacing: {
        // 화면 좌우 그리드 마진 — 전 화면 공통 (px-screen)
        screen: '30px',
      },
      fontFamily: {
        sans: ['Paperlogy', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          100: '#F7FCF4',
          200: '#E7F6DE',
          300: '#CBEBB7',
          400: '#C1E7A9',
          500: '#B2E194',
          600: '#A2CD87',
          700: '#7EA069',
          800: '#4B5F3E',
        },
        secondary: {
          100: '#FFF4FB',
          200: '#FFD0EF',
          300: '#FFBCE9',
          400: '#FFA0DF',
          500: '#B36298',
          600: '#9C5584',
        },
        neutral: {
          10: '#F4F3F3',
          50: '#EBEBEB',
          100: '#C0C0C0',
          200: '#A1A1A1',
          300: '#767676',
          400: '#5C5C5C',
          500: '#333333',
          700: '#242424',
          800: '#151515',
        },
        text: {
          50: 'rgba(36, 37, 41, 0.5)',
          100: '#242529',
          200: '#737785',
          300: '#A7A9B5',
          400: '#FAFAFA',
        },
        status: {
          danger: '#FF7171',
          'danger-bg': '#FFE5EF',
          'danger-text': '#FF3B8C',
          normal: '#FDCF73',
          'normal-bg': '#FFF4E5',
          'normal-text': '#FF9500',
          good: '#88E0C3',
          'good-bg': '#E5F5FF',
          'good-text': '#007AFF',
        },
      },
      fontSize: {
        'heading-lg': ['24px', { lineHeight: 'normal' }],
        'heading-md': ['20px', { lineHeight: 'normal' }],
        text18: ['18px', { lineHeight: 'normal' }],
        text16: ['16px', { lineHeight: 'normal' }],
        text15: ['15px', { lineHeight: 'normal' }],
        text14: ['14px', { lineHeight: 'normal' }],
        text12: ['12px', { lineHeight: 'normal' }],
        text10: ['10px', { lineHeight: 'normal' }],
      },
    },
  },
  plugins: [],
}
