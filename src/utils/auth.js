/**
 * Utility functions for authentication and cookie management
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

// Hàm mã hóa Base64 cải thiện
export const encodeBase64 = (str) => {
    try {
        if (!str || typeof str !== 'string') {
            console.warn('Invalid input for encodeBase64:', str);
            return '';
        }

        // Method 1: Modern approach
        const encoded = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));

        // console.log('Encoded successfully:', str.substring(0, 50) + '...');
        return encoded;
    } catch (error) {
        console.error('Encode error:', error);

        // Fallback method
        try {
            return btoa(unescape(encodeURIComponent(str)));
        } catch (fallbackError) {
            console.error('Fallback encode failed:', fallbackError);
            return '';
        }
    }
};

// Hàm giải mã Base64 cải thiện
export const decodeBase64 = (str) => {
    try {
        if (!str || typeof str !== 'string') {
            console.warn('Invalid input for decodeBase64:', str);
            return null;
        }

        // Clean the string
        const cleanStr = str.trim().replace(/\s/g, '');

        if (cleanStr.length === 0) {
            console.warn('Empty string for decodeBase64');
            return null;
        }

        // Sử dụng một phương pháp duy nhất: atob + decodeURIComponent
        const decoded = atob(cleanStr);
        const result = decodeURIComponent(escape(decoded));
        
        // console.log('Decoded successfully');
        return result;
        
    } catch (error) {
        console.error('Decode error:', error);
        return null;
    }
};

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

// Hàm kiểm tra user đã login chưa
export const isAuthenticated = () => {
    try {
        // const token = getCookie('accessToken');
        const loginStatus = getLoginStatus();

        // const tokenValid = isTokenValid(token);
        const statusValid = loginStatus.isLoggedIn === true;

        // console.log('Authentication check:', {
        //     hasToken: !!token,
        //     tokenValid,
        //     hasLoginStatus: !!loginStatus,
        //     statusValid
        // });

        return  statusValid;
    } catch (error) {
        console.error('Authentication check error:', error);
        return false;
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

// Hàm logout - xóa tất cả cookies và redirect
export const logout = () => {
    try {
        // console.log('Logging out user...');

        // Clear all auth-related cookies
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('profile_user');
        removeCookie('login_status');
        removeCookie('login'); // legacy cookie

        // Clear localStorage
        clearAllUserData();

        // console.log('Logout completed, redirecting...');

        // Redirect về trang login với delay nhỏ
        setTimeout(() => {
            window.location.href = '/auth';
        }, 100);
    } catch (error) {
        console.error('Logout error:', error);
        // Force redirect even if there's an error
        window.location.href = '/auth';
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
        logout();
        throw error;
    }
};

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

// Hàm log hoạt động user
export const logUserActivity = (action, details = {}) => {
    try {
        const userProfile = getUserProfile();
        const activity = {
            userId: userProfile?.id || 'anonymous',
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            // console.log('User Activity:', activity);
        }

        // Save to localStorage for tracking
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        activities.push(activity);

        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.splice(0, activities.length - 100);
        }

        localStorage.setItem('userActivities', JSON.stringify(activities));

        return activity;
    } catch (error) {
        console.error('Failed to log activity:', error);
        return null;
    }
};

// Hàm clear tất cả user data
export const clearAllUserData = () => {
    try {
        // console.log('Clearing all user data...');

        // Clear cookies
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('profile_user');
        removeCookie('login_status');
        removeCookie('login');

        // Clear localStorage user-related data
        localStorage.removeItem('userActivities');
        localStorage.removeItem('userPreferences');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('searchHistory');
        localStorage.removeItem('viewedProducts');

        // Clear sessionStorage
        sessionStorage.clear();

        // console.log('User data cleared successfully');
    } catch (error) {
        console.error('Error clearing user data:', error);
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

// Hàm debug để test encode/decode
export const testEncodeDecode = (testString = 'Hello World! 123 àáâãèéêìíîòóôõùúûýđ') => {
    // console.log('=== Testing Encode/Decode ===');
    // console.log('Original string:', testString);

    const encoded = encodeBase64(testString);
    // console.log('Encoded:', encoded);

    const decoded = decodeBase64(encoded);
    // console.log('Decoded:', decoded);

    const isSuccess = decoded === testString;
    // console.log('Test result:', isSuccess ? '✅ SUCCESS' : '❌ FAILED');

    if (!isSuccess) {
        // console.log('Expected:', testString);
        // console.log('Got:', decoded);
    }

    return isSuccess;
};

// Hàm debug toàn bộ auth state
export const debugAuthState = () => {
    // console.log('=== Auth Debug Info ===');
    // console.log('All cookies:', document.cookie);
    // console.log('AccessToken:', getCookie('accessToken') ? 'Present' : 'Missing');
    // console.log('RefreshToken:', getCookie('refreshToken') ? 'Present' : 'Missing');
    // console.log('Profile:', getUserProfile());
    // console.log('Login Status:', getLoginStatus());
    // console.log('Is Authenticated:', isAuthenticated());
    // console.log('User Role:', getUserRole());
    // console.log('User Fullname:', getUserFullname());
    // console.log('========================');
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

// Export default object với tất cả functions
export default {
    getCookie,
    setCookie,
    removeCookie,
    encodeBase64,
    decodeBase64,
    isTokenValid,
    getUserProfile,
    getLoginStatus,
    isAuthenticated,
    saveUserProfile,
    saveLoginStatus,
    getUserId,
    getUserIdFromCookie,
    getUserRole,
    getUserFullname,
    logout,
    isTokenExpiringSoon,
    refreshAccessToken,
    hasPermission,
    logUserActivity,
    clearAllUserData,
    isSessionValid,
    testEncodeDecode,
    debugAuthState,
    checkIsAdmin,
    getUserFromCookie
};