import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Skeleton } from 'antd';
import { getCookie, decodeBase64 } from '../../utils/auth';
import axiosClient from '../../config/axios';
import { toast } from 'react-toastify';

const ChangePassword = ({ onFinish }) => {
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setSkeletonLoading(true);
        const timer = setTimeout(() => setSkeletonLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Hàm xử lý submit form
    const handleSubmit = async (values) => {
        // Lấy email từ cookie
        const encodedProfile = getCookie('profile_user');
        let email = '';

        if (encodedProfile) {
            try {
                const decodedProfile = decodeBase64(encodedProfile);
                if (decodedProfile) {
                    const profile = JSON.parse(decodedProfile);
                    email = profile.email || '';
                }
            } catch (error) {
                console.error('Error decoding profile cookie:', error);
                toast.error('Không thể lấy thông tin email từ cookie!');
                return;
            }
        }

        if (!email) {
            toast.error('Không tìm thấy email người dùng!');
            return;
        }

        // Log dữ liệu form
        const formData = {
            email: email,
            oldPassword: values.currentPassword,
            newPassword: values.newPassword
        };


        // Bắt đầu loading
        setSubmitLoading(true);

        try {
            // Gọi API thay đổi mật khẩu
            const response = await axiosClient.post('/auth/change-password', formData);

            if (response.data.success) {
                // Thành công
                toast.success('Thay đổi mật khẩu thành công!', {
                    autoClose: 2500,
                    position: "top-right",
                });

                // Reset form
                form.resetFields();

                // Gọi onFinish nếu có
                if (onFinish) {
                    onFinish(values);
                }
            } else {
                // Lỗi từ server
                toast.error(response.data.message || 'Có lỗi xảy ra khi thay đổi mật khẩu!', {
                    autoClose: 2500,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);

            // Xử lý các loại lỗi khác nhau
            let errorMessage = 'Có lỗi xảy ra khi thay đổi mật khẩu!';

            if (error.response) {
                // Lỗi từ server
                const { status, data } = error.response;

                switch (status) {
                    case 400:
                        errorMessage = data.message || 'Dữ liệu không hợp lệ!';
                        break;
                    case 401:
                        errorMessage = 'Mật khẩu hiện tại không đúng!';
                        break;
                    case 404:
                        errorMessage = 'Không tìm thấy tài khoản!';
                        break;
                    case 500:
                        errorMessage = 'Lỗi server, vui lòng thử lại sau!';
                        break;
                    default:
                        errorMessage = data.message || 'Có lỗi xảy ra!';
                }
            } else if (error.request) {
                // Lỗi network
                errorMessage = 'Không thể kết nối đến server!';
            } else {
                // Lỗi khác
                errorMessage = error.message || 'Có lỗi xảy ra!';
            }

            toast.error(errorMessage, {
                autoClose: 2500,
                position: "top-right",
            });
        } finally {
            // Kết thúc loading
            setSubmitLoading(false);
        }
    };

    if (skeletonLoading) {
        return (
            <Card title={<Skeleton.Input style={{ width: 180 }} active />}>
                <Skeleton active paragraph={{ rows: 4 }} />
                <div className="mt-6 flex gap-3">
                    <Skeleton.Button active style={{ width: 140 }} />
                </div>
            </Card>
        );
    }

    return (
        <Card title="Thay đổi mật khẩu">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={submitLoading}
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu hiện tại"
                        disabled={submitLoading}
                    />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu mới"
                        disabled={submitLoading}
                    />
                </Form.Item>
                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder="Xác nhận mật khẩu mới"
                        disabled={submitLoading}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitLoading}
                        disabled={submitLoading}
                        className="w-full"
                    >
                        {submitLoading ? 'Đang thay đổi mật khẩu...' : 'Đổi mật khẩu'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ChangePassword;