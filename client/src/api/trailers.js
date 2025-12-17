import api from './axios';

export const getTrailers = async () => {
  const { data } = await api.get('/trailers');
  return data;
};

export const getTrailerById = async (id) => {
  const { data } = await api.get(`/trailers/${id}`);
  return data;
};

export const createTrailer = async (trailerData) => {
  const { data } = await api.post('/trailers', trailerData);
  return data;
};

export const updateTrailer = async (id, trailerData) => {
  const { data } = await api.put(`/trailers/${id}`, trailerData);
  return data;
};

export const deleteTrailer = async (id) => {
  const { data } = await api.delete(`/trailers/${id}`);
  return data;
};

export const getAvailableTrailers = async (startAt, endAt) => {
  const { data } = await api.get('/trailers/disponibles', { params: { startAt, endAt } });
  return data;
};

export const getTrailerWithTires = async (id) => {
  const { data } = await api.get(`/trailers/${id}/tires`);
  return data;
};
