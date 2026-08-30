import apiClient from './apiClient.js';

export const vehicleService = {
  getAllVehicles: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/vehicles?${params}`);
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await apiClient.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicleLocation: async (id, locationData) => {
    const response = await apiClient.put(`/vehicles/${id}/location`, locationData);
    return response.data;
  },

  updateVehicleStatus: async (id, status) => {
    const response = await apiClient.put(`/vehicles/${id}/status`, { status });
    return response.data;
  },

  getVehicleAnalytics: async () => {
    const response = await apiClient.get('/vehicles/analytics');
    return response.data;
  },
};

export default vehicleService;
