import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { SecurityScanOutlined, CheckCircleOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

const StatsCards = ({ statsData }) => (
  <Row gutter={[16, 16]} className="mb-6">
    <Col xs={24} sm={12} lg={6}>
      <Card className="dashboard-card">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <SecurityScanOutlined className="text-blue-600 text-xl" />
          </div>
          <div>
            <Statistic
              title="Tổng Routes"
              valueRender={() => (
                <CountUp end={statsData.totalRoutes} duration={2.5} separator="," />
              )}
              valueStyle={{ color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}
            />
            <p className="text-xs text-gray-500 mt-1">
              <CountUp end={statsData.activeRoutes} duration={2.5} separator="," /> đang hoạt động
            </p>
          </div>
        </div>
      </Card>
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <Card className="dashboard-card">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4">
            <CheckCircleOutlined className="text-green-600 text-xl" />
          </div>
          <div>
            <Statistic
              title="Quyền truy cập"
              valueRender={() => (
                <CountUp end={statsData.totalPermissions} duration={2.5} separator="," />
              )}
              valueStyle={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Đã cấp phép
            </p>
          </div>
        </div>
      </Card>
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <Card className="dashboard-card">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <TeamOutlined className="text-purple-600 text-xl" />
          </div>
          <div>
            <Statistic
              title="Người dùng Admin"
              valueRender={() => (
                <CountUp end={statsData.adminUsers} duration={2.5} separator="," />
              )}
              valueStyle={{ color: '#8b5cf6', fontSize: '24px', fontWeight: 'bold' }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Quản trị viên
            </p>
          </div>
        </div>
      </Card>
    </Col>
    <Col xs={24} sm={12} lg={6}>
      <Card className="dashboard-card">
        <div className="flex items-center">
          <div className="p-3 bg-orange-100 rounded-lg mr-4">
            <UserOutlined className="text-orange-600 text-xl" />
          </div>
          <div>
            <Statistic
              title="Người dùng thường"
              valueRender={() => (
                <CountUp end={statsData.regularUsers} duration={2.5} separator="," />
              )}
              valueStyle={{ color: '#f59e0b', fontSize: '24px', fontWeight: 'bold' }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Khách hàng
            </p>
          </div>
        </div>
      </Card>
    </Col>
  </Row>
);

export default StatsCards;