import React from 'react';
import { FaCommentDots } from 'react-icons/fa';

const ZaloButton = () => {
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
            href="https://zalo.me/0909123456" // Thay thế bằng số Zalo của bạn
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '125px', // Cao hơn FacebookButton (70px) để không overlap
                right: '15px',
                width: '45px',
                height: '45px',
                backgroundColor: '#0180C7', // Zalo blue color
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
            title="Nhắn tin Zalo"
            onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }}
        >
            <FaCommentDots />
        </a>
    );
};

export default ZaloButton;