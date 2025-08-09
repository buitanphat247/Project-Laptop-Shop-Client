import React, { useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Skeleton, Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axiosClient from '../../config/axios';
import { getCookie, decodeBase64, getUserProfile } from '../../utils/auth';
import { toast } from 'react-toastify';

const AccountInfo = ({ userInfo, onUpdate, onRefresh }) => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);

    // Hàm helper để chuyển đổi giá trị thành string an toàn
    const safeString = (value) => {
        if (value === null || value === undefined) {
            return 'Chưa cập nhật';
        }
        if (typeof value === 'object') {
            // Nếu là object, thử lấy name hoặc id
            if (value.name) return value.name;
            if (value.id) return value.id.toString();
            // Nếu không có name hoặc id, chuyển thành JSON string
            return JSON.stringify(value);
        }
        return value.toString();
    };

    // Fetch user data từ API
    const fetchUserData = async () => {
        setLoading(true);
        setError(null);

        try {
            const userId = getUserProfile()?.id;

            if (!userId) {
                setError('Không tìm thấy ID người dùng');
                setLoading(false);
                return;
            }

            const response = await axiosClient.get(`/get-user/${userId}`);
            setUserData(response.data.data);

        } catch (error) {
            console.error('❌ Error fetching user data:', error);

        } finally {
            setLoading(false);
        }
    };

    // Initial fetch và refresh khi component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // Refresh function
    const handleRefresh = () => {
        fetchUserData();
    };

    // Mở modal chỉnh sửa
    const showEditModal = () => {
        const currentUserData = userData || userInfo;
        form.setFieldsValue({
            fullName: currentUserData?.fullName || '',
            email: currentUserData?.email || '',
            phone: currentUserData?.phone || '',
            address: currentUserData?.address || ''
        });
        setIsModalVisible(true);
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // Xử lý submit form
    const handleSubmit = async (values) => {
        setSubmitLoading(true);
        try {
            const userId = getUserProfile()?.id;
            const response = await axiosClient.put(`/update-user/${userId}`, values);

            if (response.data.success) {
                message.success('Cập nhật thông tin thành công!');
                setUserData(response.data.data);
                setIsModalVisible(false);
                form.resetFields();
                
                // Gọi onUpdate nếu có
                if (onUpdate) {
                    onUpdate(response.data.data);
                }
            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi cập nhật!');
            }
        } catch (error) {
            console.error('Error updating user info:', error);
            let errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin';
            
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        errorMessage = data.message || 'Dữ liệu không hợp lệ';
                        break;
                    case 401:
                        errorMessage = 'Không có quyền cập nhật';
                        break;
                    case 404:
                        errorMessage = 'Không tìm thấy người dùng';
                        break;
                    case 500:
                        errorMessage = 'Lỗi server, vui lòng thử lại sau';
                        break;
                    default:
                        errorMessage = data?.message || 'Có lỗi xảy ra';
                }
            }
            message.error(errorMessage);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Lấy ký tự đầu của tên để làm avatar
    const getAvatarText = (fullName) => {
        if (!fullName) return 'U';

        // Đảm bảo fullName là string
        const nameString = safeString(fullName);
        if (!nameString || nameString === 'Chưa cập nhật') return 'U';

        // Tách tên thành các từ và lấy ký tự đầu
        const nameWords = nameString.trim().split(' ');

        if (nameWords.length === 1) {
            // Nếu chỉ có 1 từ, lấy ký tự đầu
            return nameWords[0].charAt(0).toUpperCase();
        } else {
            // Nếu có nhiều từ, lấy ký tự đầu của từ đầu và từ cuối
            const firstChar = nameWords[0].charAt(0).toUpperCase();
            const lastChar = nameWords[nameWords.length - 1].charAt(0).toUpperCase();
            return firstChar + lastChar;
        }
    };

    // Tạo màu avatar dựa trên tên
    const getAvatarColor = (fullName) => {
        if (!fullName) return '#1890ff';

        // Đảm bảo fullName là string
        const nameString = safeString(fullName);
        if (!nameString || nameString === 'Chưa cập nhật') return '#1890ff';

        const colors = [
            '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068',
            '#108ee9', '#f50', '#2db7f5', '#52c41a', '#faad14',
            '#13c2c2', '#eb2f96', '#722ed1', '#fa541c', '#a0d911'
        ];

        // Sử dụng độ dài tên để chọn màu
        const index = nameString.length % colors.length;
        return colors[index];
    };

    // Sử dụng userData từ API hoặc fallback về userInfo prop
    const currentUserData = userData || userInfo;
    const avatarText = getAvatarText(currentUserData?.fullName);
    const avatarColor = getAvatarColor(currentUserData?.fullName);

    if (loading) {
        return (
            <div className="space-y-6">
                <Card title={<Skeleton.Input style={{ width: 180 }} active />} className="shadow-sm">
                    <div className="flex items-center mb-6">
                        <Skeleton.Avatar active size={100} shape="circle" />
                        <div className="ml-6 flex-1">
                            <Skeleton active paragraph={{ rows: 1 }} title={false} />
                            <Skeleton.Input style={{ width: 120, marginTop: 8 }} active size="small" />
                            <div className="mt-2">
                                <Skeleton.Button active size="small" style={{ width: 80 }} />
                            </div>
                        </div>
                    </div>
                    <Skeleton active paragraph={{ rows: 6 }} />
                    <div className="mt-6 flex gap-3">
                        <Skeleton.Button active style={{ width: 140 }} />
                        <Skeleton.Button active style={{ width: 100 }} />
                    </div>
                </Card>
            </div>
        );
    }

    if (error && !currentUserData) {
        return (
            <div className="space-y-6">
                <Card title="Thông tin tài khoản" className="shadow-sm">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <UserOutlined className="text-6xl text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            Không thể tải thông tin
                        </h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card title="Thông tin tài khoản" className="shadow-sm">
                <div className="flex items-center mb-6">
                    {/* Avatar với ký tự đầu tên */}
                    <Avatar
                        size={100}
                        style={{
                            backgroundColor: avatarColor,
                            fontSize: '36px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        icon={!currentUserData?.fullName && <UserOutlined />}
                    >
                        {avatarText}
                    </Avatar>

                    <div className="ml-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            {safeString(currentUserData?.fullName) || 'Chưa có tên'}
                        </h3>
                        <p className="text-gray-500 text-base">
                            {safeString(currentUserData?.email) || 'Chưa có email'}
                        </p>
                        <div className="mt-2">
                            <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${safeString(currentUserData?.role?.name || currentUserData?.role) === 'admin'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }
                            `}>
                                {safeString(currentUserData?.role?.name || currentUserData?.role)?.toUpperCase() || 'USER'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Thông tin chi tiết */}
                <Descriptions column={1} bordered size="middle">
                    <Descriptions.Item
                        label={<span className="font-medium">Vai trò</span>}
                    >
                        <span className={`
                            font-medium
                            ${safeString(currentUserData?.role?.name || currentUserData?.role) === 'admin' ? 'text-red-600' : 'text-blue-600'}
                        `}>
                            {safeString(currentUserData?.role?.name || currentUserData?.role)?.toUpperCase() || 'USER'}
                        </span>
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<span className="font-medium">Họ và tên</span>}
                    >
                        {safeString(currentUserData?.fullName)}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<span className="font-medium">Email</span>}
                    >
                        {safeString(currentUserData?.email)}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<span className="font-medium">Số điện thoại</span>}
                    >
                        {safeString(currentUserData?.phone)}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<span className="font-medium">Địa chỉ</span>}
                    >
                        {safeString(currentUserData?.address)}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<span className="font-medium">Ngày tạo</span>}
                    >
                        {currentUserData?.createdAt
                            ? new Date(currentUserData.createdAt).toLocaleDateString('vi-VN')
                            : 'Chưa có thông tin'
                        }
                    </Descriptions.Item>
                </Descriptions>

                {/* Action buttons */}
                <div className="mt-6 flex gap-3">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        onClick={showEditModal}
                    >
                        Chỉnh sửa thông tin
                    </button>

                    {/* <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        onClick={handleRefresh}
                    >
                        Làm mới
                    </button> */}
                </div>
            </Card>

            {/* Modal chỉnh sửa thông tin */}
            <Modal
                title="Chỉnh sửa thông tin"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        fullName: currentUserData?.fullName || '',
                        email: currentUserData?.email || '',
                        phone: currentUserData?.phone || '',
                        address: currentUserData?.address || ''
                    }}
                >
                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên!' },
                            { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                        ]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ!' },
                            { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' }
                        ]}
                    >
                        <Input.TextArea 
                            placeholder="Nhập địa chỉ" 
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleCancel}>
                                Hủy
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={submitLoading}
                            >
                                {submitLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AccountInfo;