/**
 * User management utilities
 */

import { getCookie, setCookie } from './cookieUtils.js';
import { encodeBase64, decodeBase64 } from './encodingUtils.js';

// Hàm lấy thông tin user profile từ cookie đã mã hóa
export const getUserProfile = () => {
    try {
        const encodedProfile = getCookie('profile_user');
        // console.log('Raw profile cookie:', encodedProfile ? 'Found' : 'Not found');

        if (!encodedProfile) return null;

        const decodedProfile = decodeBase64(encodedProfile);
        // console.log('Decoded profile:', decodedProfile ? 'Success' : 'Failed');

        if (!decodedProfile) return null;

        const profile = JSON.parse(decodedProfile);
        // console.log('Parsed profile:', profile);

        return profile;
    } catch (error) {
        console.error('Get user profile error:', error);
        return null;
    }
};

// Hàm lưu thông tin user profile đã mã hóa
export const saveUserProfile = (userProfile) => {
    try {
        if (!userProfile || typeof userProfile !== 'object') {
            console.error('Invalid user profile:', userProfile);
            return false;
        }

        const profileString = JSON.stringify(userProfile);
        const encodedProfile = encodeBase64(profileString);

        if (encodedProfile) {
            setCookie('profile_user', encodedProfile);
            // console.log('User profile saved successfully');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Save user profile error:', error);
        return false;
    }
};

// Hàm lấy userId từ profile
export const getUserId = () => {
    const profile = getUserProfile();
    return profile ? profile.id : null;
};

// Hàm lấy userId từ profile_user cookie (phiên bản cải tiến cho axios)
export const getUserIdFromCookie = () => {
    try {
        const encodedProfile = getCookie('profile_user');
        console.log('Raw encodedProfile from cookie:', encodedProfile);
        
        if (!encodedProfile) {
            console.log('No profile_user cookie found');
            return null;
        }

        // Decode URL encoding trước (vì cookie có thể bị encode 2 lần)
        const urlDecodedProfile = decodeURIComponent(encodedProfile);
        console.log('URL decoded profile:', urlDecodedProfile);

        // Sau đó decode Base64
        const decodedProfile = decodeBase64(urlDecodedProfile);
        console.log('Base64 decoded profile:', decodedProfile);
        
        if (!decodedProfile) {
            console.log('Failed to decode Base64 profile');
            return null;
        }

        // Parse JSON
        const profile = JSON.parse(decodedProfile);
        console.log('Parsed profile object:', profile);
        
        const userId = profile?.id || null;
        console.log('Extracted userId:', userId);
        
        return userId;
    } catch (error) {
        console.error('Error getting userId:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        return null;
    }
};

// Hàm lấy user role từ profile
export const getUserRole = () => {
    const profile = getUserProfile();
    return profile ? profile.role : null;
};

// Hàm lấy user fullname từ profile
export const getUserFullname = () => {
    const profile = getUserProfile();
    
    return profile ? (profile.fullname || profile.fullName || profile.name) : null;
};

// Decode base64 cookie and check if user is admin
export const checkIsAdmin = () => {
    try {
        const profile = getUserProfile();
        if (!profile) {
            console.log('No profile found');
            return false;
        }
        
        console.log('Profile found:', profile);
        console.log('User role:', profile.role);
        
        return profile.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

// Get user data from cookie
export const getUserFromCookie = () => {
    try {
        const profile = getUserProfile();
        return profile;
    } catch (error) {
        console.error('Error getting user from cookie:', error);
        return null;
    }
}; 