# ADDPERMISSIONMODAL.md - Component AddPermissionModal

## 1. Tổng quan
AddPermissionModal.js là component modal thêm mới quyền hoặc nhóm quyền.

## 2. Props
- visible: Trạng thái hiển thị modal
- onAdd: Callback khi thêm mới
- onClose: Callback đóng modal

## 3. Chức năng chính
- Hiển thị form nhập thông tin quyền
- Gửi dữ liệu khi submit

## 4. Ví dụ sử dụng
```js
<AddPermissionModal visible={show} onAdd={fn} onClose={fn} />
```

## 5. Lưu ý
- Nên validate dữ liệu đầu vào