# PERMISSIONGROUP.md - Component PermissionGroup

## 1. Tổng quan
PermissionGroup.js là component hiển thị nhóm quyền (danh sách quyền con, tên nhóm).

## 2. Props
- group: Object nhóm quyền (name, permissions)

## 3. Chức năng chính
- Hiển thị tên nhóm, danh sách quyền con

## 4. Ví dụ sử dụng
```js
<PermissionGroup group={item} />
```

## 5. Lưu ý
- Nên truyền đúng format group