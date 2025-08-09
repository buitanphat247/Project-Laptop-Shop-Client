/**
 * Session management utilities
 */

import { getCookie, setCookie } from './cookieUtils.js';
import { encodeBase64, decodeBase64 } from './encodingUtils.js';

// Hàm lấy trạng thái login từ cookie đã mã hóa
export const getLoginStatus = () => {
    try {
        const encodedStatus = getCookie('login_status');
        // console.log('Raw login_status cookie:', encodedStatus ? 'Found' : 'Not found');

        if (!encodedStatus) return null;

        const decodedStatus = decodeBase64(encodedStatus);
        // console.log('Decoded login_status:', decodedStatus ? 'Success' : 'Failed');

        if (!decodedStatus) return null;

        const loginStatus = JSON.parse(decodedStatus);
        // console.log('Parsed login_status:', loginStatus);

        return loginStatus;
    } catch (error) {
        console.error('Get login status error:', error);
        return null;
    }
};

// Hàm lưu trạng thái login đã mã hóa
export const saveLoginStatus = (userRole) => {
    try {
        const loginStatus = {
            isLoggedIn: true,
            loginTime: new Date().toISOString(),
            sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            userRole: userRole,
            lastActivity: new Date().toISOString()
        };

        const statusString = JSON.stringify(loginStatus);
        const encodedLoginStatus = encodeBase64(statusString);

        if (encodedLoginStatus) {
            setCookie('login_status', encodedLoginStatus);
            // console.log('Login status saved successfully');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Save login status error:', error);
        return false;
    }
};

// Hàm kiểm tra session hợp lệ
export const isSessionValid = () => {
    try {
        const loginStatus = getLoginStatus();
        if (!loginStatus) return false;

        // Kiểm tra session không quá 24 giờ
        const loginTime = new Date(loginStatus.loginTime).getTime();
        const currentTime = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

        const isValid = (currentTime - loginTime) < sessionDuration;

        if (!isValid) {
            // console.log('Session expired');
        }

        return isValid;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
};

// Hàm cập nhật thời gian hoạt động cuối cùng
export const updateLastActivity = () => {
    try {
        const loginStatus = getLoginStatus();
        if (loginStatus) {
            loginStatus.lastActivity = new Date().toISOString();
            const statusString = JSON.stringify(loginStatus);
            const encodedLoginStatus = encodeBase64(statusString);
            
            if (encodedLoginStatus) {
                setCookie('login_status', encodedLoginStatus);
            }
        }
    } catch (error) {
        console.error('Update last activity error:', error);
    }
}; 