import React, { useState } from 'react';
import { Table, Tag, Switch, Popconfirm, Space, Button, Card, Modal, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SecurityScanOutlined } from '@ant-design/icons';

const PermissionTable = ({ data }) => {
  const [permissions, setPermissions] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);

  const togglePermission = (path, permission, enabled) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((item) => {
        if (item.path === path) {
          let updatedPermissions = [...item.permissions];
          if (enabled) {
            if (!updatedPermissions.includes(permission)) {
              updatedPermissions.push(permission);
            }
          } else {
            updatedPermissions = updatedPermissions.filter((p) => p !== permission);
          }

          // Đảm bảo không có quyền trùng lặp và giá trị null
          updatedPermissions = [...new Set(updatedPermissions.filter(Boolean))];

          return { ...item, permissions: updatedPermissions };
        }
        return item;
      })
    );
  };

  const deleteRoute = (path) => {
    setPermissions((prevPermissions) =>
      prevPermissions.filter((item) => item.path !== path)
    );
  };

  const handleEdit = (record) => {
    setCurrentRoute(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentRoute(null);
  };

  const handlePermissionToggle = (permission, enabled) => {
    if (currentRoute) {
      togglePermission(currentRoute.path, permission, enabled);
    }
  };

  const getPermissionColor = (permission) => {
    if (permission.includes('admin')) return 'red';
    if (permission.includes('manager')) return 'blue';
    if (permission.includes('user')) return 'green';
    return 'default';
  };

  const columns = [
    {
      title: 'Tên Route',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div className="flex items-center">
          <SecurityScanOutlined className="text-blue-500 mr-2" />
          <span className="font-medium text-gray-900">{text}</span>
        </div>
      ),
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'path',
      key: 'path',
      render: (text) => (
        <Tag color="blue" className="font-mono text-xs">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Quyền truy cập',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Space wrap>
          {permissions.map((permission) => (
            <Badge
              key={permission}
              count={permission}
              style={{
                backgroundColor: getPermissionColor(permission) === 'red' ? '#ef4444' :
                                getPermissionColor(permission) === 'blue' ? '#3b82f6' :
                                getPermissionColor(permission) === 'green' ? '#10b981' : '#6b7280',
                color: 'white',
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '12px'
              }}
            />
          ))}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
            onClick={() => handleEdit(record)}
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa route này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => deleteRoute(record.path)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              className="hover:bg-red-600"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card 
        title={
          <div className="flex items-center">
            <SecurityScanOutlined className="text-blue-500 mr-2" />
            <span className="text-lg font-semibold">Quản lý quyền truy cập</span>
          </div>
        } 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
          >
            Thêm route mới
          </Button>
        }
        className="shadow-sm"
      >
        <Table 
          columns={columns} 
          dataSource={permissions} 
          rowKey="path"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} routes`,
          }}
          className="custom-table"
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="text-blue-500 mr-2" />
            <span>Chỉnh sửa quyền truy cập</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        width={500}
      >
        {currentRoute && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Route: {currentRoute.name}</h3>
              <p className="text-sm text-gray-600 font-mono">{currentRoute.path}</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cấp quyền truy cập:</h4>
              {['admin', 'product_manager', 'order_manager', 'user_manager', 'news_manager'].map((permission) => (
                <div key={permission} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Badge
                      count={permission}
                      style={{
                        backgroundColor: getPermissionColor(permission) === 'red' ? '#ef4444' :
                                        getPermissionColor(permission) === 'blue' ? '#3b82f6' :
                                        getPermissionColor(permission) === 'green' ? '#10b981' : '#6b7280',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {permission === 'admin' && 'Quản trị viên'}
                      {permission === 'product_manager' && 'Quản lý sản phẩm'}
                      {permission === 'order_manager' && 'Quản lý đơn hàng'}
                      {permission === 'user_manager' && 'Quản lý người dùng'}
                      {permission === 'news_manager' && 'Quản lý tin tức'}
                    </span>
                  </div>
                  <Switch
                    checked={currentRoute.permissions.includes(permission)}
                    onChange={(checked) => handlePermissionToggle(permission, checked)}
                    className="bg-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PermissionTable;