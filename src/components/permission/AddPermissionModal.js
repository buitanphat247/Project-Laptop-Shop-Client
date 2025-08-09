import React from 'react';
import { Modal, Button, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddPermissionModal = ({ visible, onCancel }) => (
  <Modal
    title={
      <div className="flex items-center">
        <PlusOutlined className="text-blue-500 mr-2" />
        <span>Thêm Route mới</span>
      </div>
    }
    open={visible}
    onCancel={onCancel}
    footer={[
      <Button key="cancel" onClick={onCancel}>
        Hủy
      </Button>,
      <Button key="submit" type="primary" className="bg-blue-500 hover:bg-blue-600 border-blue-500">
        Thêm Route
      </Button>,
    ]}
    width={600}
  >
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên Route
        </label>
        <Input placeholder="Nhập tên route..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đường dẫn
        </label>
        <Input placeholder="/admin/example" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả
        </label>
        <Input.TextArea placeholder="Mô tả route..." rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quyền truy cập
        </label>
        <Select
          mode="multiple"
          placeholder="Chọn quyền truy cập"
          style={{ width: '100%' }}
        >
          <Option value="admin">Admin</Option>
          <Option value="product_manager">Product Manager</Option>
          <Option value="order_manager">Order Manager</Option>
          <Option value="user_manager">User Manager</Option>
          <Option value="news_manager">News Manager</Option>
        </Select>
      </div>
    </div>
  </Modal>
);

export default AddPermissionModal;