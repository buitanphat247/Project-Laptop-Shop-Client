import axiosClient from '../config/axios';

export const supportService = {
  // Lấy tin nhắn của user
  loadUserMessages: async (userId, role) => {
    try {
      const response = await axiosClient.get(`/load-messages/${userId}?role=${role}`);
      return response.data?.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Lấy tin nhắn của admin
  loadAdminMessages: async (userId) => {
    try {
      const response = await axiosClient.get(`/load-messages/${userId}?role=admin`);
      return response.data?.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Lấy tin nhắn giữa 2 user
  getMessagesBetweenUsers: async (userId, targetUserId) => {
    try {
      const response = await axiosClient.get(`/messages/${userId}/${targetUserId}`);
      return response.data?.data || [];
    } catch (error) {
      throw error;
    }
  }
};

