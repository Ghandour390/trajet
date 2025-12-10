import api from './axios';


// Get all users
export const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Get current user profile
export const getProfile = async () => {
  const response = await api.get('/auth/my');
  return response.data;
};

// Update user profile
export const updateProfile = async (id, data) => {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
};

// Update user by ID (admin)
export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Get all drivers
export const getDrivers = async () => {
  const response = await api.get('/users/drivers');
  return response.data;
};

// Change password
export const changePassword = async (data) => {
  const response = await api.post('/auth/change-password', data);
  return response.data;
};
