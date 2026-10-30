import { apiClient } from '@/shared/api/client';
import { WastePatternsApiResponse, WasteReportsApiResponse } from '../types';

export const getWasteReports = async (): Promise<WasteReportsApiResponse> => {
  const response = await apiClient.get<WasteReportsApiResponse>('/api/me/waste-reports');
  return response.data;
};

export const getWastePatterns = async (): Promise<WastePatternsApiResponse> => {
  const response = await apiClient.get<WastePatternsApiResponse>('/api/me/waste-patterns');
  return response.data;
};
