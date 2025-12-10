import api from './axios';

// Get all maintenance records
export const getMaintenanceRecords = async (params = {}) => {
  const response = await api.get('/maintenance', { params });
  return response.data;
};

// Get maintenance by ID
export const getMaintenanceById = async (id) => {
  const response = await api.get(`/maintenance/${id}`);
  return response.data;
};

// Get maintenance by vehicle ID
export const getMaintenanceByVehicle = async (vehicleId) => {
  const response = await api.get(`/maintenance/vehicle/${vehicleId}`);
  return response.data;
};

// Create maintenance record
export const createMaintenance = async (maintenanceData) => {
  const response = await api.post('/maintenance', maintenanceData);
  return response.data;
};

// Update maintenance record
export const updateMaintenance = async (id, data) => {
  const response = await api.put(`/maintenance/${id}`, data);
  return response.data;
};

// Delete maintenance record
export const deleteMaintenance = async (id) => {
  const response = await api.delete(`/maintenance/${id}`);
  return response.data;
};

// Get maintenance statistics
export const getMaintenanceStats = async (params = {}) => {
  const response = await api.get('/maintenance/stats', { params });
  return response.data;
};

// Get upcoming maintenance
export const getUpcomingMaintenance = async () => {
  const response = await api.get('/maintenance/upcoming');
  return response.data;
};
