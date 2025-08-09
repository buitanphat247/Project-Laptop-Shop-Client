import React from 'react';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast Configuration Component
const ToastConfig = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      limit={1}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="light"
      transition={Bounce}
      // Thêm styling tùy chỉnh
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      progressClassName="custom-toast-progress"
    />
  );
};

// Toast helper functions (optional)
export const toastConfig = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "light",
  transition: Bounce,
};

// Export default ToastConfig component
export default ToastConfig;