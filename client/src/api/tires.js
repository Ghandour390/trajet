import api from './axios';

export const getTires = async (filters = {}) => {
  const response = await api.get('/tires', { params: filters });
  return response.data;
};

export const getTireById = async (id) => {
  const response = await api.get(`/tires/${id}`);
  return response.data;
};

export const createTire = async (tireData) => {
  const response = await api.post('/tires', tireData);
  return response.data;
};

export const updateTire = async (id, tireData) => {
  const response = await api.patch(`/tires/${id}`, tireData);
  return response.data;
};

export const deleteTire = async (id) => {
  const response = await api.delete(`/tires/${id}`);
  return response.data;
};

export const getTiresNeedingAttention = async () => {
  const response = await api.get('/tires/attention');
  return response.data;
};

export const addTireInspection = async (id, inspectionData) => {
  const response = await api.post(`/tires/${id}/inspection`, inspectionData);
  return response.data;
};

export const rotateTire = async (id, rotationData) => {
  const response = await api.post(`/tires/${id}/rotate`, rotationData);
  return response.data;
};

export const getTireAlerts = async (filters = {}) => {
  const response = await api.get('/tires/alerts', { params: filters });
  return response.data;
};

export const resolveTireAlert = async (id) => {
  const response = await api.put(`/tires/alerts/${id}/resolve`);
  return response.data;
};
