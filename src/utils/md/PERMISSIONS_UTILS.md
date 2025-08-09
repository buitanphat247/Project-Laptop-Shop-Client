# permissionUtils.js - Phân quyền

## Tổng quan
Cung cấp các hàm tiện ích kiểm tra quyền user: admin, manager, user, guest...

## Mục đích
- Kiểm tra quyền truy cập các chức năng, route
- Hỗ trợ bảo vệ route, hiển thị UI phù hợp

## Các hàm chính
- `hasPermission(user, permission)`: Kiểm tra user có quyền cụ thể
- `isAdmin(user)`: Kiểm tra user là admin
- `isSuperAdmin(user)`: Kiểm tra user là super admin
- `isManager(user)`: Kiểm tra user là manager
- `isRegularUser(user)`: Kiểm tra user là user thường
- `isGuest(user)`: Kiểm tra user là guest

## Ví dụ sử dụng
```js
import { isAdmin, hasPermission } from '../utils/permissionUtils';

if (isAdmin(user)) {
  // Hiển thị chức năng admin
}
```

## Lưu ý
- Nên kết hợp với guard và backend để bảo vệ thực sự.