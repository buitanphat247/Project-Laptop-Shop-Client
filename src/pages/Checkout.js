import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, HomeOutlined, ShoppingOutlined, GiftOutlined, MailOutlined } from '@ant-design/icons';
import queryString from "query-string";
import axiosClient from "../config/axios";
import { formatPrice } from '../utils/formatUtils';

const { Title, Text } = Typography;

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = queryString.parse(location.search);
    console.log('query: ', query);
    const isSuccess = query.vnp_ResponseCode === "00" && query.vnp_TransactionStatus === "00";

    const [orderInfo, setOrderInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Parse thông tin từ URL parameters
    const parseOrderInfoFromURL = () => {
        // Tạo mã giao dịch 9 ký tự kết hợp số và chữ
        const generateOrderId = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 9; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        try {
            if (query.vnp_OrderInfo) {
                // Thử parse JSON từ vnp_OrderInfo
                const orderInfoData = JSON.parse(decodeURIComponent(query.vnp_OrderInfo));
                return {
                    id: generateOrderId(),
                    totalPrice: parseInt(query.vnp_Amount) / 100 || 0, // VNPAY trả về số tiền * 100
                    shipName: orderInfoData.shipName || orderInfoData.customerName || 'N/A',
                    shipPhone: orderInfoData.shipPhone || orderInfoData.phone || 'N/A',
                    shipAddress: orderInfoData.shipAddress || orderInfoData.address || 'N/A',
                    email: orderInfoData.email || 'N/A'
                };
            }
        } catch (error) {
            console.log('Không thể parse orderInfo từ URL:', error);
        }
        
        // Fallback data nếu không parse được
        return {
            id: generateOrderId(),
            totalPrice: parseInt(query.vnp_Amount) / 100 || 0,
            shipName: 'Khách hàng',
            shipPhone: 'N/A',
            shipAddress: 'N/A',
            email: 'N/A'
        };
    };

    useEffect(() => {
        if (query.vnp_TxnRef && query.vnp_OrderInfo) {
            const sendVnpayReturn = async () => {
                try {
                    const { data } = await axiosClient.get('/vnpay-return', { params: query });
                    setOrderInfo(data.data); // Lưu toàn bộ thông tin trả về từ API
                } catch (error) {
                    console.error('Gửi dữ liệu về BE thất bại!', error);
                    // Nếu API fail, sử dụng data từ URL
                    setOrderInfo(parseOrderInfoFromURL());
                } finally {
                    // Delay nhỏ để tránh load quá nhanh
                    setTimeout(() => {
                        setLoading(false);
                    }, 800);
                }
            };
            sendVnpayReturn();
        } else {
            // Nếu không có VNPAY data, set loading false sau delay
            setTimeout(() => {
                setLoading(false);
            }, 800);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy một lần khi component mount

    const handleGoHome = () => {
        console.log('Navigating to home...');
        navigate('/');
    };

    const handleViewOrders = () => {
        console.log('Navigating to orders...');
        navigate('/orders');
    };

    // Lấy thông tin để hiển thị (ưu tiên API, fallback về URL)
    const displayInfo = orderInfo || parseOrderInfoFromURL();

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
            <div className="flex items-center justify-center p-4 relative">
                <Card className="w-full max-w-2xl shadow-2xl border-0 relative z-10">
                    <div className="text-center">
                        {/* Error Icon */}
                        <div 
                            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            style={{
                                animation: 'gentleBounce 2s ease-in-out infinite'
                            }}
                        >
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>

                        <style jsx>{`
                            @keyframes gentleBounce {
                                0%, 20%, 50%, 80%, 100% {
                                    transform: translateY(0);
                                }
                                40% {
                                    transform: translateY(-8px);
                                }
                                60% {
                                    transform: translateY(-4px);
                                }
                            }
                        `}</style>

                        {/* Title */}
                        <Title level={2} className="text-red-600 mb-2">Thanh toán thất bại!</Title>
                        <Text className="text-gray-600 mb-8 block text-lg">
                            Đã xảy ra lỗi trong quá trình xử lý thanh toán.
                        </Text>

                        {/* Error Info */}
                        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-red-100">
                            <div className="flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                    </svg>
                                <Title level={4} className="text-gray-800 mb-0">Thông tin lỗi</Title>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Text className="text-gray-500 text-sm">Mã giao dịch</Text>
                                    <div className="mt-1">
                                        <Tag color="blue" className="text-sm font-medium">{displayInfo.id}</Tag>
                                    </div>
                                </div>

                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Text className="text-gray-500 text-sm">Tổng tiền</Text>
                                    <div className="mt-1">
                                        <span className="font-bold text-red-600 text-lg">
                                            {formatPrice(displayInfo.totalPrice)}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Text className="text-gray-500 text-sm">Phương thức</Text>
                                    <div className="mt-1">
                                        <Tag color="red" className="text-sm font-medium">VNPAY</Tag>
                                    </div>
                                </div>

                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <Text className="text-gray-500 text-sm">Trạng thái</Text>
                                    <div className="mt-1">
                                        <Tag color="error" className="text-sm font-medium">Thanh Toán Thất bại</Tag>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Help Notification */}
                        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <Text className="font-medium text-blue-800">💡 Hướng dẫn</Text>
                            </div>
                            <Text className="text-blue-600 text-sm">
                                Vui lòng kiểm tra lại thông tin thanh toán và thử lại. 
                                Nếu vấn đề vẫn tiếp tục, hãy liên hệ hỗ trợ khách hàng.
                            </Text>
                    </div>

                    {/* Action Buttons */}
                        <div className="space-x-4">
                            <Button
                                type="primary"
                                size="large"
                                icon={<HomeOutlined />}
                                onClick={handleGoHome}
                                className="bg-red-600 hover:bg-red-700 border-red-600"
                            >
                                Về trang chủ
                            </Button>
                            <Button
                                size="large"
                                icon={<ShoppingOutlined />}
                                onClick={() => navigate('/cart')}
                                className="border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600"
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
        <div className=" flex items-center justify-center p-4 relative">
            <Card className="w-full max-w-2xl shadow-2xl border-0 relative z-10">
                <div className="text-center">
                    {/* Success Icon */}
                    <div
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{
                            animation: 'gentleBounce 2s ease-in-out infinite'
                        }}
                    >
                        <CheckCircleOutlined className="text-green-500 text-4xl animate-pulse" />
                            </div>

                    <style jsx>{`
                        @keyframes gentleBounce {
                            0%, 20%, 50%, 80%, 100% {
                                transform: translateY(0);
                            }
                            40% {
                                transform: translateY(-8px);
                            }
                            60% {
                                transform: translateY(-4px);
                            }
                        }
                    `}</style>

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
                                    <Tag color="blue" className="text-sm font-medium">{displayInfo.id}</Tag>
                                        </div>
                                    </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Text className="text-gray-500 text-sm">Tổng tiền</Text>
                                <div className="mt-1">
                                    <span className="font-bold text-green-600 text-lg">
                                        {formatPrice(displayInfo.totalPrice)}
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
                                    <Tag color="success" className="text-sm font-medium">Thanh toán thành công  </Tag>
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

export default Checkout;