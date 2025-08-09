# ORDERSUMMARY.md - Component OrderSummary

## 1. Tổng quan
OrderSummary.js là component hiển thị tổng kết đơn hàng: tổng tiền, phí ship, giảm giá, tổng thanh toán.

## 2. Props
- items: Mảng sản phẩm
- shippingFee: Phí vận chuyển
- discount: Mức giảm giá

## 3. Chức năng chính
- Tính và hiển thị tổng tiền, phí ship, giảm giá, tổng thanh toán

## 4. Ví dụ sử dụng
```js
<OrderSummary items={cartItems} shippingFee={30000} discount={10000} />
```

## 5. Lưu ý
- Nên kiểm tra dữ liệu đầu vào
- Có thể custom format tiền tệ