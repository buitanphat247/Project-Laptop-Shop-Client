# productUtils.js - Tiện ích sản phẩm

## Tổng quan
Cung cấp các hàm tiện ích xử lý dữ liệu sản phẩm: trạng thái kho, URL, tính giá, lọc/sắp xếp...

## Mục đích
- Chuẩn hóa xử lý dữ liệu sản phẩm
- Hỗ trợ component CardProduct, ProductFilters, ProductManager

## Các hàm chính
- `getStockStatus(stock)`: Lấy trạng thái tồn kho
- `generateProductUrl(id, slug)`: Tạo URL sản phẩm
- `isInStock(stock)`: Kiểm tra còn hàng
- `calculateDiscountedPrice(price, discount)`: Tính giá sau giảm
- `sortProducts(products, sortBy)`: Sắp xếp sản phẩm
- `filterProducts(products, filters)`: Lọc sản phẩm
- ...

## Ví dụ sử dụng
```js
import { getStockStatus, generateProductUrl } from '../utils/productUtils';

const status = getStockStatus(5);
const url = generateProductUrl(123, 'laptop-msi');
```

## Lưu ý
- Có thể mở rộng thêm các hàm xử lý giá, trạng thái, meta.