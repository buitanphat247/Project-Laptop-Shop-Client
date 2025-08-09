# PRODUCTHEADER.md - Component ProductHeader

## 1. Tổng quan
ProductHeader.js là component hiển thị tiêu đề, mã sản phẩm, trạng thái kho.

## 2. Props
- title: Tiêu đề sản phẩm
- code: Mã sản phẩm
- stock: Số lượng tồn kho

## 3. Chức năng chính
- Hiển thị tiêu đề, mã, trạng thái kho

## 4. Ví dụ sử dụng
```js
<ProductHeader title="Laptop MSI" code="MSI123" stock={5} />
```

## 5. Lưu ý
- Nên truyền đủ props để hiển thị đúng