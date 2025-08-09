/**
 * AdminLayout - Layout Component cho Admin Dashboard
 * 
 * Component này tạo layout chung cho tất cả trang admin.
 * Nó bao gồm:
 * - Sidebar cố định bên trái với navigation menu
 * - Content area bên phải để hiển thị nội dung
 * - Responsive design với Tailwind CSS
 * 
 * Cách sử dụng:
 * <Route path="/admin/*" element={<AdminLayout />}>
 *   <Route path="dashboard" element={<Dashboard />} />
 *   <Route path="users" element={<UserManager />} />
 * </Route>
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
// Import sidebar component cho admin
import SectionSideBar from '../components/section/SectionSideBar';

/**
 * AdminLayout Component
 * 
 * Layout component tạo cấu trúc chung cho admin dashboard.
 * Sử dụng flexbox để tạo layout 2 cột: sidebar + content.
 * 
 * @returns {JSX.Element} - Layout component với sidebar và content area
 */
const AdminLayout = () => {
    return (
        <div className="min-h-screen flex">
            {/*
             * Container chính - sử dụng flexbox
             * 
             * Classes:
             * - min-h-screen: Chiều cao tối thiểu = 100vh
             * - flex: Sử dụng flexbox layout
             */}
            {/*
             * Sidebar cố định bên trái
             * 
             * Classes:
             * - fixed: Cố định vị trí, không scroll theo content
             * - top-0 left-0: Đặt ở góc trên bên trái
             * - h-screen: Chiều cao = 100vh
             * - z-30: Z-index cao để đảm bảo hiển thị trên content
             */}
            <div className="fixed top-0 left-0 h-screen z-30">
                {/*
                 * SectionSideBar component
                 * 
                 * Component này chứa:
                 * - Logo/brand
                 * - Navigation menu cho admin
                 * - User profile section
                 * - Logout button
                 * - Responsive toggle cho mobile
                 */}
                <SectionSideBar />
            </div>
            
            {/*
             * Nội dung chính bên phải
             * 
             * Classes:
             * - flex-1: Chiếm hết không gian còn lại
             * - bg-gray-100: Background màu xám nhạt
             * - p-6: Padding 24px (1.5rem)
             * - ml-[240px]: Margin-left 240px để tránh bị che bởi sidebar
             * 
             * Lưu ý: 240px là chiều rộng của sidebar
             */}
            <div className="flex-1 bg-gray-100 p-6 ml-[240px]">
                {/*
                 * Có thể thêm AdminHeader component ở đây
                 * để hiển thị breadcrumb, user info, notifications
                 * 
                 * Ví dụ:
                 * <AdminHeader />
                 */}
                
                {/*
                 * Outlet component từ React Router
                 * 
                 * Outlet sẽ render component con tương ứng với route hiện tại.
                 * Ví dụ:
                 * - /admin/dashboard - render Dashboard component
                 * - /admin/users - render UserManager component
                 * - /admin/products - render ProductManager component
                 */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;