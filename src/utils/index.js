/**
 * Utils index file - Main entry point for all utilities
 * 
 * File này export tất cả các utility functions từ các module khác nhau.
 * Sử dụng để import các hàm tiện ích một cách dễ dàng.
 */

// Export all auth utilities (bao gồm tất cả functions từ các module con)
export * from './auth.js';

// Default export from auth
export { default as auth } from './auth.js';

// Re-export commonly used functions for easier access
export { 
    getCookie, 
    setCookie, 
    removeCookie, 
    decodeBase64, 
    encodeBase64,
    getUserIdFromCookie,
    getUserProfile,
    isAuthenticated
} from './auth.js';

// Export format utilities
export * from './formatUtils.js';

// Export product utilities
export * from './productUtils.js';

// Export news utilities
export * from './newsUtils.js'; 