import api from './axios';

// Get all vehicles
export const getVehicles = async (params = {}) => {
  const response = await api.get('/vehicles', { params });
  return response.data;
};

// Get vehicle by ID
export const getVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

// Create new vehicle
export const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

// Update vehicle
export const updateVehicle = async (id, data) => {
  const response = await api.put(`/vehicles/${id}`, data);
  return response.data;
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};

// Get vehicle statistics
export const getVehicleStats = async () => {
  const response = await api.get('/vehicles/stats');
  return response.data;
};

// Assign driver to vehicle
export const assignDriver = async (vehicleId, driverId) => {
  const response = await api.patch(`/vehicles/${vehicleId}/driver`, { driverId });
  return response.data;
};
