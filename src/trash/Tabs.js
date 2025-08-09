import React from 'react';
import { Button } from 'antd';
import { SecurityScanOutlined, TeamOutlined, KeyOutlined } from '@ant-design/icons';

const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="mb-6">
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        type={activeTab === 'routes' ? 'primary' : 'default'}
        icon={<SecurityScanOutlined />}
        onClick={() => setActiveTab('routes')}
        className={activeTab === 'routes' ? 'bg-blue-500 hover:bg-blue-600 border-blue-500' : ''}
      >
        Quản lý Routes
      </Button>
      <Button
        type={activeTab === 'roles' ? 'primary' : 'default'}
        icon={<TeamOutlined />}
        onClick={() => setActiveTab('roles')}
        className={activeTab === 'roles' ? 'bg-blue-500 hover:bg-blue-600 border-blue-500' : ''}
      >
        Vai trò & Quyền
      </Button>
      <Button
        type={activeTab === 'permissions' ? 'primary' : 'default'}
        icon={<KeyOutlined />}
        onClick={() => setActiveTab('permissions')}
        className={activeTab === 'permissions' ? 'bg-blue-500 hover:bg-blue-600 border-blue-500' : ''}
      >
        Danh sách Quyền
      </Button>
    </div>
  </div>
);

export default Tabs;