import api from '../api/axios';

const authConfig = (token) => {
  if (!token) return {};
  return { headers: { Authorization: `Bearer ${token}` } };
};

const getTrailers = async (token) => {
  const res = await api.get('/trailers', authConfig(token));
  return res.data;
};

const getTrailerById = async (id, token) => {
  const res = await api.get(`/trailers/${id}`, authConfig(token));
  return res.data;
};

const createTrailer = async (payload, token) => {
  const res = await api.post('/trailers', payload, authConfig(token));
  return res.data;
};

const updateTrailer = async (id, payload, token) => {
  const res = await api.put(`/trailers/${id}`, payload, authConfig(token));
  return res.data;
};

const deleteTrailer = async (id, token) => {
  const res = await api.delete(`/trailers/${id}`, authConfig(token));
  return res.data;
};

export default {
  getTrailers,
  getTrailerById,
  createTrailer,
  updateTrailer,
  deleteTrailer,
};
