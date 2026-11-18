import { ReportReason } from '../types';

// ETC는 상세 사유 입력이 필수라 입력 화면이 생기기 전까지 제외
export const REPORT_REASONS: { reason: ReportReason; label: string }[] = [
  { reason: 'SPAM', label: '스팸·광고' },
  { reason: 'FRAUD', label: '사기 의심' },
  { reason: 'PROHIBITED_ITEM', label: '거래 금지 물품' },
  { reason: 'ABUSIVE', label: '욕설·비매너' },
];
