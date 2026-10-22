import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { isAxiosError } from 'axios';
import { getWasteReports } from '../api/wasteReportsApi';
import { createEmptyReport, getReportYearMonth, mapWasteReport } from './reportMapper';
import { getSelectableMonths } from './reportMonths';
import { WasteReportApiResponse } from '../types';

// 전체 월 리포트를 한 번에 받아두고, 월 전환은 요청 없이 그중에서 고름
export const useMonthlyReport = (year: number, month: number) => {
  const [reports, setReports] = useState<WasteReportApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const loadReports = useCallback(async () => {
    try {
      // 이미 받은 리포트가 있으면 로딩 화면 없이 갱신 (탭 복귀 시 깜빡임 방지)
      if (!hasLoaded.current) setIsLoading(true);
      setError(null);
      const response = await getWasteReports();

      if (response.success && response.data) {
        setReports(response.data.reports);
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
    selectableMonths,
    isLoading,
    error: hasLoaded.current ? null : error,
    refresh: loadReports,
  };
};
