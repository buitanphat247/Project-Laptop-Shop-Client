import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, HomeOutlined, ShoppingOutlined, GiftOutlined, MailOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import { formatPrice } from '../utils/formatUtils';

const { Title, Text } = Typography;

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = queryString.parse(location.search);
    const isSuccess = query.isSuccess === 'true';
    
    console.log('PaymentSuccess loaded:', { location, query, isSuccess });
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Delay nhỏ để tránh load quá nhanh
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

    const handleGoHome = () => {
        console.log('Navigating to home...');
        navigate('/');
    };

    const handleViewOrders = () => {
        console.log('Navigating to orders...');
        navigate('/orders');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <Title level={4} className="mt-6 text-gray-700">Đang xử lý thông tin thanh toán...</Title>
                    <Text className="text-gray-500">Vui lòng chờ trong giây lát</Text>
                </div>
            </div>
        );
    }

    if (!isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-2xl border-0">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CloseCircleOutlined className="text-red-500 text-3xl" />
                        </div>
                        <Title level={2} className="text-red-600 mb-2">Thanh toán thất bại</Title>
                        <Text className="text-gray-600 mb-8 block">
                            Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.
                        </Text>
                        <div className="space-x-4">
                            <Button
                                type="primary"
                                size="large"
                                icon={<HomeOutlined />}
                                onClick={handleGoHome}
                                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                            >
                                Về trang chủ
                            </Button>
                            <Button
                                size="large"
                                icon={<ShoppingOutlined />}
                                onClick={() => navigate('/cart')}
                                className="border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                            >
                                Thử lại
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative">
            <Card className="w-full max-w-2xl shadow-2xl border-0 relative z-10">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircleOutlined className="text-green-500 text-4xl animate-pulse" />
                    </div>

                    {/* Title */}
                    <Title level={2} className="text-green-600 mb-2">Thanh toán thành công!</Title>
                    <Text className="text-gray-600 mb-8 block text-lg">
                        Đơn hàng của bạn đã được xử lý thành công.
                    </Text>

                    {/* Order Info */}
                    <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-green-100">
                        <div className="flex items-center justify-center mb-4">
                            <GiftOutlined className="text-green-500 text-xl mr-2" />
                            <Title level={4} className="text-gray-800 mb-0">Thông tin đơn hàng</Title>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Text className="text-gray-500 text-sm">Mã đơn hàng</Text>
                                <div className="mt-1">
                                    <Tag color="blue" className="text-sm font-medium">ORD-2024123456789</Tag>
                                </div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Text className="text-gray-500 text-sm">Tổng tiền</Text>
                                <div className="mt-1">
                                    <span className="font-bold text-green-600 text-lg">
                                        {formatPrice(2500000)}
                                    </span>
                                </div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Text className="text-gray-500 text-sm">Phương thức</Text>
                                <div className="mt-1">
                                    <Tag color="green" className="text-sm font-medium">VNPAY</Tag>
                                </div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Text className="text-gray-500 text-sm">Trạng thái</Text>
                                <div className="mt-1">
                                    <Tag color="success" className="text-sm font-medium">Đã thanh toán</Tag>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email Notification */}
                    <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
                        <div className="flex items-center justify-center mb-3">
                            <MailOutlined className="text-blue-500 text-xl mr-2" />
                            <Text className="font-medium text-blue-800">📧 Email xác nhận</Text>
                        </div>
                        <Text className="text-blue-600 text-sm">
                            Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
                            Vui lòng kiểm tra hộp thư và thư mục spam.
                        </Text>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-x-4">
                        <Button
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            onClick={handleGoHome}
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                        >
                            Về trang chủ
                        </Button>
                        <Button
                            size="large"
                            icon={<ShoppingOutlined />}
                            onClick={handleViewOrders}
                            className="border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600"
                        >
                            Xem đơn hàng
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
