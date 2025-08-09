/**
 * Constants Configuration File
 * 
 * File này chứa tất cả các hằng số, dữ liệu mẫu và cấu hình
 * được sử dụng trong toàn bộ ứng dụng.
 * 
 * Bao gồm:
 * - Dashboard cards data cho các module khác nhau
 * - Sample data cho reviews, ratings
 * - Service features data
 * - Image URLs và fallback images
 * - Utility functions
 */

import { Space, Tag } from 'antd';
import React from 'react';
// Import các icon từ lucide-react cho dashboard cards
import { Eye, DollarSign, Clock, Users, Package, ShoppingCart, FileText } from "lucide-react";

/**
 * Dashboard Card Data cho User Management
 * 
 * Dữ liệu cho các card thống kê trong trang quản lý user.
 * Mỗi card hiển thị một metric quan trọng về user.
 * 
 * @type {Array} - Mảng chứa các object card data
 */
export const DASHBOARD_USER_CARDS_DATA = [
    {
        title: "Total Users",        // Tiêu đề card
        icon: <Users size={16} />,   // Icon Users từ lucide-react
        value: "2,450",              // Giá trị hiển thị (có thể là string hoặc number)
        change: 12.5                 // Phần trăm thay đổi (có thể âm hoặc dương)
    },
    {
        title: "Active Users",       // Người dùng đang hoạt động
        icon: <Eye size={16} />,     // Icon Eye (mắt) - biểu tượng cho active
        value: "1,890",              // Số lượng user đang active
        change: 8.2                  // Tăng 8.2% so với tháng trước
    },
    {
        title: "New Users",          // Người dùng mới đăng ký
        icon: <Clock size={16} />,   // Icon Clock - biểu tượng cho thời gian
        value: "156",                // Số lượng user mới
        change: -5.1                 // Giảm 5.1% so với tháng trước
    }
];

/**
 * Dashboard Card Data cho Product Management
 * 
 * Dữ liệu cho các card thống kê trong trang quản lý sản phẩm.
 * Hiển thị các metrics quan trọng về sản phẩm và doanh thu.
 * 
 * @type {Array} - Mảng chứa các object card data
 */
export const DASHBOARD_PRODUCT_CARDS_DATA = [
    {
        title: "Total Products",
        icon: <Package size={16} />,
        value: "1,250",
        change: 15.8
    },
    {
        title: "Revenue",
        icon: <DollarSign size={16} />,
        value: "$25,450",
        change: -2.4
    },
    {
        title: "Stock Items",
        icon: <Clock size={16} />,
        value: "890",
        change: 7.3
    }
];

/**
 * Dashboard Card Data cho Order Management
 * 
 * Dữ liệu cho các card thống kê trong trang quản lý đơn hàng.
 * Hiển thị các metrics về đơn hàng và doanh thu từ đơn hàng.
 * 
 * @type {Array} - Mảng chứa các object card data
 */
export const DASHBOARD_ORDER_CARDS_DATA = [
    {
        title: "Total Orders",
        icon: <ShoppingCart size={16} />,
        value: "3,120",
        change: 18.9
    },
    {
        title: "Order Revenue",
        icon: <DollarSign size={16} />,
        value: "$48,920",
        change: 12.1
    },
    {
        title: "Pending Orders",
        icon: <Clock size={16} />,
        value: "67",
        change: -8.5
    }
];

/**
 * Dashboard Card Data cho News Management
 * 
 * Dữ liệu cho các card thống kê trong trang quản lý tin tức.
 * Hiển thị các metrics về bài viết và trạng thái xuất bản.
 * 
 * @type {Array} - Mảng chứa các object card data
 */
export const DASHBOARD_NEWS_CARDS_DATA = [
    {
        title: "Total Articles",
        icon: <FileText size={16} />,
        value: "245",
        change: 18.7
    },
    {
        title: "Published",
        icon: <Eye size={16} />,
        value: "189",
        change: 12.3
    },
    {
        title: "Draft Articles",
        icon: <Clock size={16} />,
        value: "56",
        change: -3.8
    }
];

/**
 * Dashboard Card Data mặc định (tổng quan)
 * 
 * Dữ liệu cho các card thống kê mặc định khi không có module cụ thể.
 * Hiển thị các metrics tổng quan về website và doanh thu.
 * 
 * @type {Array} - Mảng chứa các object card data
 */
export const DASHBOARD_DEFAULT_CARDS_DATA = [
    {
        title: "Page Views",
        icon: <Eye size={16} />,
        value: "12,450",
        change: 15.8
    },
    {
        title: "Total Revenue",
        icon: <DollarSign size={16} />,
        value: "$363.95",
        change: -34.0
    },
    {
        title: "Bounce Rate",
        icon: <Clock size={16} />,
        value: "86.5%",
        change: 24.2
    }
];


/**
 * Image Constants
 * 
 * Các hằng số cho URL hình ảnh mặc định và fallback.
 * Sử dụng khi không có hình ảnh hoặc hình ảnh bị lỗi.
 */
export const DEFAULT_IMAGE = "https://via.placeholder.com/600x600?text=No+Image";
export const FALLBACK_IMAGE = "https://cdn.tgdd.vn/Products/Images/44/309016/msi-gaming-gf63-thin-12ucx-i5-841vn-1-600x600.jpg";

/**
 * Sample Reviews Data
 * 
 * Dữ liệu mẫu cho các đánh giá sản phẩm.
 * Sử dụng để demo hoặc test giao diện review.
 * 
 * @type {Array} - Mảng chứa các object review data
 */
export const SAMPLE_REVIEWS = [
    {
        id: 1,
        name: 'Anh Tuấn',
        avatar: 'A',
        rating: 5,
        comment: 'Sản phẩm rất tốt, giao hàng nhanh, đóng gói cẩn thận. Chất lượng đúng như mô tả. Sẽ mua lại lần sau. Laptop chạy rất mượt, cấu hình mạnh mẽ, phù hợp cho công việc và giải trí.',
        time: '2 ngày trước',
        bgColor: 'bg-blue-500'
    },
    {
        id: 2,
        name: 'Mai Linh',
        avatar: 'M',
        rating: 4,
        comment: 'Laptop chạy mượt, thiết kế đẹp. Tuy nhiên pin hơi yếu một chút. Nhìn chung vẫn hài lòng. Màn hình hiển thị tốt, bàn phím gõ êm. Giá cả hợp lý so với cấu hình.',
        time: '5 ngày trước',
        bgColor: 'bg-green-500'
    },
    {
        id: 3,
        name: 'Thành Nam',
        avatar: 'T',
        rating: 5,
        comment: 'Cấu hình mạnh, phù hợp cho công việc và gaming. Giá cả hợp lý. Recommend! Shop tư vấn nhiệt tình, giao hàng đúng hẹn. Sản phẩm chính hãng, yên tâm sử dụng.',
        time: '1 tuần trước',
        bgColor: 'bg-purple-500'
    },
    {
        id: 4,
        name: 'Hoa Nguyễn',
        avatar: 'H',
        rating: 4,
        comment: 'Laptop đẹp, cấu hình ổn cho nhu cầu văn phòng. Hỗ trợ khách hàng nhiệt tình. Thiết kế sang trọng, nhẹ nhàng dễ mang theo. Pin tạm ổn, đủ dùng cho 1 ngày làm việc.',
        time: '2 tuần trước',
        bgColor: 'bg-red-500'
    },
    {
        id: 5,
        name: 'Khôi Nguyên',
        avatar: 'K',
        rating: 5,
        comment: 'Mình đã sử dụng được 3 tháng rồi, laptop vẫn chạy tốt. Không có lỗi gì, chơi game mượt mà. Tản nhiệt khá ổn, không nóng quá. Rất đáng tiền!',
        time: '3 tuần trước',
        bgColor: 'bg-indigo-500'
    },
    {
        id: 6,
        name: 'Lan Anh',
        avatar: 'L',
        rating: 4,
        comment: 'Laptop phù hợp cho sinh viên như mình. Giá cả OK, cấu hình đủ dùng cho học tập và làm việc nhẹ. Màn hình sáng đẹp, âm thanh trong trẻo. Recommend cho các bạn sinh viên!',
        time: '1 tháng trước',
        bgColor: 'bg-pink-500'
    }
];

/**
 * Service Features Data
 * 
 * Dữ liệu cho các tính năng dịch vụ của sản phẩm.
 * Hiển thị các ưu đãi và dịch vụ đi kèm.
 * 
 * @type {Array} - Mảng chứa các object service feature data
 */
export const SERVICE_FEATURES = [
    { icon: 'SafetyCertificateOutlined', color: 'text-green-600', title: 'Bảo hành', desc: '24 tháng' },
    { icon: 'TruckOutlined', color: 'text-blue-600', title: 'Miễn phí', desc: 'Giao hàng' },
    { icon: 'UndoOutlined', color: 'text-orange-600', title: 'Đổi trả', desc: '7 ngày' },
    { icon: 'PhoneOutlined', color: 'text-purple-600', title: 'Hỗ trợ', desc: '24/7' },
    { icon: 'CreditCardOutlined', color: 'text-indigo-600', title: 'Trả góp', desc: '0% lãi suất' },
    { icon: 'ThunderboltOutlined', color: 'text-yellow-600', title: 'Giao nhanh', desc: '2 giờ' }
];

/**
 * Rating Data
 * 
 * Dữ liệu cho biểu đồ rating của sản phẩm.
 * Hiển thị phân bố số sao và số lượng đánh giá.
 * 
 * @type {Array} - Mảng chứa các object rating data
 */
export const RATING_DATA = [
    { star: 5, count: 89, percentage: 70 },
    { star: 4, count: 26, percentage: 20 },
    { star: 3, count: 7, percentage: 5 },
    { star: 2, count: 4, percentage: 3 },
    { star: 1, count: 2, percentage: 2 }
];


/**
 * Dashboard Cards Data Map
 * 
 * Object mapping để lấy dữ liệu card tương ứng với từng module.
 * Sử dụng để hiển thị đúng dữ liệu cho từng trang dashboard.
 * 
 * @type {Object} - Object chứa mapping giữa module và data
 */
export const DASHBOARD_CARDS_DATA_MAP = {
    user: DASHBOARD_USER_CARDS_DATA,        // Data cho User Management
    product: DASHBOARD_PRODUCT_CARDS_DATA,  // Data cho Product Management
    order: DASHBOARD_ORDER_CARDS_DATA,      // Data cho Order Management
    news: DASHBOARD_NEWS_CARDS_DATA,        // Data cho News Management
    default: DASHBOARD_DEFAULT_CARDS_DATA,  // Data mặc định
};

/**
 * Các lựa chọn danh mục cho bộ lọc tin tức
 */
export const categoryOptions = [
    { value: '', label: 'Tất cả danh mục' },
    { value: 'technology', label: 'Công nghệ' },
    { value: 'review', label: 'Đánh giá sản phẩm' },
    { value: 'guide', label: 'Hướng dẫn' },
    { value: 'news', label: 'Tin tức' },
    { value: 'promotion', label: 'Khuyến mãi' },
    { value: 'gaming', label: 'Gaming' },
];

/**
 * Các lựa chọn thương hiệu cho bộ lọc sản phẩm
 */
export const brandOptions = [
    { value: 'MSI', label: 'MSI' },
    { value: 'ASUS', label: 'ASUS' },
    { value: 'Dell', label: 'Dell' },
    { value: 'HP', label: 'HP' },
    { value: 'Lenovo', label: 'Lenovo' },
    { value: 'Acer', label: 'Acer' },
    { value: 'Apple', label: 'Apple (MacBook)' },
    { value: 'Samsung', label: 'Samsung' },
];

/**
 * Các lựa chọn sắp xếp cho bộ lọc sản phẩm
 */
export const productSortOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'price_asc', label: 'Giá: Thấp đến cao' },
    { value: 'price_desc', label: 'Giá: Cao đến thấp' },
    { value: 'name_asc', label: 'Tên: A-Z' },
    { value: 'name_desc', label: 'Tên: Z-A' },
    { value: 'rating', label: 'Đánh giá cao' },
    { value: 'bestseller', label: 'Bán chạy' },
];

/**
 * Các lựa chọn đánh giá cho bộ lọc sản phẩm
 */
export const ratingOptions = [
    { value: 0, label: 'Tất cả đánh giá' },
    { value: 4, label: '4 sao trở lên' },
    { value: 3, label: '3 sao trở lên' },
    { value: 2, label: '2 sao trở lên' },
    { value: 1, label: '1 sao trở lên' },
];

/**
 * Các lựa chọn tính năng đặc biệt cho bộ lọc sản phẩm
 */
export const featureOptions = [
    { value: 'gaming', label: 'Gaming' },
    { value: 'touchscreen', label: 'Màn hình cảm ứng' },
    { value: 'ssd', label: 'SSD' },
    { value: 'backlit_keyboard', label: 'Bàn phím có đèn' },
    { value: 'fingerprint', label: 'Vân tay' },
    { value: 'webcam', label: 'Webcam HD' },
];

/**
 * Utility Functions
 * 
 * Các hàm tiện ích để tạo dữ liệu mẫu và tính toán.
 */

/**
 * Hàm tạo số ngẫu nhiên trong khoảng min-max
 * 
 * @param {number} min - Giá trị nhỏ nhất
 * @param {number} max - Giá trị lớn nhất
 * @returns {number} - Số ngẫu nhiên trong khoảng [min, max]
 */
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Stats Data
 * 
 * Dữ liệu thống kê mẫu cho dashboard.
 * Sử dụng số ngẫu nhiên để demo các metrics.
 * 
 * @type {Object} - Object chứa các thống kê
 */
export const statsData = {
    totalRoutes: getRandomInt(100, 500),      // Tổng số routes
    activeRoutes: getRandomInt(100, 300),     // Routes đang hoạt động
    totalPermissions: getRandomInt(200, 100), // Tổng số permissions
    adminUsers: getRandomInt(100, 200),       // Số admin users
    regularUsers: getRandomInt(100, 300)      // Số regular users
};

/**
 * Các lựa chọn sắp xếp cho bộ lọc tin tức
 */
export const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'most_viewed', label: 'Xem nhiều nhất' },
    { value: 'featured', label: 'Nổi bật' },
];

/**
 * Danh sách menu cho sidebar admin
 *
 * Mỗi phần tử là một object đại diện cho một mục trong sidebar admin.
 * - name: Tên hiển thị của mục menu (string)
 * - icon: Tên icon (string, dùng để map sang component react-icons)
 * - path: Đường dẫn route (string)
 * - end: (optional) Nếu true, NavLink sẽ so khớp chính xác path này (dùng cho Dashboard)
 *
 * Sử dụng import { adminSidebarMenu } from 'src/config/constant';
 * Khi render, cần map icon string sang component thực tế (đã xử lý ở SectionSideBar.js).
 *
 * Ví dụ sử dụng:
 *   menu.map(item => <NavLink to={item.path}>{iconMap[item.icon]} {item.name}</NavLink>)
 */
export const adminSidebarMenu = [
    {
        name: "Dashboard",           // Trang tổng quan admin
        icon: "FaTachometerAlt",    // Icon bảng điều khiển
        path: "/admin",             // Đường dẫn
        end: true                    // So khớp chính xác path
    },
    {
        name: "Sản phẩm",           // Quản lý sản phẩm
        icon: "FaBox",
        path: "/admin/products"
    },
    {
        name: "Danh mục",           // Quản lý danh mục sản phẩm
        icon: "FaTags",
        path: "/admin/categories"
    },
    {
        name: "Đơn hàng",           // Quản lý đơn hàng
        icon: "FaClipboardList",
        path: "/admin/orders"
    },
    {
        name: "Người dùng",         // Quản lý người dùng
        icon: "FaUsers",
        path: "/admin/users"
    },
    {
        name: "Tin tức",            // Quản lý tin tức
        icon: "FaNewspaper",
        path: "/admin/news"
    },
    {
        name: "Điều hướng",         // Quản lý routes/permissions
        icon: "FaCompass",
        path: "/admin/permissions"
    },
    {
        name: "Phân quyền",         // Quản lý phân quyền
        icon: "FaKey",
        path: "/admin/roles-permission"
    }
];