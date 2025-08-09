# PRODUCTPRICE.md - Component ProductPrice

## 1. Tổng quan
ProductPrice.js là component hiển thị giá sản phẩm, giá gốc, giá khuyến mãi.

## 2. Props
- price: Giá hiện tại
- originalPrice: Giá gốc
- discount: Mức giảm giá

## 3. Chức năng chính
- Hiển thị giá, giá gốc, badge giảm giá

## 4. Ví dụ sử dụng
```js
<ProductPrice price={9000000} originalPrice={12000000} discount={25} />
```

## 5. Lưu ý
- Nên kiểm tra giá trị đầu vào