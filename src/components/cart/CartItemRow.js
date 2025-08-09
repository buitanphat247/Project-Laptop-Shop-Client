import React from 'react';
import { Button, InputNumber, Typography, Tag, Image } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CartItemRow = ({ item, updateQuantity, removeItem }) => (
    <tr className="bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200 cart-table-row">
        <td className="py-4 px-2 align-top">
            <div className="flex items-start gap-4 h-full">
                <Image
                    src={item.imageUrls[0]}
                    width={70}
                    height={70}
                    className="rounded-xl object-cover border border-gray-200 bg-gray-100 flex-shrink-0"
                    preview={false}
                />
                <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
                    <Text strong className="block text-base text-black cart-product-name">
                        {item.name}
                    </Text>
                    <div className="flex items-center gap-2 mt-auto">
                        <Tag color="blue" className="text-xs">{item.category.name}</Tag>
                        <Text className="text-sm text-gray-500">#{item.id}</Text>
                    </div>
                </div>
            </div>
        </td>
        <td className="text-center py-4 px-2 align-top">
            <div className="flex justify-center h-full">
                <div className="flex items-center">
                    <InputNumber
                        min={1}
                        value={item.quantity}
                        size="large"
                        className="w-24"
                        onChange={value => updateQuantity(item.cartItemId, value)}
                    />
                </div>
            </div>
        </td>
        <td className="text-right py-4 px-2 align-top">
            <div className="flex flex-col justify-center h-full space-y-1">
                <Text strong className="block text-lg text-black">
                    {(item.price * item.quantity).toLocaleString()}₫
                </Text>
                <Text className="text-sm text-gray-500">
                    {item.price.toLocaleString()}₫ × {item.quantity}
                </Text>
            </div>
        </td>
        <td className="text-center py-4 px-2 align-top">
            <div className="flex justify-center h-full">
                <div className="flex items-center">
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => removeItem(item)}
                        className="text-lg hover:bg-red-50"
                        title="Xóa sản phẩm"
                    />
                </div>
            </div>
        </td>
    </tr>
);

export default CartItemRow;