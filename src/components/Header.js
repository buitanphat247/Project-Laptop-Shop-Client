import { NavLink, useNavigate } from "react-router-dom";
import { Modal, Dropdown } from 'antd';
import React, { useState } from 'react';
import {
    UserOutlined, SettingOutlined, InfoCircleOutlined, LogoutOutlined, QuestionCircleOutlined, MessageOutlined, ShoppingCartOutlined, FileTextOutlined, BellOutlined, HeartOutlined
} from '@ant-design/icons';
import NotificationsPanel from './NotificationsPanel';
import CartAnimation from './CartAnimation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { logUserActivity } from "../utils";

const Header = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user, isLoggedIn, role, logout } = useAuth();
    const { cartCount, showAnimation, hideAnimation } = useCart();
    const userFullname = user?.fullname || user?.name || user?.email || '';

    const handleLogout = async () => {
        setConfirmLoading(true);
        try {
            await logout();
        } catch (err) { }
        // setTimeout(() => {
        setConfirmLoading(false);
        setOpen(false);
        navigate('/auth'); // Chuyển về trang chủ sau khi logout
        // }, 1000);
    };

    const showModal = () => {
        setOpen(true);
        logUserActivity('logout_modal_open');
    };

    const handleCancel = () => {
        setOpen(false);
        logUserActivity('logout_modal_cancel');
    };

    // Dropdown menu for user avatar
    const userMenuItems = [
        {
            key: 'favorite-products',
            icon: <HeartOutlined />, label: 'Sản phẩm yêu thích',
            onClick: () => navigate('/favorite-products')
        },
        {
            key: 'orders',
            icon: <FileTextOutlined />, label: 'Đơn hàng',
            onClick: () => navigate('/orders')
        },
        { type: 'divider' },
        {
            key: 'settings',
            icon: <SettingOutlined />, label: 'Cài đặt',
            onClick: () => navigate('/setting')
        },
        {
            key: 'help',
            icon: <QuestionCircleOutlined />, label: 'Trợ giúp và hỗ trợ',
            onClick: () => navigate('/help')
        },
        {
            key: 'feedback',
            icon: <MessageOutlined />, label: 'Đóng góp ý kiến',
            onClick: () => navigate('/feedback')
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true,
            onClick: showModal
        }
    ];

    return (
        <>
            {/* Combined Header Container */}
            <div className="fixed top-0 left-0 right-0 z-50">
                {/* Top Announcement Bar */}
                <div className="bg-yellow-400 text-gray-800 px-6 py-2 shadow-sm">
                    <div className="flex items-center justify-between text-sm">
                        {/* Left - Contact Info */}
                        <div className="flex items-center">
                            <i className="fas fa-phone mr-2 text-green-700"></i>
                            <span className="font-medium">Call Us: +84-123-456-789</span>
                        </div>

                        {/* Center - Promotional Message */}
                        <div className="flex items-center">
                            <span className="font-medium">Đăng ký và NHẬN 25% GIẢM GIÁ cho đơn hàng đầu tiên.</span>
                            <a
                                href="#"
                                className="ml-2 text-green-700 underline font-semibold hover:text-green-800 transition-colors"
                                onClick={() => {
                                    navigate('/auth');
                                    logUserActivity('navigation', { destination: 'signup_promo' });
                                }}
                            >
                                Đăng ký ngay
                            </a>
                        </div>

                        {/* Right - Social Media Icons */}
                        <div className="flex items-center space-x-3">
                            {[
                                { icon: 'fab fa-facebook-f', color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
                                { icon: 'fab fa-github', color: 'bg-gray-800', hover: 'hover:bg-gray-900' },
                                { icon: 'fab fa-linkedin-in', color: 'bg-blue-700', hover: 'hover:bg-blue-800' }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className={`w-6 h-6 rounded-full ${social.color} ${social.hover} text-white flex items-center justify-center text-xs transition-colors duration-200`}
                                    onClick={() => logUserActivity('social_click', { platform: social.icon })}
                                >
                                    <i className={social.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <header className="bg-blue-600 text-white px-6 py-4 shadow-md">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center text-inherit ${isActive ? "text-blue-600" : ""}`
                            }
                            onClick={() => logUserActivity('navigation', { destination: 'home' })}
                        >
                            <h1 className="text-2xl font-bold flex items-center">
                                <i className="fas fa-laptop-code mr-2"></i>
                                Laptop Shop - NTK
                            </h1>
                        </NavLink>

                        {/* Navigation + Notification */}
                        <nav>
                            <ul className="flex space-x-3 text-base font-medium items-center">
                                {/* Navigation links */}
                                {[
                                    { to: "/", icon: "fas fa-home", label: "Trang chủ" },
                                    { to: "/products", icon: "fas fa-box", label: "Sản phẩm" },
                                    { to: "/news", icon: "fas fa-newspaper", label: "Tin tức" },
                                    { to: "/about", icon: "fas fa-info-circle", label: "Giới thiệu" },
                                    // Chỉ hiển thị Hỗ trợ khi đã đăng nhập
                                    ...(isLoggedIn ? [{ to: "/support", icon: "fas fa-headset", label: "Hỗ trợ" }] : [])
                                ].map((item, index) => (
                                    <li key={index}>
                                        <NavLink
                                            to={item.to}
                                            end={item.to === "/"}
                                            className={({ isActive }) =>
                                                `flex items-center gap-2 px-4 py-2 rounded-xl transition duration-200 ease-in-out
                                            ${isActive
                                                    ? "bg-blue-700 text-white shadow-md"
                                                    : "text-gray-200 hover:text-white hover:bg-blue-500"}`
                                            }
                                            onClick={() => logUserActivity('navigation', { destination: item.label })}
                                        >
                                            {/* <i className={item.icon}></i> */}
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                                {/* Docs menu item - always visible */}
                                <li>
                                    <NavLink
                                        to="/docs"
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 px-4 py-2 rounded-xl transition duration-200 ease-in-out
                                        ${isActive
                                                ? "bg-blue-700 text-white shadow-md"
                                                : "text-gray-200 hover:text-white hover:bg-blue-500"}`
                                        }
                                        onClick={() => logUserActivity('navigation', { destination: 'Docs' })}
                                    >
                                        {/* <InfoCircleOutlined className="text-base" /> */}
                                        Docs
                                    </NavLink>
                                </li>

                                {/* Notification bell icon */}
                                {isLoggedIn && (
                                    <li>
                                        <button
                                            className="relative flex items-center px-3 py-2 rounded-full transition duration-200 ease-in-out text-gray-200 hover:text-white hover:bg-blue-500"
                                            onClick={() => {
                                                setShowNotifications(true);
                                                logUserActivity('navigation', { destination: 'notifications' });
                                            }}
                                        >
                                            <BellOutlined className="text-xl" />
                                            {/* Badge số lượng thông báo chưa đọc */}
                                            {/* <span className="absolute bottom-5 right-0.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-bold border border-white shadow" style={{ fontSize: '10px' }}>3</span> */}
                                        </button>
                                    </li>
                                )}
                                {/* Shopping cart icon - moved next to bell */}
                                {isLoggedIn && (
                                    <li>
                                        <button
                                            className="relative flex items-center px-3 py-2 rounded-full transition duration-200 ease-in-out text-gray-200 hover:text-white hover:bg-blue-500"
                                            onClick={() => {
                                                navigate('/cart');
                                                logUserActivity('navigation', { destination: 'cart' });
                                            }}
                                        >
                                            <ShoppingCartOutlined className="text-2xl" />
                                            {(
                                                <span className="absolute bottom-5 right-0.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[10px] text-center font-bold border border-white shadow" style={{ fontSize: '10px' }}>{cartCount}</span>
                                            )}
                                        </button>
                                    </li>
                                )}

                                {/* Avatar Dropdown */}
                                {isLoggedIn && (
                                    <li>
                                        <Dropdown
                                            menu={{ items: userMenuItems }}
                                            trigger={['hover']}
                                            placement="bottomRight"
                                            arrow={false}
                                            mouseEnterDelay={0}
                                            mouseLeaveDelay={0.1}
                                        >
                                            <div className="flex items-center cursor-pointer">
                                                {user?.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt="avatar"
                                                        className="object-cover rounded-full w-10 h-10 border-2 border-white hover:border-blue-400 transition"
                                                        title={userFullname || "Tài khoản"}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center border-2 border-white hover:border-blue-400 transition">
                                                        <UserOutlined className="text-white text-lg" />
                                                    </div>
                                                )}
                                            </div>
                                        </Dropdown>
                                    </li>
                                )}
                                {!isLoggedIn && (
                                    <li>
                                        <NavLink
                                            to="/auth"
                                            className={({ isActive }) =>
                                                `flex items-center gap-2 px-4 py-2 rounded-xl transition duration-200 ease-in-out
                                            ${isActive
                                                    ? "bg-blue-700 text-white shadow-md"
                                                    : "text-gray-200 hover:text-white hover:bg-blue-500"}`
                                            }
                                            onClick={() => logUserActivity('navigation', { destination: 'auth' })}
                                        >
                                            <i className="fa-solid fa-right-to-bracket"></i>
                                            Đăng nhập
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>
                </header>
            </div>

            {/* Spacer to prevent content from being hidden behind fixed header */}
            <div className="h-28"></div>

            {/* Cart Animation */}
            <CartAnimation 
                show={showAnimation} 
                onAnimationEnd={hideAnimation}
            />

            {/* Notifications Panel */}
            <NotificationsPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
            />

            <Modal
                title="Xác nhận đăng xuất"
                open={open}
                onOk={handleLogout}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Đăng xuất"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <div className="space-y-3">
                    <p>Bạn có chắc chắn muốn đăng xuất?</p>
                    {userFullname && (
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-gray-600 text-sm">
                                Đăng xuất tài khoản: <strong className="text-gray-800">{userFullname}</strong>
                            </p>
                        </div>
                    )}
                    <p className="text-xs text-gray-500">
                        Tất cả dữ liệu phiên làm việc sẽ được xóa.
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default Header;