/**
 * JWT Token utilities
 */

import { getCookie, setCookie } from './cookieUtils.js';

// Hàm kiểm tra accessToken còn hạn không (JWT)
export const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const payload = JSON.parse(atob(parts[1]));
        const isValid = payload.exp && payload.exp * 1000 > Date.now();

        if (!isValid) {
            // console.log('Token expired:', new Date(payload.exp * 1000));
        }

        return isValid;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};

// Hàm kiểm tra token sắp hết hạn (còn ít hơn 5 phút)
export const isTokenExpiringSoon = (token, minutesThreshold = 5) => {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const thresholdTime = minutesThreshold * 60 * 1000;

        const isExpiring = (expirationTime - currentTime) < thresholdTime;

        if (isExpiring) {
            // console.log('Token expiring soon:', new Date(expirationTime));
        }

        return isExpiring;
    } catch (error) {
        console.error('Token expiry check error:', error);
        return false;
    }
};

// Hàm refresh access token
export const refreshAccessToken = async (axiosClient) => {
    try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // console.log('Refreshing access token...');

        const response = await axiosClient.post('/auth/refresh', {
            refreshToken: refreshToken
        });

        const newAccessToken = response.data.accessToken || response.data.data?.accessToken;

        if (newAccessToken) {
            setCookie('accessToken', newAccessToken);
            // console.log('Access token refreshed successfully');
            return newAccessToken;
        } else {
            throw new Error('No access token in response');
        }
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error;
    }
}; 