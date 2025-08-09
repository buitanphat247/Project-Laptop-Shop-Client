import React from 'react';
import {
    Button,
    Image,
    InputNumber,
    Typography,
    Divider,
    Tag,
} from 'antd';
import {
    DeleteOutlined,
} from '@ant-design/icons';


const { Title, Text } = Typography;

const OrderSummary = ({
    subtotal,
    discount,
    shippingFee,
    total,
    promoCode,
    setPromoCode,
    onCheckout, // Thêm prop này để xử lý thanh toán
}) => (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8">
        <Title level={4} className="!mb-6 !text-black">Order Summary</Title>
        <div className="flex items-center gap-2 mb-4">
            <input
                placeholder="Discount voucher"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-black transition-colors text-base"
            />
            <Button
                className="rounded-r-full px-5 py-2 text-base bg-black text-white border-0 hover:bg-gray-900"
                style={{ fontWeight: 500 }}
            >
                Apply
            </Button>
        </div>
        <div className="space-y-2 mb-4">
            <div className="flex justify-between text-base">
                <span className="text-gray-700">Sub Total</span>
                <span className="font-medium text-black">{subtotal.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between text-base">
                <span className="text-gray-700">Discount (10%)</span>
                <span className="text-green-600 font-medium">{discount.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between text-base">
                <span className="text-gray-700">Delivery fee</span>
                <span className="font-medium text-black">{shippingFee === 0 ? '0₫' : `${shippingFee.toLocaleString()}₫`}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between text-lg font-semibold">
                <span className="text-black">Total</span>
                <span className="text-black">{total.toLocaleString()}₫</span>
            </div>
        </div>
        <Button
            block
            className="rounded-full px-8 py-3 text-base bg-black text-white border-0 hover:bg-gray-900"
            style={{ fontWeight: 500 }}
            size="large"
            onClick={onCheckout} // Gọi hàm thanh toán khi nhấn
        >
            Checkout Now
        </Button>
    </div>
);

export default OrderSummary;