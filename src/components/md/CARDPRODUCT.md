# CARDPRODUCT.md - Component CardProduct

## 1. Tổng quan
CardProduct.js là component hiển thị thông tin sản phẩm dạng card: hình ảnh, tên, giá, trạng thái kho, nút mua...

## 2. Props
- product: Object sản phẩm (id, name, price, image, stock...)
- onClick: Hàm callback khi click card

## 3. Chức năng chính
- Hiển thị hình ảnh, tên, giá, trạng thái kho
- Nút mua hoặc xem chi tiết
- Hiển thị badge giảm giá, hết hàng nếu có

## 4. Ví dụ sử dụng
```js
<CardProduct product={item} onClick={() => ...} />
```

## 5. Lưu ý
- Nên validate dữ liệu đầu vào
- Responsive tốt cho mobile