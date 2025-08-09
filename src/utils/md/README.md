# Utils Directory

Thư mục `utils` chứa các hàm tiện ích dùng chung trong toàn bộ dự án. Các hàm này được tổ chức theo chức năng để dễ bảo trì và mở rộng.

## Cấu trúc thư mục

```
src/utils/
├── index.js              # Entry point chính, export tất cả utilities
├── auth.js               # File chính export tất cả auth utilities
├── cookieUtils.js        # Quản lý cookie
├── encodingUtils.js      # Mã hóa/giải mã Base64
├── tokenUtils.js         # Xử lý JWT token
├── userUtils.js          # Quản lý thông tin user
├── permissionUtils.js    # Kiểm tra quyền truy cập
├── sessionUtils.js       # Quản lý session
├── activityUtils.js      # Log hoạt động user
└── README.md            # Tài liệu này
```

## Cách sử dụng

### Import tất cả utilities
```javascript
import { getCookie, isAuthenticated, getUserProfile } from '../utils';
// hoặc
import auth from '../utils/auth';
```

### Import từng module cụ thể
```javascript
import { getCookie, setCookie } from '../utils/cookieUtils';
import { encodeBase64, decodeBase64 } from '../utils/encodingUtils';
import { isTokenValid } from '../utils/tokenUtils';
```

## Chi tiết từng module

### 1. cookieUtils.js
Quản lý cookie trong trình duyệt:
- `getCookie(name)` - Lấy giá trị cookie
- `setCookie(name, value, days)` - Set cookie với thời gian hết hạn
- `removeCookie(name)` - Xóa cookie
- `clearAuthCookies()` - Xóa tất cả cookies liên quan đến auth

### 2. encodingUtils.js
Mã hóa và giải mã dữ liệu:
- `encodeBase64(str)` - Mã hóa chuỗi thành Base64
- `decodeBase64(str)` - Giải mã Base64 thành chuỗi
- `testEncodeDecode(str)` - Test encode/decode

### 3. tokenUtils.js
Xử lý JWT token:
- `isTokenValid(token)` - Kiểm tra token còn hạn không
- `isTokenExpiringSoon(token, minutes)` - Kiểm tra token sắp hết hạn
- `refreshAccessToken(axiosClient)` - Refresh access token

### 4. userUtils.js
Quản lý thông tin user:
- `getUserProfile()` - Lấy profile user từ cookie
- `saveUserProfile(profile)` - Lưu profile user vào cookie
- `getUserId()` - Lấy ID user
- `getUserIdFromCookie()` - Lấy ID user từ cookie (phiên bản cải tiến cho axios)
- `getUserRole()` - Lấy role user
- `getUserFullname()` - Lấy tên đầy đủ user
- `checkIsAdmin()` - Kiểm tra user có phải admin không
- `getUserFromCookie()` - Lấy user data từ cookie

### 5. permissionUtils.js
Kiểm tra quyền truy cập:
- `hasPermission(requiredRole)` - Kiểm tra quyền truy cập
- `isAdmin()` - Kiểm tra user có phải admin không
- `isSuperAdmin()` - Kiểm tra user có phải super admin không
- `isManager()` - Kiểm tra user có phải manager không
- `isRegularUser()` - Kiểm tra user có phải user thường không
- `isGuest()` - Kiểm tra user có phải guest không

### 6. sessionUtils.js
Quản lý session:
- `getLoginStatus()` - Lấy trạng thái login
- `saveLoginStatus(userRole)` - Lưu trạng thái login
- `isSessionValid()` - Kiểm tra session hợp lệ
- `updateLastActivity()` - Cập nhật thời gian hoạt động cuối

### 7. activityUtils.js
Log hoạt động user:
- `logUserActivity(action, details)` - Log hoạt động user
- `getUserActivities()` - Lấy danh sách hoạt động
- `clearUserActivities()` - Xóa tất cả hoạt động
- `getActivitiesByDateRange(start, end)` - Lọc hoạt động theo thời gian
- `getActivitiesByAction(action)` - Lọc hoạt động theo action

### 8. auth.js
File chính export tất cả auth utilities:
- `isAuthenticated()` - Kiểm tra user đã login chưa
- `logout()` - Đăng xuất và redirect
- `clearAllUserData()` - Xóa tất cả user data
- `debugAuthState()` - Debug trạng thái auth

## Lợi ích của cấu trúc mới

1. **Tách biệt chức năng**: Mỗi module có trách nhiệm riêng biệt
2. **Dễ bảo trì**: Code được tổ chức rõ ràng, dễ tìm và sửa
3. **Tái sử dụng**: Có thể import từng module cụ thể khi cần
4. **Mở rộng**: Dễ dàng thêm module mới hoặc chức năng mới
5. **Test**: Dễ dàng viết test cho từng module riêng biệt
6. **Performance**: Chỉ import những gì cần thiết

## Migration từ code cũ

Code cũ vẫn hoạt động bình thường vì tất cả các hàm đều được export từ `auth.js` và `index.js`. Không cần thay đổi import statements trong các file khác. 