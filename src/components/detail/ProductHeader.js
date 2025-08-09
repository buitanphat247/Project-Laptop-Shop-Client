import React from 'react';
import { Tag, Typography, Rate } from 'antd';

const { Title, Text } = Typography;

const ProductHeader = ({ product, stockStatus }) => (
    <div>
        <div className="flex items-center gap-2 mb-2">
            <Tag color="blue" className="text-xs">
                {product.category?.name || 'Chưa phân loại'}
            </Tag>
            <Tag color={stockStatus.color} className="text-xs">
                {stockStatus.text}
            </Tag>
        </div>

        <Title level={3} className="mb-2 text-gray-800 leading-snug">
            {product.name}
        </Title>

        <div className="flex items-center gap-3 mb-3">
            <Rate disabled defaultValue={4.5} className="text-sm" />
            <Text className="text-gray-500 text-sm">(128 đánh giá)</Text>
            <Text className="text-gray-500 text-sm">•</Text>
            <Text className="text-gray-500 text-sm">Đã bán 1.2k</Text>
        </div>
    </div>
);

export default ProductHeader;