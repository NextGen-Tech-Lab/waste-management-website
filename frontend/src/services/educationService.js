import apiClient from './apiClient.js';

export const educationService = {
  getContent: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/education?${params}`);
    return response.data;
  },

  getContentById: async (id) => {
    const response = await apiClient.get(`/education/${id}`);
    return response.data;
  },

  createContent: async (contentData) => {
    const response = await apiClient.post('/education', contentData);
    return response.data;
  },

  updateContent: async (id, contentData) => {
    const response = await apiClient.put(`/education/${id}`, contentData);
    return response.data;
  },

  deleteContent: async (id) => {
    const response = await apiClient.delete(`/education/${id}`);
    return response.data;
  },

  likeContent: async (id) => {
    const response = await apiClient.put(`/education/${id}/like`);
    return response.data;
  },

  getContentAnalytics: async () => {
    const response = await apiClient.get('/education/analytics');
    return response.data;
  },
};

export default educationService;
