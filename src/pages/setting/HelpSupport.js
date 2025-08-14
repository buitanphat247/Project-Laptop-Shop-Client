import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, message, Row, Col, Space, Skeleton, Alert } from 'antd';
import {
    QuestionCircleOutlined,
    MailOutlined,
    PhoneOutlined,
    GlobalOutlined,
    SendOutlined,
    FileTextOutlined,
    BugOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';

/**
 * 🚧 HELP & SUPPORT PAGE - UNDER DEVELOPMENT 🚧
 * 
 * ⚠️  WARNING: This is a demo UI for development purposes only!
 * ⚠️  DO NOT modify this file unless you're working on support features
 * ⚠️  This page contains demo data and mock functionality
 * 
 * Features:
 * - Support form with categories and priority levels
 * - Contact information display
 * - FAQ section
 * - User info integration
 * - Loading states and form validation
 * - Responsive design with tabs
 * 
 * @author: Development Team
 * @status: In Development
 * @version: 1.0.0
 */

const { TextArea } = Input;
const { Option } = Select;

const HelpSupport = ({ userInfo }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('form');
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const DEMO_LOCKED = true; // UI demo lock: show-only, disable all interactions

    useEffect(() => {
        setSkeletonLoading(true);
        const timer = setTimeout(() => setSkeletonLoading(false), 250);
        return () => clearTimeout(timer);
    }, [activeTab]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            // Simulate form processing time
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log('🚀 Form submitted successfully:', {
                ...values,
                userId: userInfo?.id,
                userEmail: userInfo?.email,
                userName: userInfo?.fullName,
                timestamp: new Date().toISOString(),
            });

            message.success('Yêu cầu hỗ trợ đã được gửi thành công! Chúng tôi sẽ phản hồi trong 24h.');
            form.resetFields();
        } catch (error) {
            console.error('❌ Error submitting form:', error);
            message.error('Có lỗi xảy ra khi gửi form. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Support categories
    const supportCategories = [
        { value: 'account', label: 'Tài khoản & Đăng nhập', icon: <UserOutlined /> },
        { value: 'order', label: 'Đơn hàng & Thanh toán', icon: <FileTextOutlined /> },
        { value: 'product', label: 'Sản phẩm & Dịch vụ', icon: <SettingOutlined /> },
        { value: 'technical', label: 'Vấn đề kỹ thuật', icon: <BugOutlined /> },
        { value: 'general', label: 'Câu hỏi chung', icon: <QuestionCircleOutlined /> },
        { value: 'other', label: 'Khác', icon: <GlobalOutlined /> },
    ];

    // Priority levels
    const priorityLevels = [
        { value: 'low', label: 'Thấp', color: 'green' },
        { value: 'medium', label: 'Trung bình', color: 'orange' },
        { value: 'high', label: 'Cao', color: 'red' },
        { value: 'urgent', label: 'Khẩn cấp', color: 'red' },
    ];

    const ContactInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="text-center hover:shadow-md transition-shadow">
                    <MailOutlined className="text-3xl text-blue-500 mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Email hỗ trợ</h3>
                    <p className="text-gray-600 mb-3">Phản hồi trong 24 giờ</p>
                    <a
                        href="mailto:support@laptopshop.com"
                        className="text-blue-500 hover:text-blue-700"
                    >
                        support@laptopshop.com
                    </a>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                    <PhoneOutlined className="text-3xl text-green-500 mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Hotline</h3>
                    <p className="text-gray-600 mb-3">8:00 - 22:00 hàng ngày</p>
                    <a
                        href="tel:1800123456"
                        className="text-green-500 hover:text-green-700 font-semibold"
                    >
                        1800-123-456
                    </a>
                </Card>
            </div>

            <Card>
                <h3 className="text-lg font-semibold mb-4">Giờ làm việc</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-gray-700">Hỗ trợ trực tuyến</h4>
                        <p className="text-gray-600">Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Hỗ trợ điện thoại</h4>
                        <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold mb-4">FAQ - Câu hỏi thường gặp</h3>
                <div className="space-y-3">
                    <div className="border-b pb-3">
                        <h4 className="font-medium text-gray-700">Làm thế nào để theo dõi đơn hàng?</h4>
                        <p className="text-gray-600 text-sm mt-1">
                            Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" hoặc qua email xác nhận.
                        </p>
                    </div>
                    <div className="border-b pb-3">
                        <h4 className="font-medium text-gray-700">Chính sách đổi trả như thế nào?</h4>
                        <p className="text-gray-600 text-sm mt-1">
                            Chúng tôi hỗ trợ đổi trả trong vòng 30 ngày với điều kiện sản phẩm còn nguyên vẹn.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-700">Có những phương thức thanh toán nào?</h4>
                        <p className="text-gray-600 text-sm mt-1">
                            Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản, và COD.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            {DEMO_LOCKED && (
                <Alert
                    message="Trang Hỗ trợ đang phát triển"
                    description="Đây là UI demo chỉ để trình bày. Vui lòng không thao tác."
                    type="warning"
                    showIcon
                    banner
                />
            )}

            <div className={DEMO_LOCKED ? 'relative' : ''}>
                <div className={DEMO_LOCKED ? 'pointer-events-none opacity-60 select-none' : ''}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <QuestionCircleOutlined />
                                <span>Hỗ trợ & Trợ giúp</span>
                            </div>
                        }
                        className="shadow-sm"
                    >
                        {/* Tab Navigation */}
                        <div className="flex border-b mb-6">
                            <button
                                className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'form'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                                onClick={() => setActiveTab('form')}
                            >
                                Gửi yêu cầu hỗ trợ
                            </button>
                            <button
                                className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'contact'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-800'
                                    }`}
                                onClick={() => setActiveTab('contact')}
                            >
                                Thông tin liên hệ
                            </button>
                        </div>

                        {/* Tab Content */}
                        {skeletonLoading ? (
                            <div>
                                <Skeleton.Input style={{ width: 200, marginBottom: 24 }} active />
                                <Skeleton active paragraph={{ rows: 6 }} />
                                <div className="mt-6 flex gap-3">
                                    <Skeleton.Button active style={{ width: 140 }} />
                                    <Skeleton.Button active style={{ width: 100 }} />
                                </div>
                            </div>
                        ) : activeTab === 'form' ? (
                            <div>
                                {/* User Info Display */}
                                {userInfo && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-2">Thông tin liên hệ</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-blue-700">Họ tên:</span>
                                                <div className="font-medium">{userInfo.fullName || 'Chưa cập nhật'}</div>
                                            </div>
                                            <div>
                                                <span className="text-blue-700">Email:</span>
                                                <div className="font-medium">{userInfo.email || 'Chưa cập nhật'}</div>
                                            </div>
                                            <div>
                                                <span className="text-blue-700">Vai trò:</span>
                                                <div className="font-medium">{userInfo.role?.toUpperCase() || 'USER'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Support Form */}
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        category: 'general',
                                        priority: 'medium',
                                        fullName: userInfo?.fullName || '',
                                        email: userInfo?.email || '',
                                    }}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Họ và tên"
                                                name="fullName"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                            >
                                                <Input
                                                    size="large"
                                                    placeholder="Nhập họ và tên của bạn"
                                                    prefix={<UserOutlined />}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Email liên hệ"
                                                name="email"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập email' },
                                                    { type: 'email', message: 'Email không hợp lệ' }
                                                ]}
                                            >
                                                <Input
                                                    size="large"
                                                    placeholder="Nhập email để nhận phản hồi"
                                                    prefix={<MailOutlined />}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Danh mục vấn đề"
                                                name="category"
                                                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                                            >
                                                <Select size="large" placeholder="Chọn loại vấn đề">
                                                    {supportCategories.map(cat => (
                                                        <Option key={cat.value} value={cat.value}>
                                                            <Space>
                                                                {cat.icon}
                                                                {cat.label}
                                                            </Space>
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Mức độ ưu tiên"
                                                name="priority"
                                                rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
                                            >
                                                <Select size="large" placeholder="Chọn mức độ ưu tiên">
                                                    {priorityLevels.map(level => (
                                                        <Option key={level.value} value={level.value}>
                                                            <span style={{ color: level.color }}>
                                                                {level.label}
                                                            </span>
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        label="Tiêu đề vấn đề"
                                        name="subject"
                                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Mô tả ngắn gọn vấn đề của bạn"
                                            maxLength={100}
                                            showCount
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Mô tả chi tiết"
                                        name="description"
                                        rules={[
                                            { required: true, message: 'Vui lòng mô tả chi tiết vấn đề' },
                                            { min: 20, message: 'Mô tả phải có ít nhất 20 ký tự' }
                                        ]}
                                    >
                                        <TextArea
                                            rows={6}
                                            placeholder="Mô tả chi tiết vấn đề bạn gặp phải. Càng chi tiết càng giúp chúng tôi hỗ trợ bạn tốt hơn."
                                            maxLength={1000}
                                            showCount
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Số điện thoại (tùy chọn)"
                                        name="phone"
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Số điện thoại để chúng tôi liên hệ nhanh hơn"
                                            prefix={<PhoneOutlined />}
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            size="large"
                                            icon={<SendOutlined />}
                                            className="w-full md:w-auto"
                                        >
                                            {loading ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        ) : (
                            <ContactInfo />
                        )}
                    </Card>
                </div>
                {/* {DEMO_LOCKED && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md shadow">
                            UI demo đang phát triển — Chỉ để trình bày, vui lòng không thao tác
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default HelpSupport;