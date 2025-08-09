# PERMISSIONTABLE.md - Component PermissionTable

## 1. Tổng quan
PermissionTable.js là component hiển thị bảng phân quyền, danh sách quyền cho user/role.

## 2. Props
- data: Mảng quyền (permissions)
- onChange: Hàm callback khi thay đổi quyền
- columns: Định nghĩa cột (nếu tuỳ biến)

## 3. Chức năng chính
- Hiển thị danh sách quyền, checkbox chọn quyền
- Cho phép chỉnh sửa, lưu thay đổi quyền
- Tuỳ biến cột, format dữ liệu

## 4. Ví dụ sử dụng
```js
<PermissionTable data={permissions} onChange={handleChange} />
```

## 5. Lưu ý
- Nên truyền data đúng format
- Xử lý phân quyền cẩn thận để tránh lỗi bảo mật