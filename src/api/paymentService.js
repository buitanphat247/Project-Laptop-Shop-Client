import axiosClient from '../config/axios';

export const paymentService = {
  // Tạo thanh toán VNPay
  createVNPayPayment: async (paymentData) => {
    try {
      const response = await axiosClient.post('/payment-vnpay', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xử lý return từ VNPay
  handleVNPayReturn: async (queryParams) => {
    try {
      const response = await axiosClient.get('/vnpay-return', { params: queryParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

