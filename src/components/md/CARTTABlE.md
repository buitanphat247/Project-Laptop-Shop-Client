# CARTTABLE.md - Component CartTable

## 1. Tổng quan
CartTable.js là component hiển thị bảng danh sách sản phẩm trong giỏ hàng.

## 2. Props
- items: Mảng sản phẩm trong giỏ
- onChange: Hàm callback khi thay đổi số lượng/xóa

## 3. Chức năng chính
- Hiển thị danh sách sản phẩm, số lượng, giá
- Cho phép thay đổi số lượng, xóa sản phẩm

## 4. Ví dụ sử dụng
```js
<CartTable items={cartItems} onChange={handleChange} />
```

## 5. Lưu ý
- Nên validate dữ liệu đầu vào
- Responsive tốt cho mobile