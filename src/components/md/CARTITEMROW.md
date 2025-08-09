# CARTITEMROW.md - Component CartItemRow

## 1. Tổng quan
CartItemRow.js là component hiển thị một dòng sản phẩm trong giỏ hàng.

## 2. Props
- item: Object sản phẩm
- onChange: Hàm callback khi thay đổi số lượng
- onRemove: Hàm callback khi xóa sản phẩm

## 3. Chức năng chính
- Hiển thị thông tin sản phẩm, số lượng, giá
- Cho phép thay đổi số lượng, xóa sản phẩm

## 4. Ví dụ sử dụng
```js
<CartItemRow item={item} onChange={fn} onRemove={fn} />
```

## 5. Lưu ý
- Nên validate dữ liệu đầu vào