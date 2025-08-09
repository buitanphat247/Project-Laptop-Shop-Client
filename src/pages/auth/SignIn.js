import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaChartLine, FaUsers, FaDollarSign, FaBullseye } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import axiosClient from "../../config/axios";
import { Form, Input, Button } from 'antd';

const SignIn = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { signin } = useAuth();
    const [form] = Form.useForm();
    
    // Animated values for charts
    const [salesRevenue, setSalesRevenue] = useState(0);
    const [customers, setCustomers] = useState(0);
    const [salesTarget, setSalesTarget] = useState(0);
    const [conversion, setConversion] = useState(0);

    // Set default values
    React.useEffect(() => {
        form.setFieldsValue({
            email: "admin@gmail.com",
            password: "admin2747"
        });
    }, [form]);

    // Animate chart values
    useEffect(() => {
        const animateValues = () => {
            // Sales Revenue animation
            const revenueInterval = setInterval(() => {
                setSalesRevenue(prev => {
                    if (prev >= 5832) {
                        clearInterval(revenueInterval);
                        return 5832;
                    }
                    return prev + Math.ceil((5832 - prev) / 20);
                });
            }, 50);

            // Customers animation
            const customersInterval = setInterval(() => {
                setCustomers(prev => {
                    if (prev >= 2758) {
                        clearInterval(customersInterval);
                        return 2758;
                    }
                    return prev + Math.ceil((2758 - prev) / 20);
                });
            }, 50);

            // Sales Target animation
            const targetInterval = setInterval(() => {
                setSalesTarget(prev => {
                    if (prev >= 80) {
                        clearInterval(targetInterval);
                        return 80;
                    }
                    return prev + 2;
                });
            }, 100);

            // Conversion animation
            const conversionInterval = setInterval(() => {
                setConversion(prev => {
                    if (prev >= 75.3) {
                        clearInterval(conversionInterval);
                        return 75.3;
                    }
                    return prev + 1.5;
                });
            }, 100);
        };

        // Start animation after 1 second
        const timer = setTimeout(animateValues, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Quick login function
    const quickLogin = async (userType) => {
        const credentials = {
            admin: { email: "admin@gmail.com", password: "admin2747" },
            user: { email: "user@gmail.com", password: "user2747" }
        };
        const { email, password } = credentials[userType];
        form.setFieldsValue({ email, password });
        setLoading(true);
        try {
            const result = await signin(email, password);
            if (result.success) {
                setTimeout(() => {
                    setLoading(false);
                    navigate('/');
                }, 1500);
            } else {
                toast.error('Đăng nhập nhanh thất bại!');
                setLoading(false);
            }
        } catch (error) {
            console.error('❌ Quick login failed:', error);
            toast.error('Đăng nhập nhanh thất bại!');
            setLoading(false);
        }
    };

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const result = await signin(values.email, values.password);
            if (result.success) {
                setTimeout(() => {
                    setLoading(false);
                    navigate('/');
                }, 2500);
            } else {
                toast.error('Đăng nhập thất bại!');
                setLoading(false);
            }
        } catch (error) {
            console.error('❌ Sign in failed:', error);
            toast.error('Đăng nhập thất bại!');
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex">
            {/* Left Column - Login Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center">
                <div className="w-full max-w-md">
                {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                            <i className="fas fa-laptop-code text-white text-xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back to Laptop Shop
                    </h1>
                        <p className="text-gray-600">Enter your username and password to continue.</p>
                </div>

                {/* Form */}
                    <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
                    {/* Demo Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-700 text-sm text-center">
                            <i className="fas fa-info-circle mr-1"></i>
                            Demo Admin: admin@gmail.com / admin2747 (Đã điền sẵn)
                        </p>
                    </div>

                    {/* Quick Login Buttons */}
                    <div className="space-y-3 mb-6">
                        <p className="text-gray-600 text-sm text-center font-medium">Đăng nhập nhanh:</p>
                        <div className="grid grid-cols-2 gap-3">
                                <Button
                                type="button"
                                onClick={() => quickLogin('admin')}
                                disabled={loading}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                <i className="fas fa-user-shield mr-2"></i>
                                Admin
                                </Button>
                                <Button
                                type="button"
                                onClick={() => quickLogin('user')}
                                disabled={loading}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                <i className="fas fa-user mr-2"></i>
                                User
                                </Button>
                        </div>
                        <div className="text-center">
                            <span className="text-gray-400 text-xs">hoặc điền thông tin bên dưới</span>
                        </div>
                    </div>

                    {/* Email field */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ' },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<FaEnvelope className="text-gray-400" />}
                                placeholder="Enter your email address"
                                autoComplete="off"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                disabled={loading}
                            />
                        </Form.Item>

                    {/* Password field */}
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu' },
                                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<FaLock className="text-gray-400" />}
                                placeholder="Enter your password"
                                autoComplete="off"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                disabled={loading}
                            />
                        </Form.Item>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between mb-3">
                            <Button
                                type="link"
                                onClick={() => navigate('/reset-password')}
                                className="p-0 text-sm"
                            >
                                Forgot password?
                            </Button>
                    </div>

                    {/* Submit button */}
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            className="w-full bg-black hover:bg-gray-800 text-white border-0"
                        >
                            Sign In
                        </Button>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-gray-300"></div>
                            <span className="px-4 text-sm text-gray-500">Or login with</span>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <Button size='middle' className="flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                                <i className="fab fa-google mr-2 text-red-500"></i>
                                Google
                            </Button>
                            <Button size='middle' className="flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                                <i className="fab fa-apple mr-2"></i>
                                Apple
                            </Button>
                        </div>

                        {/* Register link */}
                    <div className="text-center">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Button
                                type="link"
                                onClick={() => navigate('/signup')}
                                className="p-0 text-blue-600"
                            >
                                Register
                            </Button>
                    </div>
                    </Form>

                {/* Footer */}
                    <div className=" text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-gray-500 hover:text-gray-700 transition duration-200 flex items-center justify-center mx-auto"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Quay về trang chủ
                    </button>
                    </div>
                </div>
            </div>

            {/* Right Column - Dashboard Charts */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-center px-12 py-12">
                <div className="space-y-8">
                    {/* Welcome Message */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Transform Data into Cool Insights
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Make informed decisions with Laptop Shop's powerful analytics tools.
                            Harness the power of data to drive your business forward.
                        </p>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Sales Revenue */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold">Sales Revenue</h3>
                                <FaDollarSign className="text-green-400 text-xl" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">${salesRevenue.toLocaleString()}</div>
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

                        {/* Customer Segmentation */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold">Customers</h3>
                                <FaUsers className="text-purple-400 text-xl" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">{customers.toLocaleString()}</div>
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
                            <div className="text-3xl font-bold text-white mb-2">{salesTarget.toFixed(0)}%</div>
                            <div className="text-gray-400 text-sm mb-4">
                                3,415 / 4,000 achieved
                            </div>
                                                         {/* Progress Circle */}
                             <div className="relative w-16 h-16 mx-auto">
                                 <div 
                                     className={`w-16 h-16 rounded-full border-4 border-gray-600 border-t-green-500 transition-all duration-1000 ease-out animate-spin ${
                                         salesTarget >= 80 ? 'animate-pulse scale-110' : ''
                                     }`}
                                     style={{ 
                                         transform: `rotate(-90deg)`,
                                         borderTopColor: salesTarget >= 80 ? '#10b981' : '#6b7280',
                                         borderTopWidth: salesTarget >= 80 ? '6px' : '4px',
                                         animationDuration: '2s'
                                     }}
                                 ></div>
                                 {salesTarget >= 80 && (
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
                            <div className="text-3xl font-bold text-white mb-2">{conversion.toFixed(1)}%</div>
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
                    <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;