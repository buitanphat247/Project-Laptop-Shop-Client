import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Menu, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, GlobalOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import AccountInfo from './setting/AccountInfo';
import NotificationSettings from './setting/NotificationSettings';
import ChangePassword from './setting/ChangePassword';
import LanguageRegion from './setting/LanguageRegion';
import HelpSupport from './setting/HelpSupport';
import { getUserProfile } from '../utils/auth';
import axiosClient from '../config/axios';

const { Sider, Content } = Layout;

const Setting = () => {
    const [selectedMenu, setSelectedMenu] = useState('account');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy user ID từ localStorage hoặc auth context
    const currentUser = getUserProfile();
    const userId = currentUser?.id;

    // Fetch user data by ID
    const fetchUserById = useCallback(async (id) => {
        if (!id) {
            setError('Không tìm thấy ID người dùng');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('🚀 Fetching user data for ID:', id);

            const response = await axiosClient.get(`/users/${id}`);

            console.log('✅ User data fetched successfully:', response.data);

            setUserInfo(response.data.data || response.data);
            setError(null);
        } catch (error) {
            console.error('❌ Error fetching user data:', error);

            // Mock data fallback khi API lỗi
            const mockUserData = {
                id: id,
                fullName: currentUser?.fullname || 'Nguyen Van A',
                email: currentUser?.email || 'user@example.com',
                phone: '0123456789',
                address: '123 Nguyen Van Linh, Da Nang',
                role: currentUser?.role || 'user',
                avatar: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setUserInfo(mockUserData);
            setError('Không thể tải dữ liệu từ server, sử dụng dữ liệu cache');

            message.warning('Không thể tải dữ liệu người dùng từ server');
        } finally {
            setLoading(false);
        }
    }, [currentUser?.fullname, currentUser?.email, currentUser?.role]); // Dependencies

    // Refresh user data
    const refreshUserData = useCallback(() => {
        if (userId) {
            fetchUserById(userId);
        }
    }, [userId, fetchUserById]);

    // Initial fetch
    useEffect(() => {
        if (userId) {
            fetchUserById(userId);
        } else {
            setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            setLoading(false);
        }
    }, [userId, fetchUserById]); // Proper dependencies

    // Handle user data update
    const handleUserUpdate = useCallback((updatedData) => {
        setUserInfo(prev => ({
            ...prev,
            ...updatedData
        }));

        // Optionally refetch from server to ensure sync
        setTimeout(() => {
            refreshUserData();
        }, 1000);
    }, [refreshUserData]);

    // Rest of the component remains the same...
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" tip="Đang tải thông tin người dùng..." />
                </div>
            );
        }

        if (error && !userInfo) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <QuestionCircleOutlined className="text-6xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Không thể tải thông tin
                    </h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={refreshUserData}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        switch (selectedMenu) {
            case 'account':
                return (
                    <AccountInfo
                        userInfo={userInfo}
                        onUpdate={handleUserUpdate}
                        onRefresh={refreshUserData}
                    />
                );
            case 'password':
                return (
                    <ChangePassword
                        userInfo={userInfo}
                        onUpdate={handleUserUpdate}
                    />
                );
            case 'notification':
                return (
                    <NotificationSettings
                        userInfo={userInfo}
                        onUpdate={handleUserUpdate}
                    />
                );
            case 'language':
                return (
                    <LanguageRegion
                        userInfo={userInfo}
                        onUpdate={handleUserUpdate}
                    />
                );
            case 'help':
                return (
                    <HelpSupport
                        userInfo={userInfo}
                    />
                );
            default:
                return null;
        }
    };

    const menuItems = [
        {
            key: 'account',
            icon: <UserOutlined />,
            label: 'Thông tin tài khoản',
            disabled: loading
        },
        {
            key: 'password',
            icon: <LockOutlined />,
            label: 'Thay đổi mật khẩu',
            disabled: loading
        },
        {
            key: 'notification',
            icon: <BellOutlined />,
            label: 'Cài đặt thông báo',
            disabled: loading
        },

        {
            key: 'language',
            icon: <GlobalOutlined />,
            label: 'Ngôn ngữ & Khu vực',
            disabled: loading
        },
        {
            key: 'help',
            icon: <QuestionCircleOutlined />,
            label: 'Hỗ trợ & Trợ giúp',
            disabled: loading
        },
    ];

    return (
        <Layout className=" rounded-xl overflow-hidden">
            <Sider width={280} className="bg-white shadow-md">
                {/* User info header */}
                <div className="p-4 border-b border-gray-200">
                    {loading ? (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                            <div>
                                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ) : userInfo ? (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                {userInfo.fullName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 truncate">
                                    {userInfo.fullName || 'Người dùng'}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {userInfo.email || 'N/A'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <UserOutlined className="text-2xl mb-1" />
                            <div className="text-xs">Không có thông tin</div>
                        </div>
                    )}
                </div>

                {/* Menu */}
                <Menu
                    mode="inline"
                    selectedKeys={[selectedMenu]}
                    onClick={(e) => setSelectedMenu(e.key)}
                    items={menuItems}
                    className="border-0"
                />

                {process.env.NODE_ENV === 'development' && userInfo && (
                    <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
                        <div>ID: {userInfo.id}</div>
                        <div>Role: {userInfo.role}</div>
                    </div>
                )}
            </Sider>

            <Content className="p-6 bg-gray-50">
                {renderContent()}
            </Content>
        </Layout>
    );
};

export default Setting;