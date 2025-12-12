import api from './axios';

// Get all trips
export const getTrips = async (params = {}) => {
  const response = await api.get('/trips', { params });
  return response.data;
};

// Get my trips (for drivers)
export const getMyTrips = async () => {
  const response = await api.get('/trips/my');
  return response.data;
};

// Get trip by ID
export const getTripById = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data;
};

// Create new trip
export const createTrip = async (tripData) => {
  const response = await api.post('/trips', tripData);
  return response.data;
};

// Update trip
export const updateTrip = async (id, data) => {
  const response = await api.patch(`/trips/${id}`, data);
  return response.data;
};

// Update trip status
export const updateTripStatus = async (id, status) => {
  const response = await api.patch(`/trips/${id}/status`, { status });
  return response.data;
};
// sesir kilométrage
export const updateTripMileage = async (id, startKm, endKm ,description) => {
  const response = await api.patch(`/trips/${id}/mileage`, { startKm, endKm, description });
  return response.data;
};
// Delete trip
export const deleteTrip = async (id) => {
  const response = await api.delete(`/trips/${id}`);
  return response.data;
};

// Get trip statistics
export const getTripStats = async (params = {}) => {
  const response = await api.get('/trips/stats', { params });
  return response.data;
};

// Get available drivers for a date
export const getAvailableDrivers = async (startAt, endAt) => {
  const response = await api.get('/users/disponibles', { params: { startAt, endAt } });
  return response.data;
};

// Get available vehicles for a date
export const getAvailableVehicles = async (startAt, endAt) => {
  const response = await api.get('/vehicles/disponibles', { params: { startAt, endAt } });
  return response.data;
};

// Get available trailers for a date
export const getAvailableTrailers = async (startAt, endAt) => {
  const response = await api.get('/trailers/disponibles', { params: { startAt, endAt } });
  return response.data;
};
