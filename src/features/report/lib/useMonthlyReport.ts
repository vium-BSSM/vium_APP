import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { isAxiosError } from 'axios';
import { getWastePatterns, getWasteReports } from '../api/wasteReportsApi';
import {
  createEmptyReport,
  getReportYearMonth,
  mapWastePatterns,
  mapWasteReport,
} from './reportMapper';
import { getSelectableMonths } from './reportMonths';
import { WasteCategoryStat, WasteReportApiResponse } from '../types';

// 카테고리 통계는 부가 정보라 실패해도 리포트는 보여주고 차트만 숨김
const loadWasteCategories = async (): Promise<WasteCategoryStat[]> => {
  try {
    const response = await getWastePatterns();
    return response.success && response.data ? mapWastePatterns(response.data.patterns) : [];
  } catch (err) {
    console.error('Failed to load waste patterns:', err);
    return [];
  }
};

// 전체 월 리포트를 한 번에 받아두고, 월 전환은 요청 없이 그중에서 고름
export const useMonthlyReport = (year: number, month: number) => {
  const [reports, setReports] = useState<WasteReportApiResponse[]>([]);
  // 월 구분 없는 전체 기간 통계 (월별 카테고리 통계는 백엔드 미제공)
  const [wasteCategories, setWasteCategories] = useState<WasteCategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadReports = useCallback(async () => {
    try {
      // 이미 받은 리포트가 있으면 로딩 화면 없이 갱신 (탭 복귀 시 깜빡임 방지)
      if (!hasLoaded.current) setIsLoading(true);
      setError(null);
      const [response, categories] = await Promise.all([getWasteReports(), loadWasteCategories()]);

      if (response.success && response.data) {
        setReports(response.data.reports);
        setWasteCategories(categories);
        hasLoaded.current = true;
      } else {
        setError(response.error?.message || '리포트를 불러오지 못했어요.');
      }
    } catch (err) {
      console.error('Failed to load waste reports:', err);
      setError(
        isAxiosError(err) && err.response
          ? err.response.data?.error?.message || '리포트를 불러오지 못했어요.'
          : '서버와 연결할 수 없습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 다른 화면에서 재료를 섭취·폐기하고 돌아오면 최신 값으로 갱신
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const report = useMemo(() => {
    const found = reports.find((item) => {
      const period = getReportYearMonth(item);
      return period.year === year && period.month === month;
    });
    return found ? mapWasteReport(found) : createEmptyReport(year, month);
  }, [reports, year, month]);

  const selectableMonths = useMemo(
    () => getSelectableMonths(reports.map(getReportYearMonth)),
    [reports]
  );

  return {
    report,
    wasteCategories,
    selectableMonths,
    isLoading,
    error: hasLoaded.current ? null : error,
    refresh: loadReports,
  };
};
