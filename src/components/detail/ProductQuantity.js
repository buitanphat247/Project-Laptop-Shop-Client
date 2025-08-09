import React from 'react';
import { InputNumber, Typography } from 'antd';

const { Text } = Typography;

const ProductQuantity = ({ quantity, setQuantity, stock }) => {
    const handleChange = (value) => {
        if (!value || value < 1) {
            setQuantity(1);
        } else if (value > stock) {
            setQuantity(stock);
        } else {
            setQuantity(value);
        }
    };

    return (
        <div>
            <Text strong className="block mb-2 text-sm">Số lượng:</Text>
            <div className="flex items-center gap-3">
                <InputNumber
                    min={1}
                    max={stock}
                    value={quantity}
                    onChange={handleChange}
                    disabled={stock === 0}
                    className="w-24"
                    size="small"
                />
                <Text className="text-gray-500 text-sm">
                    ({stock} sản phẩm có sẵn)
                </Text>
            </div>
        </div>
    );
};

export default ProductQuantity;