# Conflict Exports Fix

## Vấn đề

Khi tách các hàm từ `CardProduct.js` sang `utils`, chúng ta gặp lỗi conflict exports:

```
ERROR in ./src/utils/index.js 12:0-35
The requested module './encodingUtils.js' contains conflicting star exports for the name 'testEncodeDecode' with the previous requested module './auth.js'
```

## Nguyên nhân

### Trước khi sửa:
```javascript
// src/utils/index.js
export * from './auth.js';           // Export tất cả từ auth.js
export * from './encodingUtils.js';  // Export tất cả từ encodingUtils.js
export * from './tokenUtils.js';     // Export tất cả từ tokenUtils.js
// ... các export khác
```

**Vấn đề:** File `auth.js` chứa tất cả các hàm trực tiếp, và các file module con cũng chứa các hàm tương tự, gây ra conflict khi export `*`.

### Cấu trúc cũ:
```
src/utils/
├── auth.js           # Chứa tất cả functions trực tiếp
├── cookieUtils.js    # Chứa getCookie, setCookie, removeCookie
├── encodingUtils.js  # Chứa encodeBase64, decodeBase64, testEncodeDecode
├── tokenUtils.js     # Chứa isTokenValid, isTokenExpiringSoon, refreshAccessToken
├── userUtils.js      # Chứa getUserProfile, saveUserProfile, v.v.
├── permissionUtils.js # Chứa hasPermission, isAdmin, v.v.
├── sessionUtils.js   # Chứa getLoginStatus, saveLoginStatus, v.v.
├── activityUtils.js  # Chứa logUserActivity, v.v.
└── index.js          # Export * từ tất cả files
```

## Giải pháp

### 1. Sửa file `auth.js`

**Trước:**
```javascript
// src/utils/auth.js
export const getCookie = (name) => { /* ... */ };
export const setCookie = (name, value, days = 1) => { /* ... */ };
export const removeCookie = (name) => { /* ... */ };
export const encodeBase64 = (str) => { /* ... */ };
export const decodeBase64 = (str) => { /* ... */ };
// ... tất cả các hàm khác
```

**Sau:**
```javascript
// src/utils/auth.js
// Re-export từ cookieUtils
export { getCookie, setCookie, removeCookie, clearAuthCookies } from './cookieUtils.js';

// Re-export từ encodingUtils
export { encodeBase64, decodeBase64, testEncodeDecode } from './encodingUtils.js';

// Re-export từ tokenUtils
export { isTokenValid, isTokenExpiringSoon, refreshAccessToken } from './tokenUtils.js';

// Re-export từ userUtils
export { 
    getUserProfile, 
    saveUserProfile, 
    getUserId, 
    getUserRole, 
    getUserFullname, 
    checkIsAdmin, 
    getUserFromCookie,
    getUserIdFromCookie
} from './userUtils.js';

// Re-export từ permissionUtils
export { hasPermission, isAdmin, isSuperAdmin, isManager, isRegularUser, isGuest } from './permissionUtils.js';

// Re-export từ sessionUtils
export { getLoginStatus, saveLoginStatus, isSessionValid, updateLastActivity } from './sessionUtils.js';

// Re-export từ activityUtils
export { 
    logUserActivity, 
    getUserActivities, 
    clearUserActivities, 
    getActivitiesByDateRange, 
    getActivitiesByAction 
} from './activityUtils.js';

// Chỉ giữ lại các hàm chính trong auth.js
export const isAuthenticated = () => { /* ... */ };
export const logout = () => { /* ... */ };
export const clearAllUserData = () => { /* ... */ };
export const debugAuthState = () => { /* ... */ };
```

### 2. Sửa file `index.js`

**Trước:**
```javascript
// src/utils/index.js
export * from './auth.js';
export * from './cookieUtils.js';      // ❌ Conflict
export * from './encodingUtils.js';    // ❌ Conflict
export * from './tokenUtils.js';       // ❌ Conflict
export * from './userUtils.js';        // ❌ Conflict
export * from './permissionUtils.js';  // ❌ Conflict
export * from './sessionUtils.js';     // ❌ Conflict
export * from './activityUtils.js';    // ❌ Conflict
export * from './formatUtils.js';
export * from './productUtils.js';
```

**Sau:**
```javascript
// src/utils/index.js
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
```

## Cấu trúc mới

```
src/utils/
├── auth.js           # Re-export từ các module con + các hàm chính
├── cookieUtils.js    # getCookie, setCookie, removeCookie, clearAuthCookies
├── encodingUtils.js  # encodeBase64, decodeBase64, testEncodeDecode
├── tokenUtils.js     # isTokenValid, isTokenExpiringSoon, refreshAccessToken
├── userUtils.js      # getUserProfile, saveUserProfile, getUserId, v.v.
├── permissionUtils.js # hasPermission, isAdmin, isSuperAdmin, v.v.
├── sessionUtils.js   # getLoginStatus, saveLoginStatus, isSessionValid, v.v.
├── activityUtils.js  # logUserActivity, getUserActivities, v.v.
├── formatUtils.js    # formatPrice, formatNumber, formatDate, v.v.
├── productUtils.js   # getStockStatus, generateProductUrl, v.v.
└── index.js          # Export * từ auth.js + formatUtils + productUtils
```

## Lợi ích của giải pháp

### 1. **Tránh Conflict**
- Không có duplicate exports
- Mỗi hàm chỉ được định nghĩa một lần
- Import/export rõ ràng

### 2. **Backward Compatibility**
```javascript
// Vẫn hoạt động như cũ
import { getCookie, setCookie, isAuthenticated } from '../utils/auth';
import { formatPrice, getStockStatus } from '../utils';
```

### 3. **Modular Structure**
```javascript
// Có thể import từ module cụ thể nếu cần
import { getCookie } from '../utils/cookieUtils';
import { formatPrice } from '../utils/formatUtils';
```

### 4. **Easy Maintenance**
```javascript
// Chỉ cần sửa trong file module cụ thể
// src/utils/formatUtils.js
export const formatPrice = (price, currency = 'VND', locale = 'vi-VN') => {
    // Logic mới ở đây
};
```

## Cách sử dụng

### 1. Import từ utils chính
```javascript
import { formatPrice, getStockStatus, generateProductUrl } from '../../utils';
```

### 2. Import từ auth
```javascript
import { getCookie, setCookie, isAuthenticated } from '../../utils/auth';
```

### 3. Import từ module cụ thể
```javascript
import { formatPrice } from '../../utils/formatUtils';
import { getStockStatus } from '../../utils/productUtils';
```

## Kiểm tra sau khi sửa

### 1. Build thành công
```bash
npm run build
# Không có lỗi conflict exports
```

### 2. Import hoạt động
```javascript
// Trong CardProduct.js
import { formatPrice, getStockStatus, generateProductUrl } from "../../utils";
// ✅ Hoạt động bình thường
```

### 3. Backward compatibility
```javascript
// Trong các file cũ
import { getCookie, isAuthenticated } from '../utils/auth';
// ✅ Vẫn hoạt động
```

## Best Practices

### 1. Import từ utils chính
```javascript
// ✅ Tốt
import { formatPrice, getStockStatus } from '../../utils';

// ❌ Không tốt (trừ khi cần thiết)
import { formatPrice } from '../../utils/formatUtils';
```

### 2. Sử dụng JSDoc
```javascript
/**
 * Format giá tiền theo định dạng VND
 * @param {number|string} price - Giá tiền cần format
 * @returns {string} - Giá tiền đã được format
 */
export const formatPrice = (price) => {
    // ...
};
```

### 3. Default parameters
```javascript
export const generateProductUrl = (productId, basePath = '/product') => {
    const id = productId || '1354';
    return `${basePath}/${id}`;
};
```

## Kết luận

Việc sửa lỗi conflict exports đã:

1. **Giải quyết lỗi build** - Không còn conflict exports
2. **Duy trì backward compatibility** - Code cũ vẫn hoạt động
3. **Cải thiện cấu trúc** - Modular và dễ maintain
4. **Tăng tính linh hoạt** - Có thể import từ nhiều nguồn khác nhau

**Lưu ý:** Luôn import từ `utils` chính thay vì từ các module cụ thể để đảm bảo tính nhất quán. 