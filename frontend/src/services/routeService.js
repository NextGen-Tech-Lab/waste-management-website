import apiClient from './apiClient.js';

export const routeService = {
  createRoute: async (routeData) => {
    const response = await apiClient.post('/routes', routeData);
    return response.data;
  },

  getRoutes: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/routes?${params}`);
    return response.data;
  },

  getRouteById: async (id) => {
    const response = await apiClient.get(`/routes/${id}`);
    return response.data;
  },

  updateRouteStatus: async (id, status) => {
    const response = await apiClient.put(`/routes/${id}/status`, { status });
    return response.data;
  },

  updateRouteStop: async (id, stopData) => {
    const response = await apiClient.put(`/routes/${id}/stop`, stopData);
    return response.data;
  },

  getRouteAnalytics: async () => {
    const response = await apiClient.get('/routes/analytics');
    return response.data;
  },

  getLogisticsMapData: async (city = 'chennai') => {
    const response = await apiClient.get(`/routes/logistics-map?city=${city}`);
    return response.data;
  },

  getLogisticsLiveData: async (city = 'chennai') => {
    const response = await apiClient.get(`/routes/logistics-live?city=${city}`);
    return response.data;
  },

  updateLogisticsLiveToggle: async (type, id, enabled, city = 'chennai') => {
    const response = await apiClient.put(`/routes/logistics-live/toggle?city=${city}`, {
      type,
      id,
      enabled,
    });
    return response.data;
  },

  seedChennaiDemoData: async () => {
    const response = await apiClient.post('/routes/seed-demo/chennai');
    return response.data;
  },
};

export default routeService;
