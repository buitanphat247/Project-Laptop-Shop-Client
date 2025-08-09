# PERMISSIONSSECTION.md - Component PermissionsSection

## 1. Tổng quan
PermissionsSection.js là component hiển thị section quản lý quyền (danh sách nhóm quyền, filter, action).

## 2. Props
- groups: Mảng nhóm quyền
- onAdd: Callback thêm quyền

## 3. Chức năng chính
- Hiển thị danh sách nhóm quyền, filter, nút thêm mới

## 4. Ví dụ sử dụng
```js
<PermissionsSection groups={data} onAdd={fn} />
```

## 5. Lưu ý
- Nên truyền đúng format groups