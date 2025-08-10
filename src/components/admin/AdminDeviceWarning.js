import React from 'react';
import { Alert } from 'antd';
import { DesktopOutlined, MobileOutlined } from '@ant-design/icons';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

const AdminDeviceWarning = () => {
  const { deviceType, isDesktop } = useDeviceDetection();

  // Chỉ hiển thị cảnh báo nếu không phải desktop
  if (isDesktop) {
    return null;
  }

  return (
    <Alert
      message={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MobileOutlined />
          <span>Admin Panel được tối ưu cho Desktop</span>
        </div>
      }
      description={`Bạn đang sử dụng ${deviceType}. Để có trải nghiệm tốt nhất, vui lòng truy cập Admin Panel trên máy tính.`}
      type="warning"
      showIcon
      closable
      style={{
        marginBottom: '16px',
        borderRadius: '6px'
      }}
      icon={<DesktopOutlined />}
    />
  );
};

export default AdminDeviceWarning;



