import api from './axios';

export const getReportStats = async (period = 'month') => {
  const response = await api.get('/reports/stats', {
    params: { period }
  });
  return response.data;
};

export const getFuelChartData = async (period = 'month') => {
  const response = await api.get('/reports/fuel-chart', {
    params: { period }
  });
  return response.data;
};

export const getKilometrageChartData = async (period = 'month') => {
  const response = await api.get('/reports/kilometrage-chart', {
    params: { period }
  });
  return response.data;
};
