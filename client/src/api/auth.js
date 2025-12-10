import api from './axios';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  // console.log('Sending data:', userData);
  const response = await api.post('/auth/register', userData);
  console.log('Received response:', response.data);
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await api.post('/auth/logout', { refreshToken });
  return response.data;
};
