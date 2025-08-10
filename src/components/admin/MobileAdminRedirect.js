import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../utils/deviceUtils';
import { Result, Button, Spin } from 'antd';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';

const MobileAdminRedirect = ({ children }) => {
  const { deviceType, screenSize } = useDeviceType();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu không phải desktop, redirect sau 3 giây
    if (deviceType !== 'desktop') {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [deviceType, navigate]);

  // Nếu là desktop, hiển thị children
  if (deviceType === 'desktop') {
    return children;
  }

  // Nếu không phải desktop, hiển thị thông báo và redirect
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <Result
        icon={<DesktopOutlined style={{ color: '#1890ff', fontSize: '64px' }} />}
        title="Admin Panel chỉ khả dụng trên Desktop"
        subTitle={`Đang chuyển hướng về trang chủ trong 3 giây... (${deviceType}: ${screenSize.width}px x ${screenSize.height}px)`}
        extra={[
          <Button 
            type="primary" 
            key="home"
            onClick={() => navigate('/', { replace: true })}
            icon={<MobileOutlined />}
          >
            Về trang chủ ngay
          </Button>,
          <Button 
            key="refresh"
            onClick={() => window.location.reload()}
          >
            Làm mới trang
          </Button>
        ]}
        style={{
          maxWidth: '500px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Spin size="small" />
        <span>Redirecting...</span>
      </div>
    </div>
  );
};

export default MobileAdminRedirect;



