import React from 'react';
import { Typography, Tag } from 'antd';

const { Text } = Typography;

const ProductPrice = ({ price, formatPrice }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-baseline gap-3">
            <Text className="text-2xl font-bold text-red-600">
                {formatPrice(price)}
            </Text>
            <Text delete className="text-sm text-gray-400">
                {formatPrice(price * 1.2)}
            </Text>
            <Tag color="red" className="text-xs">-17%</Tag>
        </div>
    </div>
);

export default ProductPrice;