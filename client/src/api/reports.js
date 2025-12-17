import api from './axios';

export const getReportStats = async (period = 'month') => {
  const response = await api.get('/reports/stats', {
    params: { period }
  });
  return response.data;
};
