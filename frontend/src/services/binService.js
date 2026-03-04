import apiClient from './apiClient.js';

export const binService = {
  getAllBins: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/bins?${params}`);
    return response.data;
  },

  getBinById: async (id) => {
    const response = await apiClient.get(`/bins/${id}`);
    return response.data;
  },

  createBin: async (binData) => {
    const response = await apiClient.post('/bins', binData);
    return response.data;
  },

  updateBin: async (id, binData) => {
    const response = await apiClient.put(`/bins/${id}`, binData);
    return response.data;
  },

  deleteBin: async (id) => {
    const response = await apiClient.delete(`/bins/${id}`);
    return response.data;
  },

  getBinAnalytics: async () => {
    const response = await apiClient.get('/bins/analytics');
    return response.data;
  },

  getNearbyBins: async (latitude, longitude, radius = 2) => {
    const response = await apiClient.get('/bins', {
      params: {
        latitude,
        longitude,
        radius,
      },
    });
    return response.data;
  },
};

export default binService;
