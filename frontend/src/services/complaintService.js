import apiClient from './apiClient.js';

export const complaintService = {
  createComplaint: async (complaintData) => {
    const response = await apiClient.post('/complaints', complaintData);
    return response.data;
  },

  getComplaints: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await apiClient.get(`/complaints?${params}`);
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await apiClient.get(`/complaints/${id}`);
    return response.data;
  },

  updateComplaintStatus: async (id, statusData) => {
    const response = await apiClient.put(`/complaints/${id}/status`, statusData);
    return response.data;
  },

  assignComplaint: async (id, assignedTo) => {
    const response = await apiClient.put(`/complaints/${id}/assign`, { assignedTo });
    return response.data;
  },

  getComplaintAnalytics: async () => {
    const response = await apiClient.get('/complaints/analytics');
    return response.data;
  },
};

export default complaintService;
