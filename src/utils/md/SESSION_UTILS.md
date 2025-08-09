# SESSIONUTILS.md - Quản lý phiên đăng nhập

## 1. Tổng quan
Cung cấp các hàm tiện ích quản lý trạng thái đăng nhập, session, hoạt động gần nhất của user. Dùng để kiểm soát thời gian hoạt động, tự động logout khi hết hạn.

## 2. Mục đích
- Lưu trạng thái đăng nhập, kiểm tra session còn hiệu lực
- Hỗ trợ tự động logout khi hết hạn hoặc không hoạt động
- Cảnh báo user khi sắp hết phiên

## 3. Các hàm chính & Giải thích

### getLoginStatus()
- **Mô tả:** Lấy trạng thái đăng nhập hiện tại (true/false)
- **Trả về:** boolean

### saveLoginStatus(status)
- **Mô tả:** Lưu trạng thái đăng nhập (true/false)
- **Tham số:** status (boolean)

### isSessionValid()
- **Mô tả:** Kiểm tra session còn hiệu lực (dựa vào thời gian hoạt động cuối)
- **Trả về:** boolean
- **Ví dụ:**
  ```js
  if (!isSessionValid()) logout();
  ```

### updateLastActivity()
- **Mô tả:** Cập nhật timestamp hoạt động cuối của user

## 4. Ví dụ sử dụng tổng hợp
```js
import { getLoginStatus, isSessionValid, updateLastActivity } from '../utils/sessionUtils';
if (!isSessionValid()) {
  // logout user
}
updateLastActivity();
```

## 5. Lưu ý & Cảnh báo
- Nên kết hợp với backend để kiểm tra session thực sự
- Đặt timeout tự động logout nếu user không hoạt động
- Không lưu thông tin nhạy cảm trong session phía client