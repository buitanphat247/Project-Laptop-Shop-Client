# PRODUCTQUANTITY.md - Component ProductQuantity

## 1. Tổng quan
ProductQuantity.js là component chọn số lượng sản phẩm khi mua hàng.

## 2. Props
- value: Số lượng hiện tại
- min, max: Giới hạn số lượng
- onChange: Hàm callback khi thay đổi số lượng

## 3. Chức năng chính
- Cho phép tăng/giảm số lượng sản phẩm
- Kiểm soát giới hạn số lượng

## 4. Ví dụ sử dụng
```js
<ProductQuantity value={1} min={1} max={10} onChange={fn} />
```

## 5. Lưu ý
- Nên kiểm tra giá trị đầu vào