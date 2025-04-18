import api from './api';

export const getAllProducts = async () => {
  const response = await api.get('/products'); // adjust endpoint if different
  return response.data;
};
