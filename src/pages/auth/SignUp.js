import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaChartLine, FaUsers, FaDollarSign, FaBullseye } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { logUserActivity } from '../../utils/auth';
import axiosClient from "../../config/axios";
import { Form, Input, Button, Row, Col } from 'antd';
import useDeviceDetection from '../../hooks/useDeviceDetection';

const SignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { isMobile, isTablet, isDesktop } = useDeviceDetection();

    // Animated values for charts
    const [userGrowth, setUserGrowth] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [registrationRate, setRegistrationRate] = useState(0);
    const [satisfaction, setSatisfaction] = useState(0);

    // Set default values
    React.useEffect(() => {
        form.setFieldsValue({
            fullname: "Nguyen Van A",
            email: "user@gmail.com",
            phone: "0123456789",
            address: "123 Nguyen Van Linh, Da Nang",
            password: "123456",
            confirmPassword: "123456"
        });
    }, [form]);

    // Animate chart values
    useEffect(() => {
        const animateValues = () => {
            // User Growth animation
            const growthInterval = setInterval(() => {
                setUserGrowth(prev => {
                    if (prev >= 1220) {
                        clearInterval(growthInterval);
                        return 1220;
                    }
                    return prev + Math.ceil((1220 - prev) / 20);
                });
            }, 50);

            // Active Users animation
            const activeInterval = setInterval(() => {
                setActiveUsers(prev => {
                    if (prev >= 875) {
                        clearInterval(activeInterval);
                        return 875;
                    }
                    return prev + Math.ceil((875 - prev) / 20);
                });
            }, 50);

            // Registration Rate animation
            const rateInterval = setInterval(() => {
                setRegistrationRate(prev => {
                    if (prev >= 95) {
                        clearInterval(rateInterval);
                        return 95;
                    }
                    return prev + Math.ceil((95 - prev) / 10);
                });
            }, 50);

            // Satisfaction animation
            const satisfactionInterval = setInterval(() => {
                setSatisfaction(prev => {
                    if (prev >= 95.6) {
                        clearInterval(satisfactionInterval);
                        return 95.6;
                    }
                    return prev + (95.6 - prev) / 20;
                });
            }, 50);
        };

        const animationTimeout = setTimeout(animateValues, 600);

        return () => {
            clearTimeout(animationTimeout);
        };
    }, []);

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            console.log('🚀 Starting registration process...');
            logUserActivity('register_attempt', { email: values.email });

            const response = await axiosClient.post('/auth/register', {
                fullname: values.fullname,
                email: values.email,
                phone: values.phone,
                address: values.address,
                password: values.password,
            });

            console.log('✅ Registration successful:', response.data);

            logUserActivity('register_success', { email: values.email });

            setTimeout(() => {
                setLoading(false);
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/signin');
            }, 2500);
        } catch (error) {
            console.error('❌ Registration failed:', error);
            setLoading(false);

            logUserActivity('register_failed', {
                email: values.email,
                error: error.message
            });

            toast.error('Đăng ký thất bại! Email có thể đã được sử dụng.');
        }
    };

    // Mobile/Tablet Layout
    if (isMobile || isTablet) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                {/* Mobile Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Tạo tài khoản mới</h2>
                    <p className="text-gray-600 text-sm sm:text-base">Tham gia cộng đồng mua sắm thông minh.</p>
                </div>

                {/* Mobile Form Container */}
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-4 sm:p-6 border border-gray-400">
                    {/* Demo Info */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <p className="text-green-700 text-xs sm:text-sm text-center">
                            <i className="fas fa-info-circle mr-1"></i>
                            Demo User: user@gmail.com / 123456 (Đã điền sẵn)
                        </p>
                    </div>

                    <Form
                        form={form}
                        name="signup"
                        layout="vertical"
                        onFinish={onSubmit}
                        autoComplete="off"
                        className="space-y-3"
                    >
                        {/* Full Name */}
                        <Form.Item
                            label={<span className="text-sm sm:text-base">Họ và tên</span>}
                            name="fullname"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                        >
                            <Input
                                prefix={<FaUser className="text-gray-400" />}
                                placeholder="Họ và tên"
                                autoComplete="off"
                                disabled={loading}
                                size={isMobile ? "middle" : "large"}
                                className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </Form.Item>

                        {/* Email */}
                        <Form.Item
                            label={<span className="text-sm sm:text-base">Email</span>}
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ' },
                            ]}
                        >
                            <Input
                                prefix={<FaEnvelope className="text-gray-400" />}
                                placeholder="E-mail"
                                autoComplete="off"
                                disabled={loading}
                                size={isMobile ? "middle" : "large"}
                                className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </Form.Item>

                        {/* Phone */}
                        <Form.Item
                            label={<span className="text-sm sm:text-base">Số điện thoại</span>}
                            name="phone"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^[0-9]{9,12}$/, message: 'Số điện thoại không hợp lệ' },
                            ]}
                        >
                            <Input
                                prefix={<FaPhone className="text-gray-400" />}
                                placeholder="Số điện thoại"
                                autoComplete="off"
                                disabled={loading}
                                size={isMobile ? "middle" : "large"}
                                className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </Form.Item>

                        {/* Address */}
                        <Form.Item
                            label={<span className="text-sm sm:text-base">Địa chỉ</span>}
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Input
                                prefix={<FaMapMarkerAlt className="text-gray-400" />}
                                placeholder="Địa chỉ"
                                autoComplete="off"
                                disabled={loading}
                                size={isMobile ? "middle" : "large"}
                                className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </Form.Item>

                        {/* Password */}
                        <Form.Item
                            label={<span className="text-sm sm:text-base">Mật khẩu</span>}
                            name="password"
                            hasFeedback
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu' },
                                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                            ]}
                        >
                            <Input.Password
                                prefix={<FaLock className="text-gray-400" />}
                                placeholder="Mật khẩu"
                                autoComplete="new-password"
                                disabled={loading}
                                size={isMobile ? "middle" : "large"}
                                className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </Form.Item>

                        {/* Confirm Password */}
                        <Form.Item
                            label={<span className="text-sm sm:text-base">Xác nhận mật khẩu</span>}
                            name="confirmPassword"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<FaLock className="text-gray-400" />}
                                placeholder="Xác nhận mật khẩu"
                                autoComplete="new-password"
                                disabled={loading}
                                size={isMobile ? "middle" : "large"}
                                className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size={isMobile ? "middle" : "large"}
                                className="w-full bg-black hover:bg-gray-800 text-white border-0"
                                loading={loading}
                                disabled={loading}
                            >
                                Sign Up
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* Bottom actions: divider + social + link */}
                    <div className="mt-4 sm:mt-5">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="px-3 sm:px-4 text-gray-400 text-xs sm:text-sm">Or sign up with</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <Button 
                                size={isMobile ? "small" : "middle"} 
                                disabled={loading} 
                                className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                            >
                                <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                Google
                            </Button>
                            <Button 
                                size={isMobile ? "small" : "middle"} 
                                disabled={loading} 
                                className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                            >
                                <img src="https://img.icons8.com/ios-filled/50/000000/mac-os.png" alt="Apple" className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                Apple
                            </Button>
                        </div>

                        <div className="text-center text-gray-600 mt-4 sm:mt-6">
                            <span className="text-sm">Already have an account? </span>
                            <a href="#" onClick={() => navigate("/signin")} className="text-green-600 hover:underline text-sm">
                                Sign in now
                            </a>
                        </div>

                        {/* Terms & Privacy */}
                        <div className="mt-3 sm:mt-4 text-center">
                            <p className="text-xs text-gray-600">
                                By signing up, you agree to our{" "}
                                <button className="text-green-600 hover:underline">Terms of Service</button>{" "}
                                and{" "}
                                <button className="text-green-600 hover:underline">Privacy Policy</button>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Layout (unchanged)
    return (
        <div className="w-full h-screen flex">
            <div className="w-full h-full flex flex-col  lg:flex-row">
                {/* Left Column - Registration Form */}
                <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 py-8">
                    <div className="w-full max-w-2xl flex flex-col h-full items-center justify-center">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="url(#gradient)" />
                                    <defs>
                                        <linearGradient id="gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#059669" />
                                            <stop offset="1" stopColor="#0d9488" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <h1 className="text-4xl font-extrabold text-gray-900">Laptop Shop</h1>
                </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tạo tài khoản mới</h2>
                            <p className="text-gray-600">Tham gia cộng đồng mua sắm thông minh.</p>
                </div>

                    {/* Demo Info */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-700 text-sm text-center">
                            <i className="fas fa-info-circle mr-1"></i>
                            Demo User: user@gmail.com / 123456 (Đã điền sẵn)
                        </p>
                    </div>

                        <Form
                            form={form}
                            name="signup"
                            layout="vertical"
                            onFinish={onSubmit}
                            autoComplete="off"
                            className="space-y-3"
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Họ và tên"
                                        name="fullname"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                    >
                                        <Input
                                            prefix={<FaUser className="text-gray-400" />}
                            placeholder="Họ và tên"
                                            autoComplete="off"
                                            disabled={loading}
                                            className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email' },
                                            { type: 'email', message: 'Email không hợp lệ' },
                                        ]}
                                    >
                                        <Input
                                            prefix={<FaEnvelope className="text-gray-400" />}
                            placeholder="E-mail"
                                            autoComplete="off"
                                            disabled={loading}
                                            className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                            { pattern: /^[0-9]{9,12}$/, message: 'Số điện thoại không hợp lệ' },
                                        ]}
                                    >
                                        <Input
                                            prefix={<FaPhone className="text-gray-400" />}
                            placeholder="Số điện thoại"
                                            autoComplete="off"
                                            disabled={loading}
                                            className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Địa chỉ"
                                        name="address"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                    >
                                        <Input
                                            prefix={<FaMapMarkerAlt className="text-gray-400" />}
                            placeholder="Địa chỉ"
                                            autoComplete="off"
                                            disabled={loading}
                                            className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Mật khẩu"
                                        name="password"
                                        hasFeedback
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                                            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<FaLock className="text-gray-400" />}
                            placeholder="Mật khẩu"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Xác nhận mật khẩu"
                                        name="confirmPassword"
                                        dependencies={["password"]}
                                        hasFeedback
                                        rules={[
                                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Mật khẩu không khớp'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<FaLock className="text-gray-400" />}
                                            placeholder="Xác nhận mật khẩu"
                                            autoComplete="new-password"
                                            disabled={loading}
                                            className="py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="w-full bg-black hover:bg-gray-800 text-white border-0 "
                                    loading={loading}
                                    disabled={loading}
                                >
                                    Sign Up
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* Bottom actions: divider + social + link */}
                        <div className="mt-5">
                            <div className="flex items-center mb-6">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="px-4 text-gray-400">Or sign up with                                </span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button size='middle' disabled={loading} className=" flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                                    <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
                                    Google
                                </Button>
                                <Button size='middle' disabled={loading} className=" flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                                    <img src="https://img.icons8.com/ios-filled/50/000000/mac-os.png" alt="Apple" className="w-5 h-5 mr-2" />
                                    Apple
                                </Button>
                    </div>

                            <div className="text-center text-gray-600 mt-6">
                                Already have an account?{" "}
                                <a href="#" onClick={() => navigate("/signin")} className="text-green-600 hover:underline">
                                    Sign in now
                                </a>
                    </div>

                {/* Terms & Privacy */}
                            <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600">
                                    By signing up, you agree to our{" "}
                                    <button className="text-green-600 hover:underline">Terms of Service</button>{" "}
                                    and{" "}
                                    <button className="text-green-600 hover:underline">Privacy Policy</button>.
                    </p>
                </div>

                        </div>
                    </div>
                </div>

                {/* Right Column - Registration Analytics */}
                <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/dark-mosaic.png)' }}></div>
                    <div className="relative z-10 text-white text-center backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20">
                        <h3 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-fadeInUp">
                            Transform Data into Cool Insights
                        </h3>
                        <p className="text-gray-300 mb-8 max-w-md mx-auto">
                            Make informed decisions with Laptop Shop's powerful analytics tools.
                            Harness the power of data to drive your business forward.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Sales Revenue */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold">Sales Revenue</h3>
                                    <FaDollarSign className="text-green-400 text-xl" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">${userGrowth.toLocaleString()}</div>
                                <div className="text-gray-400 text-sm mb-4">
                                    Your revenue decreased this month by about $421
                                </div>
                                {/* Mini Chart */}
                                <div className="flex items-end space-x-1 h-12">
                                    <div className="w-3 bg-blue-500 rounded-t animate-bounce" style={{ height: '60%', animationDelay: '0s' }}></div>
                                    <div className="w-3 bg-blue-500 rounded-t animate-bounce" style={{ height: '80%', animationDelay: '0.2s' }}></div>
                                    <div className="w-3 bg-blue-500 rounded-t animate-bounce" style={{ height: '45%', animationDelay: '0.4s' }}></div>
                                    <div className="w-3 bg-blue-500 rounded-t animate-bounce" style={{ height: '90%', animationDelay: '0.6s' }}></div>
                                    <div className="w-3 bg-green-500 rounded-t animate-bounce" style={{ height: '75%', animationDelay: '0.8s' }}></div>
                                </div>
                            </div>

                            {/* Customers */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold">Customers</h3>
                                    <FaUsers className="text-purple-400 text-xl" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{activeUsers.toLocaleString()}</div>
                                <div className="text-gray-400 text-sm mb-4">
                                    Total active customers
                                </div>
                                {/* Donut Chart */}
                                <div className="relative w-16 h-16 mx-auto">
                                    <div className="w-16 h-16 rounded-full border-4 border-gray-600 border-t-purple-500 border-r-pink-500 border-b-blue-500 animate-spin" style={{ animationDuration: '3s' }}></div>
                                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-purple-400 animate-ping opacity-30" style={{ animationDuration: '2s' }}></div>
                                </div>
                            </div>

                            {/* Sales Targets */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold">Sales Targets</h3>
                                    <FaBullseye className="text-yellow-400 text-xl" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{registrationRate.toFixed(0)}%</div>
                                <div className="text-gray-400 text-sm mb-4">
                                    3,415 / 4,000 achieved
                                </div>
                                {/* Progress Circle */}
                                <div className="relative w-16 h-16 mx-auto">
                                    <div
                                        className={`w-16 h-16 rounded-full border-4 border-gray-600 border-t-green-500 transition-all duration-1000 ease-out animate-spin ${registrationRate >= 80 ? 'animate-pulse scale-110' : ''
                                            }`}
                                        style={{
                                            transform: `rotate(-90deg)`,
                                            borderTopColor: registrationRate >= 80 ? '#10b981' : '#6b7280',
                                            borderTopWidth: registrationRate >= 80 ? '6px' : '4px',
                                            animationDuration: '2s'
                                        }}
                                    ></div>
                                    {registrationRate >= 80 && (
                                        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-green-400 animate-ping opacity-20"></div>
                                    )}
                                </div>
                            </div>

                            {/* Conversion Rates */}
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-semibold">Conversion</h3>
                                    <FaChartLine className="text-cyan-400 text-xl" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{satisfaction.toFixed(1)}%</div>
                                <div className="text-gray-400 text-sm mb-4">
                                    12,565 Visitors → 1,421 Sales
                                </div>
                                {/* Line Chart */}
                                <div className="flex items-end space-x-1 h-12">
                                    <div className="w-2 bg-cyan-500 rounded-t animate-bounce" style={{ height: '40%', animationDelay: '0s' }}></div>
                                    <div className="w-2 bg-cyan-500 rounded-t animate-bounce" style={{ height: '60%', animationDelay: '0.1s' }}></div>
                                    <div className="w-2 bg-cyan-500 rounded-t animate-bounce" style={{ height: '80%', animationDelay: '0.2s' }}></div>
                                    <div className="w-2 bg-cyan-500 rounded-t animate-bounce" style={{ height: '70%', animationDelay: '0.3s' }}></div>
                                    <div className="w-2 bg-cyan-500 rounded-t animate-bounce" style={{ height: '90%', animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Indicators */}
                        <div className="flex justify-center space-x-2 mt-6">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;