import React from 'react';
import { FaFacebookF } from 'react-icons/fa';

const FacebookButton = () => {
  return (
    <a
      href="https://m.me/your-facebook-page" // Thay thế bằng link Facebook page hoặc Messenger của bạn
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '70px', // Đặt cao hơn HotlineButton một chút
        right: '15px',
        width: '45px',
        height: '45px',
        backgroundColor: '#1877f2', // Facebook blue color
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '18px',
        zIndex: 1000,
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        textDecoration: 'none',
        animation: 'pulse 2s infinite',
        transition: 'all 0.3s ease',
      }}
      title="Nhắn tin Facebook"
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
      }}
    >
      <FaFacebookF />
    </a>
  );
};

export default FacebookButton;