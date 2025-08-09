# cookieUtils.js - Tiện ích cookie

## Tổng quan
Cung cấp các hàm thao tác với cookie: lấy, đặt, xóa, clear cookie xác thực.

## Mục đích
- Đọc/ghi/xóa cookie cho xác thực, lưu trạng thái user
- Hỗ trợ các thao tác bảo mật liên quan đến cookie

## Các hàm chính
- `getCookie(name)`: Lấy giá trị cookie theo tên
- `setCookie(name, value, options)`: Đặt cookie
- `removeCookie(name)`: Xóa cookie
- `clearAuthCookies()`: Xóa toàn bộ cookie xác thực

## Ví dụ sử dụng
```js
import { getCookie, setCookie } from '../utils/cookieUtils';

setCookie('accessToken', 'abc123');
const token = getCookie('accessToken');
```

## Lưu ý
- Không nên lưu thông tin nhạy cảm (mật khẩu, dữ liệu cá nhân) ở cookie dạng plain text.
- Nên đặt thuộc tính HttpOnly, Secure nếu lưu trên server.