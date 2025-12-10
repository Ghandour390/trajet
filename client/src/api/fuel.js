import api from './axios';

// Get all fuel records
export const getFuelRecords = async (params = {}) => {
  const response = await api.get('/fuel', { params });
  return response.data;
};

// Get fuel records by trip ID
export const getFuelByTripId = async (tripId) => {
  const response = await api.get(`/fuel/trip/${tripId}`);
  return response.data;
};

// Get fuel record by ID
export const getFuelById = async (id) => {
  const response = await api.get(`/fuel/${id}`);
  return response.data;
};

// Create fuel record
export const createFuelRecord = async (fuelData) => {
  const response = await api.post('/fuel', fuelData);
  return response.data;
};

// Update fuel record
export const updateFuelRecord = async (id, data) => {
  const response = await api.put(`/fuel/${id}`, data);
  return response.data;
};

// Delete fuel record
export const deleteFuelRecord = async (id) => {
  const response = await api.delete(`/fuel/${id}`);
  return response.data;
};

// Get fuel statistics
export const getFuelStats = async (params = {}) => {
  const response = await api.get('/fuel/stats', { params });
  return response.data;
};

// Get fuel consumption report
export const getFuelReport = async (params = {}) => {
  const response = await api.get('/fuel/report', { params });
  return response.data;
};
