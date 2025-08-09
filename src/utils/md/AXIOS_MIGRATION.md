# Axios Migration to Utils

## Tổng quan

Đã tách các hàm từ file `src/config/axios.js` vào thư mục `src/utils/` để tái sử dụng và tổ chức code tốt hơn.

## Các hàm đã được tách

### 1. Từ `axios.js` → `utils/auth.js`

| Hàm trong axios.js | Hàm trong utils | Mô tả |
|-------------------|-----------------|-------|
| `getCookie(name)` | `getCookie(name)` | Lấy giá trị cookie theo tên |
| `setCookie(name, value, days)` | `setCookie(name, value, days)` | Set cookie với thời gian hết hạn |
| `decodeBase64(str)` | `decodeBase64(str)` | Giải mã Base64 |
| `getUserId()` | `getUserIdFromCookie()` | Lấy userId từ profile_user cookie (phiên bản cải tiến) |

## Thay đổi trong axios.js

### Import statements
```javascript
// Trước
import axios from 'axios';

function getCookie(name) { ... }
function setCookie(name, value, days = 1) { ... }
function decodeBase64(str) { ... }
function getUserId() { ... }

// Sau
import axios from 'axios';
import { getCookie, setCookie, decodeBase64, getUserIdFromCookie } from '../utils/auth';
```

### Sử dụng hàm
```javascript
// Trước
const userId = getUserId();

// Sau
const userId = getUserIdFromCookie();
```

## Lợi ích

1. **Tái sử dụng**: Các hàm có thể được sử dụng ở nhiều nơi khác trong dự án
2. **Tổ chức code**: Logic được tập trung vào thư mục utils
3. **Dễ bảo trì**: Chỉ cần sửa ở một nơi khi có thay đổi
4. **Test**: Dễ dàng viết test cho từng hàm riêng biệt
5. **Consistency**: Đảm bảo logic xử lý cookie và encoding nhất quán

## Cách sử dụng

### Import từ utils
```javascript
// Import tất cả
import { getCookie, setCookie, decodeBase64, getUserIdFromCookie } from '../utils/auth';

// Import từng module cụ thể
import { getCookie, setCookie } from '../utils/cookieUtils';
import { decodeBase64 } from '../utils/encodingUtils';
import { getUserIdFromCookie } from '../utils/userUtils';
```

### Sử dụng trong code
```javascript
// Lấy cookie
const token = getCookie('accessToken');

// Set cookie
setCookie('accessToken', newToken, 7);

// Decode Base64
const decoded = decodeBase64(encodedString);

// Lấy userId từ cookie
const userId = getUserIdFromCookie();
```

## Backward Compatibility

- Tất cả các hàm vẫn hoạt động như cũ
- Logic không thay đổi, chỉ tổ chức lại cấu trúc
- Không cần thay đổi code ở các file khác

## Files đã được cập nhật

1. `src/config/axios.js` - Import từ utils thay vì định nghĩa local
2. `src/utils/auth.js` - Thêm hàm `getUserIdFromCookie`
3. `src/utils/userUtils.js` - Thêm hàm `getUserIdFromCookie`
4. `src/utils/index.js` - Export các hàm thường dùng
5. `src/utils/README.md` - Cập nhật tài liệu
6. `src/utils/AXIOS_MIGRATION.md` - Tài liệu này 