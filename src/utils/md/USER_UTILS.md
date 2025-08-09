# USERUTILS.md - Tiện ích thao tác người dùng

## 1. Tổng quan
Cung cấp các hàm tiện ích thao tác với thông tin user: lấy profile, id, role, kiểm tra admin, lưu thông tin user, lấy user từ cookie, v.v. Dùng cho các chức năng xác thực, phân quyền, hiển thị UI động.

## 2. Mục đích
- Lấy thông tin user từ cookie, localStorage hoặc token
- Kiểm tra vai trò, quyền hạn user (admin, user, guest...)
- Hỗ trợ các guard, component cần biết user hiện tại
- Lưu và cập nhật profile user

## 3. Các hàm chính & Giải thích

### getUserProfile()
- **Mô tả:** Lấy profile user từ localStorage/cookie
- **Trả về:** Object profile hoặc null
- **Ví dụ:**
  ```js
  const profile = getUserProfile();
  if (profile) alert(profile.fullName);
  ```

### saveUserProfile(profile)
- **Mô tả:** Lưu profile user vào localStorage/cookie
- **Tham số:** profile (object)
- **Ví dụ:**
  ```js
  saveUserProfile({ id: 1, fullName: 'Admin' });
  ```

### getUserId()
- **Mô tả:** Lấy userId hiện tại
- **Trả về:** string|number hoặc null

### getUserRole()
- **Mô tả:** Lấy vai trò user hiện tại (admin, user...)
- **Trả về:** string

### checkIsAdmin()
- **Mô tả:** Kiểm tra user hiện tại có phải admin không
- **Trả về:** boolean
- **Ví dụ:**
  ```js
  if (checkIsAdmin()) { /* show admin UI */ }
  ```

### getUserFromCookie(), getUserIdFromCookie()
- **Mô tả:** Lấy thông tin user từ cookie (dùng cho SSR hoặc khi không có localStorage)

## 4. Ví dụ sử dụng tổng hợp
```js
import { getUserProfile, checkIsAdmin } from '../utils/userUtils';
const profile = getUserProfile();
if (checkIsAdmin()) {
  // Hiển thị chức năng admin
}
```

## 5. Lưu ý & Cảnh báo
- Không nên lưu thông tin nhạy cảm ở localStorage/cookie (dễ bị đọc bởi JS khác)
- Nên xác thực lại với backend nếu cần bảo mật cao
- Khi logout nên xóa sạch thông tin user khỏi localStorage/cookie