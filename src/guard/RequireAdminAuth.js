/**
 * RequireAdminAuth - Route Guard Component
 * 
 * Component này bảo vệ các route chỉ dành cho admin.
 * Nó kiểm tra:
 * 1. User đã đăng nhập chưa
 * 2. User có role admin không
 * 3. Log hoạt động truy cập
 * 
 * Cách sử dụng:
 * <RequireAdminAuth>
 *   <AdminDashboard />
 * </RequireAdminAuth>
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
// Import các utility functions từ auth utils
import { isAuthenticated, getUserRole, logUserActivity } from '../utils/auth';

/**
 * RequireAdminAuth Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Components con cần được bảo vệ
 * @returns {React.ReactNode} - Component con nếu có quyền, hoặc redirect component
 */
const RequireAdminAuth = ({ children }) => {
    /**
     * Bước 1: Kiểm tra trạng thái đăng nhập
     * 
     * isAuthenticated() sẽ kiểm tra:
     * - Có access token không
     * - Token còn hạn không
     * - Có login status trong cookie không
     */
    const isLoggedIn = isAuthenticated();
    
    /**
     * Bước 2: Lấy role của user từ cookie
     * 
     * getUserRole() sẽ:
     * - Lấy profile user từ cookie
     * - Decode Base64 profile
     * - Trả về role của user
     */
    const userRole = getUserRole();
    
    // Debug log để theo dõi quá trình kiểm tra
    console.log('RequireAdminAuth check:', {
        isLoggedIn,        // true/false - user đã đăng nhập chưa
        userRole,          // 'admin', 'user', 'guest', null
        isAdmin: userRole === 'admin'  // true/false - có phải admin không
    });

    /**
     * Bước 3: Kiểm tra đăng nhập
     * 
     * Nếu user chưa đăng nhập:
     * - Log hoạt động access denied
     * - Redirect về trang auth để đăng nhập
     */
    if (!isLoggedIn) {
        console.log('❌ User not authenticated, redirecting to auth');
        
        // Log hoạt động để theo dõi bảo mật
        logUserActivity('admin_access_denied', { 
            reason: 'not_authenticated',  // Lý do: chưa đăng nhập
            timestamp: new Date().toISOString()
        });
        
        // Redirect về trang auth với replace=true (không lưu vào history)
        return <Navigate to="/auth" replace />;
    }

    /**
     * Bước 4: Kiểm tra quyền admin
     * 
     * Nếu user đã đăng nhập nhưng không phải admin:
     * - Log hoạt động access denied với lý do insufficient_permissions
     * - Redirect về trang chủ
     * - Có thể hiển thị toast warning (đã comment)
     */
    if (userRole !== 'admin') {
        console.log('❌ User is not admin, redirecting to home');
        
        // Log hoạt động với thông tin chi tiết
        logUserActivity('admin_access_denied', { 
            reason: 'insufficient_permissions',  // Lý do: không đủ quyền
            userRole: userRole,                  // Role hiện tại của user
            timestamp: new Date().toISOString()
        });
        
        // Có thể hiển thị toast warning để thông báo cho user
        // toast.warning('Bạn không có quyền truy cập trang này!');
        
        // Redirect về trang chủ với replace=true
        return <Navigate to="/" replace />;
    }

    /**
     * Bước 5: Cho phép truy cập
     * 
     * Nếu user đã đăng nhập và có role admin:
     * - Log hoạt động access granted
     * - Render component con (children)
     */
    console.log('✅ Admin access granted');
    
    // Log hoạt động thành công
    logUserActivity('admin_access_granted', { 
        userRole,
        timestamp: new Date().toISOString()
    });
    
    // Render component con được bảo vệ
    return children;
};

export default RequireAdminAuth;