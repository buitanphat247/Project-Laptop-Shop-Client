import axiosClient from '../config/axios';

export const userService = {
  // Lấy thông tin user
  getUser: async (userId) => {
    try {
      const response = await axiosClient.get(`/users/${userId}`);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }
};

