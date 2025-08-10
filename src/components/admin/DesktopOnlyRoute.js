import React from 'react';
import { useDeviceType } from '../../utils/deviceUtils';
import { Result, Button } from 'antd';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';

const DesktopOnlyRoute = ({ children, fallback = null }) => {
  const { deviceType, screenSize } = useDeviceType();

  // Nếu là desktop, hiển thị children
  if (deviceType === 'desktop') {
    return children;
  }

  // Nếu có fallback component, hiển thị fallback
  if (fallback) {
    return fallback;
  }

  // Default fallback - hiển thị thông báo
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
        subTitle={`Màn hình hiện tại: ${screenSize.width}px x ${screenSize.height}px (${deviceType})`}
        extra={[
          <Button 
            type="primary" 
            key="home"
            onClick={() => window.location.href = '/'}
            icon={<MobileOutlined />}
          >
            Về trang chủ
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
    </div>
  );
};

export default DesktopOnlyRoute;



