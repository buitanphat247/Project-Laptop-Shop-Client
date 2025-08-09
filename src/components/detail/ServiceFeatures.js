import React from 'react';
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

const ServiceFeatures = ({ SERVICE_FEATURES }) => (
    <div className="bg-gray-50 border rounded-lg p-4">
        <Row gutter={[8, 8]}>
            {SERVICE_FEATURES.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                    <Col span={8} key={index}>
                        <div className="text-center">
                            <IconComponent className={`text-lg ${feature.color} mb-1`} />
                            <Text className="block text-xs font-medium">{feature.title}</Text>
                            <Text className="text-xs text-gray-500">{feature.desc}</Text>
                        </div>
                    </Col>
                );
            })}
        </Row>
    </div>
);

export default ServiceFeatures;