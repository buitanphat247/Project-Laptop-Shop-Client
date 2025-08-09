# Axios Client - Giải thích chi tiết

## Tổng quan

File `src/config/axios.js` là một cấu hình axios client nâng cao với các tính năng authentication tự động. Đây là một pattern phổ biến trong React applications để xử lý JWT tokens.

## Cấu trúc file

### 1. Import và Cấu hình cơ bản

```javascript
import axios from 'axios';
import { getCookie, setCookie, decodeBase64, getUserIdFromCookie } from '../utils/auth';

const axiosClient = axios.create({
    baseURL: 'http://localhost:3030/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
```

**Giải thích:**
- `baseURL`: URL cơ sở cho tất cả API calls
- `Content-Type: application/json`: Định dạng dữ liệu gửi đi
- `withCredentials: true`: **QUAN TRỌNG** - Cho phép gửi cookies trong cross-origin requests

### 2. Request Interceptor

```javascript
axiosClient.interceptors.request.use(
    (config) => {
        const token = getCookie('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
```

**Mục đích:** Tự động thêm Authorization header vào mọi request
**Cách hoạt động:**
1. Trước khi gửi request, lấy access token từ cookie
2. Nếu có token, thêm vào header: `Authorization: Bearer <token>`
3. Nếu không có token, request vẫn được gửi (có thể là public API)

### 3. Biến quản lý trạng thái

```javascript
let isRefreshing = false;
let failedQueue = [];
```

**Giải thích:**
- `isRefreshing`: Đánh dấu đang trong quá trình refresh token
- `failedQueue`: Queue chứa các request bị fail trong khi refresh

### 4. Hàm xử lý queue

```javascript
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
```

**Mục đích:** Xử lý các request đồng thời bị 401/403
**Cách hoạt động:**
- Khi có nhiều request cùng lúc bị 401/403, chỉ request đầu tiên refresh token
- Các request còn lại được đưa vào queue
- Sau khi có token mới, tất cả request trong queue được resolve/reject

### 5. Response Interceptor (Phần quan trọng nhất)

#### 5.1 Điều kiện kiểm tra

```javascript
if (
    error.response &&
    (error.response.status === 401 || error.response.status === 403) &&
    !originalRequest._retry &&
    !originalRequest.url.includes('/auth/refresh-token')
) {
```

**Giải thích từng điều kiện:**
- `error.response`: Có response lỗi từ server
- `401 || 403`: Unauthorized hoặc Forbidden (token hết hạn)
- `!originalRequest._retry`: Chưa retry (tránh loop vô hạn)
- `!originalRequest.url.includes('/auth/refresh-token')`: Không phải request refresh token (tránh loop vô hạn)

#### 5.2 Xử lý queue nếu đang refresh

```javascript
if (isRefreshing) {
    return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
    }).then((token) => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return axiosClient(originalRequest);
    }).catch((err) => Promise.reject(err));
}
```

**Cách hoạt động:**
1. Nếu đang refresh token, đưa request vào queue
2. Tạo Promise mới để chờ token
3. Khi có token mới, thêm vào header và retry request

#### 5.3 Refresh token process

```javascript
try {
    const userId = getUserIdFromCookie();
    if (!userId) throw new Error('No userId found in profile');

    const res = await axios.post(
        'http://localhost:3030/api/v1/auth/refresh-token',
        { userId: userId },
        { withCredentials: true }
    );

    const { accessToken } = res.data.data;
    setCookie('accessToken', accessToken);
    axiosClient.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
    processQueue(null, accessToken);

    originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
    return axiosClient(originalRequest);
}
```

**Cách hoạt động:**
1. Lấy userId từ cookie (thay vì refresh token)
2. Gọi API refresh với userId
3. Lưu token mới vào cookie
4. Cập nhật header mặc định
5. Xử lý queue các request đang chờ
6. Retry request gốc với token mới

#### 5.4 Xử lý lỗi

```javascript
catch (err) {
    console.error('Token refresh failed with userId:', err);
    processQueue(err, null);

    setCookie('accessToken', '', -1);
    setCookie('profile_user', '', -1);
    setCookie('login_status', '', -1);

    window.location.href = '/auth';
    return Promise.reject(err);
} finally {
    isRefreshing = false;
}
```

**Cách hoạt động:**
1. Reject tất cả request trong queue
2. Xóa tất cả cookies liên quan đến auth
3. Redirect về trang login
4. Reset trạng thái isRefreshing

## Luồng hoạt động tổng thể

### Scenario 1: Request thành công
1. Request được gửi với Authorization header
2. Server trả về response thành công
3. Response được trả về cho component

### Scenario 2: Token hết hạn (401/403)
1. Request được gửi với token cũ
2. Server trả về 401/403
3. Axios interceptor bắt lỗi
4. Kiểm tra điều kiện refresh token
5. Lấy userId từ cookie
6. Gọi API refresh token với userId
7. Lưu token mới vào cookie
8. Retry request gốc với token mới
9. Trả về response thành công

### Scenario 3: Nhiều request đồng thời bị 401
1. Request A bị 401 → Bắt đầu refresh token
2. Request B bị 401 → Đưa vào queue
3. Request C bị 401 → Đưa vào queue
4. Refresh token thành công
5. Xử lý queue: tất cả request được retry với token mới

### Scenario 4: Refresh token thất bại
1. Request bị 401
2. Thử refresh token
3. Refresh thất bại
4. Xóa tất cả cookies
5. Redirect về trang login

## Lợi ích của cách tiếp cận này

1. **Tự động hóa**: Không cần xử lý token thủ công trong mỗi component
2. **Xử lý đồng thời**: Queue system xử lý multiple requests
3. **Bảo mật**: Tự động logout khi refresh thất bại
4. **UX tốt**: User không bị gián đoạn khi token hết hạn
5. **Maintainable**: Logic tập trung ở một nơi

## Lưu ý quan trọng

1. **withCredentials: true** - Cần thiết để gửi cookies
2. **Tránh loop vô hạn** - Kiểm tra `_retry` và URL refresh
3. **Queue management** - Xử lý multiple requests đồng thời
4. **Error handling** - Luôn reset `isRefreshing` trong finally
5. **Cookie management** - Xóa cookies khi logout

## Cách sử dụng

```javascript
// Import axios client
import axiosClient from '../config/axios';

// Sử dụng như axios bình thường
const response = await axiosClient.get('/users');
const response = await axiosClient.post('/users', userData);
```

Tất cả authentication logic sẽ được xử lý tự động! 