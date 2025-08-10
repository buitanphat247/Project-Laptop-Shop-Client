import { NavLink, useNavigate } from "react-router-dom";
import { Modal, Dropdown, Drawer, Button } from 'antd';
import React, { useState } from 'react';
import {
    UserOutlined, SettingOutlined, InfoCircleOutlined, LogoutOutlined, QuestionCircleOutlined, MessageOutlined, ShoppingCartOutlined, FileTextOutlined, BellOutlined, HeartOutlined, MenuOutlined, CloseOutlined
} from '@ant-design/icons';
import NotificationsPanel from './NotificationsPanel';
import CartAnimation from './CartAnimation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { logUserActivity } from "../utils";
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const Header = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isLoggedIn, role, logout } = useAuth();
    const { cartCount, showAnimation, hideAnimation } = useCart();
    const { isDesktop, isTablet, isMobile } = useDeviceDetection();
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

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        logUserActivity('mobile_menu_toggle');
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
    };

    // Close mobile menu when switching to desktop
    React.useEffect(() => {
        if (isDesktop && mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [isDesktop, mobileMenuOpen]);

    // Navigation items array
    const navigationItems = [
        { to: "/", icon: "fas fa-home", label: "Trang chủ" },
        { to: "/products", icon: "fas fa-box", label: "Sản phẩm" },
        { to: "/news", icon: "fas fa-newspaper", label: "Tin tức" },
        { to: "/about", icon: "fas fa-info-circle", label: "Giới thiệu" },
        // Chỉ hiển thị Hỗ trợ khi đã đăng nhập
        ...(isLoggedIn ? [{ to: "/support", icon: "fas fa-headset", label: "Hỗ trợ" }] : [])
    ];

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
            key: 'help&support',
            icon: <QuestionCircleOutlined />, label: 'Trợ giúp và hỗ trợ',
            onClick: () => navigate('/help&support')
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
                {/* Top Announcement Bar - Hidden on mobile */}
                <div className="hidden sm:block bg-yellow-400 text-gray-800 px-4 md:px-6 py-2 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between text-xs md:text-sm space-y-2 md:space-y-0">
                        {/* Left - Contact Info */}
                        <div className="flex items-center">
                            <i className="fas fa-phone mr-2 text-green-700"></i>
                            <span className="font-medium hidden sm:inline">Call Us: +84-123-456-789</span>
                            <span className="font-medium sm:hidden">+84-123-456-789</span>
                        </div>

                        {/* Center - Promotional Message */}
                        <div className="flex items-center text-center">
                            <span className="font-medium hidden lg:inline">Đăng ký và NHẬN 25% GIẢM GIÁ cho đơn hàng đầu tiên.</span>
                            <span className="font-medium lg:hidden">Đăng ký NHẬN 25% GIẢM GIÁ!</span>
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
                        <div className="flex items-center space-x-2 md:space-x-3">
                            {[
                                { icon: 'fab fa-facebook-f', color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
                                { icon: 'fab fa-github', color: 'bg-gray-800', hover: 'hover:bg-gray-900' },
                                { icon: 'fab fa-linkedin-in', color: 'bg-blue-700', hover: 'hover:bg-blue-800' }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${social.color} ${social.hover} text-white flex items-center justify-center text-xs transition-colors duration-200`}
                                    onClick={() => logUserActivity('social_click', { platform: social.icon })}
                                >
                                    <i className={social.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <header className="bg-blue-600 text-white px-4 md:px-6 py-3 md:py-4 shadow-md">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center text-inherit ${isActive ? "text-blue-600" : ""}`
                            }
                            onClick={() => logUserActivity('navigation', { destination: 'home' })}
                        >
                            <h1 className="text-lg md:text-2xl font-bold flex items-center">
                                <i className="fas fa-laptop-code mr-2"></i>
                                <span className="hidden sm:inline">Laptop Shop - NTK</span>
                                <span className="sm:hidden">Laptop Shop</span>
                            </h1>
                        </NavLink>

                        {/* Desktop Navigation */}
                        {isDesktop && (
                            <nav className="hidden lg:block">
                            <ul className="flex space-x-3 text-base font-medium items-center">
                                {/* Navigation links */}
                                    {navigationItems.map((item, index) => (
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
                                            title="Thông báo (Đang phát triển)"
                                        >
                                            <BellOutlined className="text-xl" />
                                            <span className="absolute -top-1 -right-1 text-xs text-yellow-300">🔒</span>
                                        </button>
                                    </li>
                                )}
                                    {/* Shopping cart icon */}
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
                                                {cartCount > 0 && (
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
                        )}

                        {/* Mobile/Tablet Right Side */}
                        <div className="flex items-center space-x-2 lg:hidden">
                            {/* Notification bell icon */}
                            {isLoggedIn && (
                                <button
                                    className="relative flex items-center px-2 py-2 rounded-full transition duration-200 ease-in-out text-gray-200 hover:text-white hover:bg-blue-500"
                                    onClick={() => {
                                        setShowNotifications(true);
                                        logUserActivity('navigation', { destination: 'notifications' });
                                    }}
                                    title="Thông báo (Đang phát triển)"
                                >
                                    <BellOutlined className="text-lg" />
                                    <span className="absolute -top-1 -right-1 text-xs text-yellow-300">🔒</span>
                                </button>
                            )}
                            {/* Shopping cart icon */}
                            {isLoggedIn && (
                                <button
                                    className="relative flex items-center px-2 py-2 rounded-full transition duration-200 ease-in-out text-gray-200 hover:text-white hover:bg-blue-500"
                                    onClick={() => {
                                        navigate('/cart');
                                        logUserActivity('navigation', { destination: 'cart' });
                                    }}
                                >
                                    <ShoppingCartOutlined className="text-xl" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[10px] text-center font-bold border border-white shadow" style={{ fontSize: '10px' }}>{cartCount}</span>
                                    )}
                                </button>
                            )}
                            {/* Avatar for mobile */}
                            {isLoggedIn && (
                                <button
                                    className="flex items-center cursor-pointer"
                                    onClick={() => setMobileMenuOpen(true)}
                                >
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="avatar"
                                            className="object-cover rounded-full w-8 h-8 border-2 border-white hover:border-blue-400 transition"
                                            title={userFullname || "Tài khoản"}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center border-2 border-white hover:border-blue-400 transition">
                                            <UserOutlined className="text-white text-sm" />
                                        </div>
                                    )}
                                </button>
                            )}
                            {/* Login button for mobile */}
                            {!isLoggedIn && (
                                <NavLink
                                    to="/auth"
                                    className={({ isActive }) =>
                                        `flex items-center gap-1 px-3 py-2 rounded-lg transition duration-200 ease-in-out text-sm
                                    ${isActive
                                            ? "bg-blue-700 text-white shadow-md"
                                            : "text-gray-200 hover:text-white hover:bg-blue-500"}`
                                    }
                                    onClick={() => logUserActivity('navigation', { destination: 'auth' })}
                                >
                                    <i className="fa-solid fa-right-to-bracket text-sm"></i>
                                    <span className="hidden sm:inline">Đăng nhập</span>
                                </NavLink>
                            )}
                            {/* Mobile menu button */}
                            <button
                                className="flex items-center px-2 py-2 rounded-lg transition duration-200 ease-in-out text-gray-200 hover:text-white hover:bg-blue-500"
                                onClick={handleMobileMenuToggle}
                            >
                                {mobileMenuOpen ? (
                                    <CloseOutlined className="text-lg" />
                                ) : (
                                    <MenuOutlined className="text-lg" />
                                )}
                            </button>
                        </div>
                    </div>
                </header>
            </div>

            {/* Spacer to prevent content from being hidden behind fixed header */}
            <div className="h-20 md:h-28"></div>

            {/* Mobile Menu Drawer */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={handleMobileMenuClose}
                open={mobileMenuOpen}
                width={280}
                className="lg:hidden"
                closeIcon={<CloseOutlined />}
            >
                <div className="space-y-4">
                    {/* User Info */}
                    {isLoggedIn && (
                        <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center space-x-3">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                        <UserOutlined className="text-white text-xl" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-semibold text-gray-900">{userFullname}</div>
                                    <div className="text-sm text-gray-500">{user?.email}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Điều hướng
                        </div>
                        {navigationItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.to}
                                end={item.to === "/"}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors
                                ${isActive
                                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`
                                }
                                onClick={() => {
                                    handleMobileMenuClose();
                                    logUserActivity('navigation', { destination: item.label });
                                }}
                            >
                                <i className={`${item.icon} w-5 text-center`}></i>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                        {/* Docs link */}
                        <NavLink
                            to="/docs"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors
                            ${isActive
                                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`
                            }
                            onClick={() => {
                                handleMobileMenuClose();
                                logUserActivity('navigation', { destination: 'Docs' });
                            }}
                        >
                            <i className="fas fa-file-alt w-5 text-center"></i>
                            <span>Docs</span>
                        </NavLink>
                    </div>

                    {/* User Menu Items */}
                    {isLoggedIn && (
                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                Tài khoản
                            </div>
                            {userMenuItems.filter(item => item.type !== 'divider').map((item, index) => (
                                <button
                                    key={index}
                                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors w-full text-left
                                ${item.danger 
                                        ? "text-red-600 hover:bg-red-50" 
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                                    onClick={() => {
                                        handleMobileMenuClose();
                                        item.onClick();
                                    }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Login for non-logged in users */}
                    {!isLoggedIn && (
                        <div className="border-t border-gray-200 pt-4">
                            <NavLink
                                to="/auth"
                                className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => {
                                    handleMobileMenuClose();
                                    logUserActivity('navigation', { destination: 'auth' });
                                }}
                            >
                                <i className="fa-solid fa-right-to-bracket"></i>
                                <span>Đăng nhập</span>
                            </NavLink>
                        </div>
                    )}
                </div>
            </Drawer>

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