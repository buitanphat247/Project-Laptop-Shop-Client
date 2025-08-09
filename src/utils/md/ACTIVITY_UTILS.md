# ACTIVITYUTILS.md - Quản lý hoạt động người dùng

## 1. Tổng quan
Cung cấp các hàm tiện ích để ghi nhận, truy xuất và quản lý hoạt động của người dùng trong ứng dụng (audit log, lịch sử thao tác).

## 2. Mục đích
- Ghi lại các hành động quan trọng của user (login, logout, thao tác CRUD...)
- Hỗ trợ kiểm tra lịch sử hoạt động, phân tích hành vi
- Dễ dàng mở rộng cho audit log, bảo mật

## 3. Các hàm chính & Giải thích

### logUserActivity(action, details)
- **Mô tả:** Ghi lại một hoạt động mới của user
- **Tham số:** action (string), details (object)
- **Ví dụ:**
  ```js
  logUserActivity('LOGIN', { userId: 123 });
  ```

### getUserActivities(userId)
- **Mô tả:** Lấy danh sách hoạt động của user
- **Trả về:** Array hoạt động

### clearUserActivities(userId)
- **Mô tả:** Xóa lịch sử hoạt động của user

### getActivitiesByDateRange(userId, from, to)
- **Mô tả:** Lọc hoạt động theo ngày

### getActivitiesByAction(userId, action)
- **Mô tả:** Lọc hoạt động theo loại hành động

## 4. Ví dụ sử dụng tổng hợp
```js
import { logUserActivity, getUserActivities } from '../utils/activityUtils';
logUserActivity('LOGIN', { userId: 123 });
const activities = getUserActivities(123);
```

## 5. Lưu ý & Cảnh báo
- Nên lưu hoạt động ở localStorage hoặc gửi về server để lưu trữ lâu dài
- Có thể mở rộng để phục vụ mục đích bảo mật, kiểm tra bất thường