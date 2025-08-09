# SECTIONHEADER.md - Component SectionHeader

## 1. Tổng quan
SectionHeader.js là component hiển thị tiêu đề section, có thể kèm icon, action.

## 2. Props
- title: Tiêu đề section
- icon: Icon hiển thị (tuỳ chọn)
- actions: Các nút action (tuỳ chọn)

## 3. Chức năng chính
- Hiển thị tiêu đề, icon, action

## 4. Ví dụ sử dụng
```js
<SectionHeader title="Quản lý sản phẩm" icon={<BoxIcon />} />
```

## 5. Lưu ý
- Có thể custom style qua className