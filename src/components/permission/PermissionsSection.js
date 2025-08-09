import React from 'react';
import { Card, Row, Col, Badge, Button, Divider, Switch, Input } from 'antd';
import { ToolOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

const PermissionsSection = ({ permissionsData, onSearch, getPriorityColor }) => (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Danh sách Quyền</h2>
        <p className="text-gray-600">Quản lý các quyền truy cập trong hệ thống</p>
      </div>
      <Search
        placeholder="Tìm kiếm quyền..."
        allowClear
        onSearch={onSearch}
        style={{ width: 300 }}
      />
    </div>
    <Row gutter={[16, 16]}>
      {permissionsData.map((permission) => (
        <Col xs={24} sm={12} lg={8} key={permission.id}>
          <Card className="dashboard-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  <ToolOutlined className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{permission.name}</h3>
                  <p className="text-sm text-gray-600">{permission.description}</p>
                </div>
              </div>
              <Badge
                status={permission.status === 'active' ? 'success' : 'error'}
                text={permission.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Routes:</span>
                <Badge count={permission.routes} style={{ backgroundColor: '#3b82f6' }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Người dùng:</span>
                <Badge count={permission.users} style={{ backgroundColor: '#10b981' }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Độ ưu tiên:</span>
                <Badge
                  count={permission.priority === 'high' ? 'Cao' : permission.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  style={{ backgroundColor: getPriorityColor(permission.priority) }}
                />
              </div>
            </div>
            <Divider className="my-3" />
            <div className="flex gap-2">
              <Button size="small" className="flex-1">
                <EditOutlined /> Chỉnh sửa
              </Button>
              <Switch
                checked={permission.status === 'active'}
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<CloseCircleOutlined />}
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default PermissionsSection;