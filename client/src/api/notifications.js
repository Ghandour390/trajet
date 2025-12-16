import api from './axios';

export const getNotifications = async (filters = {}) => {
  const response = await api.get('/notifications', { params: filters });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
};

export const checkAlerts = async () => {
  const response = await api.post('/notifications/check-alerts');
  return response.data;
};

export const validateTrip = async (data) => {
  const response = await api.post('/notifications/validate-trip', data);
  return response.data;
};
