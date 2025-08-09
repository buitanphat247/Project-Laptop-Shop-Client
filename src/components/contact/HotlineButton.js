import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

const HotlineButton = () => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <a
      href="tel:0909123456"
      style={{
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        width: '45px',
        height: '45px',
        backgroundColor: '#e74c3c',
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
      title="Gọi hotline"
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
      }}
    >
      <FaPhoneAlt />
    </a>
  );
};

export default HotlineButton;
