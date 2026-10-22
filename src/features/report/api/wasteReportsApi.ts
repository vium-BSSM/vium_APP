import { apiClient } from '@/shared/api/client';
import { WasteReportsApiResponse } from '../types';

export const getWasteReports = async (): Promise<WasteReportsApiResponse> => {
  const response = await apiClient.get<WasteReportsApiResponse>('/api/me/waste-reports');
  return response.data;
};
