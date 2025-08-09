import React from 'react';
import { Row, Col, Divider, Tag } from 'antd';
import CardPermission from '../card/CardPermission';

const methodColor = (method) => {
  switch (method) {
    case 'GET': return 'green';
    case 'POST': return 'blue';
    case 'PUT': return 'orange';
    case 'DELETE': return 'red';
    default: return 'default';
  }
};

const PermissionGroup = ({ method, permissions, switchStates, onSwitchChange }) => (
  <div style={{ marginBottom: 32 }}>
    <Divider orientation="left">
      <Tag color={methodColor(method)} style={{ fontSize: 16, padding: '2px 16px' }}>{method}</Tag>
    </Divider>
    <Row gutter={[24, 24]}>
      {permissions.length === 0 && (
        <Col>
          <span className="text-gray-400">Không có route nào</span>
        </Col>
      )}
      {permissions.map((perm) => (
        <Col xs={24} sm={12} md={8} lg={6} xl={6} key={perm.id}>
          <CardPermission
            perm={perm}
            checked={switchStates[perm.id]}
            onSwitchChange={checked => onSwitchChange(perm.id, checked)}
          />
        </Col>
      ))}
    </Row>
  </div>
);

export default PermissionGroup;