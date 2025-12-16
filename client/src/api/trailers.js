import api from './axios';

export const getTrailers = async () => {
  const response = await api.get('/trailers');
  return response.data;
};

export const getTrailerById = async (id) => {
  const response = await api.get(`/trailers/${id}`);
  return response.data;
};

export const createTrailer = async (trailerData) => {
  const response = await api.post('/trailers', trailerData);
  return response.data;
};

export const updateTrailer = async (id, trailerData) => {
  const response = await api.patch(`/trailers/${id}`, trailerData);
  return response.data;
};

export const deleteTrailer = async (id) => {
  const response = await api.delete(`/trailers/${id}`);
  return response.data;
};

export const getAvailableTrailers = async (startAt, endAt) => {
  const response = await api.get('/trailers/disponibles', {
    params: { startAt, endAt }
  });
  return response.data;
};
