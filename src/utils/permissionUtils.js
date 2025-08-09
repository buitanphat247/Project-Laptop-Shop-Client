/**
 * Permission management utilities
 */

import { getUserRole } from './userUtils.js';

// Hàm kiểm tra quyền truy cập dựa trên role
export const hasPermission = (requiredRole) => {
    const userRole = getUserRole();
    if (!userRole) return false;

    // Định nghĩa hierarchy của roles
    const roleHierarchy = {
        'super_admin': 4,
        'admin': 3,
        'manager': 2,
        'user': 1,
        'guest': 0
    };

    const userLevel = roleHierarchy[userRole.toLowerCase()] || 0;
    const requiredLevel = roleHierarchy[requiredRole.toLowerCase()] || 0;

    return userLevel >= requiredLevel;
};

// Hàm kiểm tra user có phải là admin không
export const isAdmin = () => {
    return hasPermission('admin');
};

// Hàm kiểm tra user có phải là super admin không
export const isSuperAdmin = () => {
    return hasPermission('super_admin');
};

// Hàm kiểm tra user có phải là manager không
export const isManager = () => {
    return hasPermission('manager');
};

// Hàm kiểm tra user có phải là user thường không
export const isRegularUser = () => {
    const userRole = getUserRole();
    return userRole === 'user';
};

// Hàm kiểm tra user có phải là guest không
export const isGuest = () => {
    const userRole = getUserRole();
    return !userRole || userRole === 'guest';
}; 