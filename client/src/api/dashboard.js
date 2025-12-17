import api from './axios';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getRecentTrips = async () => {
  const response = await api.get('/dashboard/recent-trips');
  return response.data;
};

export const getVehiclesNeedingAttention = async () => {
  const response = await api.get('/dashboard/vehicles-attention');
  return response.data;
};

export const getFuelChartData = async (period = 'month') => {
  const response = await api.get('/dashboard/fuel-chart', { params: { period } });
  return response.data;
};

export const getKilometrageChartData = async (period = 'month') => {
  const response = await api.get('/dashboard/kilometrage-chart', { params: { period } });
  return response.data;
};
