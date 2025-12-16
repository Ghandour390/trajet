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
