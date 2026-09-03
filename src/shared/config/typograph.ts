export const FONT_SIZE = {
  title: ['24px', { lineHeight: 'normal' }], 
  subtitle: ['20px', { lineHeight: '24px' }],
  text16: ['16px', { lineHeight: 'normal' }],
  text15: ['15px', { lineHeight: 'normal' }], 
  text14: ['14px', { lineHeight: 'normal' }], 
} as const;

export type FontSize = keyof typeof FONT_SIZE;