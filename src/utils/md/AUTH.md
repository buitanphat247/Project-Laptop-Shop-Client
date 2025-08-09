# auth.js - Xác thực người dùng

## Tổng quan
Cung cấp các hàm tiện ích liên quan đến xác thực (authentication), kiểm tra trạng thái đăng nhập, đăng xuất, và quản lý token/cookie.

## Mục đích
- Kiểm tra trạng thái đăng nhập
- Đăng xuất và xóa dữ liệu user
- Quản lý token, cookie liên quan đến xác thực

## Các hàm chính
- `isAuthenticated()`: Kiểm tra user đã đăng nhập chưa
- `logout()`: Đăng xuất user, xóa token/cookie
- `clearAllUserData()`: Xóa toàn bộ dữ liệu xác thực
- `debugAuthState()`: In ra trạng thái xác thực hiện tại

## Ví dụ sử dụng
```js
import { isAuthenticated, logout } from '../utils/auth';

if (!isAuthenticated()) {
  // redirect to login
}
logout();
```

## Lưu ý
- Nên kết hợp với các guard (RequireAuth, RequireAdminAuth) để bảo vệ route.
- Không lưu thông tin nhạy cảm ở localStorage.