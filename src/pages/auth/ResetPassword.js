import React, { useState } from "react";
import { FaEnvelope, FaLock, FaShieldAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axiosClient from "../../config/axios";
import { Form, Input, Button } from 'antd';
import OTPInput from '../../components/OTPInput';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: email, 2: OTP + new password
    const [email, setEmail] = useState("");
    // Ant Design Input.Password sẽ xử lý toggle hiển thị mật khẩu
    const [formEmail] = Form.useForm();
    const [formReset] = Form.useForm();

    // Step 1: Send OTP to email
    const onSendOTP = async (data) => {
        setLoading(true);
        try {
            // Gọi API gửi OTP
            const response = await axiosClient.post('/auth/forgot-password', {
                email: data.email
            });

            if (response.data.success) {
                setEmail(data.email);
                setStep(2);
                toast.success('Mã OTP đã được gửi đến email của bạn!');
                // Thêm delay để hiển thị loading
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra!');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Có lỗi xảy ra khi gửi OTP!');
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and set new password
    const onResetPassword = async (data) => {
        setLoading(true);
        try {
            // Gọi API reset password
            const response = await axiosClient.post('/auth/reset-password', {
                email: email,
                otp: data.otp,
                newPassword: data.newPassword
            });

            if (response.data.success) {
                // Thêm delay để hiển thị loading và chuyển trang
                setTimeout(() => {
                    setLoading(false);
                    toast.success('Đặt lại mật khẩu thành công!');
                    setTimeout(() => {
                        navigate('/signin');
                    }, 1000);
                }, 2000);
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra!');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Có lỗi xảy ra khi đặt lại mật khẩu!');
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post('/auth/forgot-password', {
                email: email
            });

            if (response.data.success) {
                toast.success('Mã OTP mới đã được gửi!');
                // Thêm delay để hiển thị loading
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } else {
                toast.error('Có lỗi xảy ra khi gửi lại OTP!');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            toast.error('Có lỗi xảy ra khi gửi lại OTP!');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md">
                {/* Header */}
                <div className="bg-[#393a3b] from-blue-600 to-purple-600 px-6 py-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        <i className="fas fa-key mr-2"></i>
                        Đặt lại mật khẩu
                    </h1>
                    <p className="text-blue-100 text-sm">
                        {step === 1 ? 'Nhập email để nhận mã OTP' : 'Nhập mã OTP và mật khẩu mới'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex px-6 py-4 bg-gray-50">
                    <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            1
                        </div>
                        <p className="text-xs mt-1">Nhập Email</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    </div>
                    <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            2
                        </div>
                        <p className="text-xs mt-1">Xác thực</p>
                    </div>
                </div>

                {/* Form */}
                <div className="px-6 py-8">
                    {step === 1 ? (
                        // Step 1: Email form (Ant Design)
                        <Form form={formEmail} layout="vertical" onFinish={onSendOTP} autoComplete="off">
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                                <p className="text-blue-700 text-sm text-center">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Nhập email đã đăng ký để nhận mã OTP
                                </p>
                            </div>

                                                         {/* Email field */}
                             <Form.Item
                                 label="Email"
                                 name="email"
                                 className="mb-6"
                                 rules={[
                                     { required: true, message: 'Vui lòng nhập email' },
                                     { type: 'email', message: 'Email không hợp lệ' },
                                 ]}
                             >
                                 <Input
                                     id="email"
                                     size="large"
                                     prefix={<FaEnvelope className="text-gray-400" />}
                                     placeholder="Nhập email của bạn"
                                     autoComplete="off"
                                     autoCapitalize="none"
                                     autoCorrect="off"
                                     spellCheck={false}
                                     disabled={loading}
                                 />
                             </Form.Item>

                            {/* Submit button */}
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="w-full"
                            >
                                Gửi mã OTP
                            </Button>
                        </Form>
                    ) : (
                        // Step 2: OTP and new password form (Ant Design)
                        <Form form={formReset} layout="vertical" onFinish={onResetPassword} className="space-y-6" autoComplete="off">
                            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                                <p className="text-green-700 text-sm text-center">
                                    <i className="fas fa-check-circle mr-1"></i>
                                    Mã OTP đã được gửi đến {email}
                                </p>
                            </div>

                            {/* OTP field */}
                            <Form.Item
                                label="Mã OTP"
                                name="otp"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã OTP' },
                                    { pattern: /^[0-9]{6}$/, message: 'Mã OTP phải có 6 số' },
                                ]}
                            >
                                <OTPInput
                                    length={6}
                                    disabled={loading}
                                    onComplete={(value) => {
                                        formReset.setFieldsValue({ otp: value });
                                    }}
                                />
                            </Form.Item>

                                                         {/* New Password field */}
                             <Form.Item
                                 label="Mật khẩu mới"
                                 name="newPassword"
                                 hasFeedback
                                 rules={[
                                     { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                     { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                                 ]}
                             >
                                 <Input.Password
                                     id="newPassword"
                                     size="large"
                                     prefix={<FaLock className="text-gray-400" />}
                                     placeholder="Mật khẩu mới"
                                     autoComplete="new-password"
                                     autoCapitalize="none"
                                     autoCorrect="off"
                                     spellCheck={false}
                                     disabled={loading}
                                 />
                             </Form.Item>

                                                         {/* Confirm Password field */}
                             <Form.Item
                                 label="Xác nhận mật khẩu"
                                 name="confirmPassword"
                                 dependencies={["newPassword"]}
                                 hasFeedback
                                 rules={[
                                     { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                     ({ getFieldValue }) => ({
                                         validator(_, value) {
                                             if (!value || getFieldValue('newPassword') === value) {
                                                 return Promise.resolve();
                                             }
                                             return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                                         },
                                     }),
                                 ]}
                             >
                                 <Input.Password
                                     id="confirmPassword"
                                     size="large"
                                     prefix={<FaLock className="text-gray-400" />}
                                     placeholder="Xác nhận mật khẩu mới"
                                     autoComplete="new-password"
                                     autoCapitalize="none"
                                     autoCorrect="off"
                                     spellCheck={false}
                                     disabled={loading}
                                 />
                             </Form.Item>

                            {/* Resend OTP */}
                            <div className="text-center">
                                <Button type="link" onClick={resendOTP} disabled={loading} className="p-0">
                                    Gửi lại mã OTP
                                </Button>
                            </div>

                            {/* Submit button */}
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                Đặt lại mật khẩu
                            </Button>
                        </Form>
                    )}

                    {/* Back to Sign In */}
                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate('/signin')}
                            className="text-sm text-gray-500 hover:text-gray-700 transition duration-200 flex items-center justify-center mx-auto"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Quay về đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
