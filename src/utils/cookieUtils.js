/**
 * Cookie management utilities
 */

// Hàm lấy giá trị cookie theo tên
export const getCookie = (name) => {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop().split(';').shift();
            return decodeURIComponent(cookieValue);
        }
        return '';
    } catch (error) {
        console.error('Error getting cookie:', name, error);
        return '';
    }
};

// Hàm set cookie với thời gian hết hạn
export const setCookie = (name, value, days = 1) => {
    try {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
        // console.log(`Cookie set: ${name}`);
    } catch (error) {
        console.error('Error setting cookie:', name, error);
    }
};

// Hàm xóa cookie
export const removeCookie = (name) => {
    try {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
        // console.log(`Cookie removed: ${name}`);
    } catch (error) {
        console.error('Error removing cookie:', name, error);
    }
};

// Hàm xóa tất cả cookies liên quan đến auth
export const clearAuthCookies = () => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('profile_user');
    removeCookie('login_status');
    removeCookie('login'); // legacy cookie
}; 