import axiosClient from '../config/axios';

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async (params = {}) => {
    try {
      const response = await axiosClient.get('/product', { params });
      return response.data?.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm
  getProduct: async (productId) => {
    try {
      const response = await axiosClient.get(`/get-product/${productId}`);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm với userId (để check favorite)
  getProductWithUserId: async (productId, userId) => {
    try {
      const response = await axiosClient.get(`/get-product-double-id/${productId}/${userId}`);
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  }
};

