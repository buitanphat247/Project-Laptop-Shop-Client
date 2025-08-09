# HEADER.md - Component Header

## 1. Tổng quan
Header.js là component thanh điều hướng chính của ứng dụng. Thường đặt ở đầu trang, hiển thị logo, menu, thông tin user, và các nút truy cập nhanh.

## 2. Props
- Không nhận props trực tiếp (hoặc nhận các props cấu hình menu tuỳ dự án)

## 3. Chức năng chính
- Hiển thị logo/brand
- Hiển thị menu điều hướng (Home, Sản phẩm, Tin tức...)
- Hiển thị thông tin user (avatar, tên, dropdown)
- Có thể có nút đăng nhập/đăng xuất, thông báo, giỏ hàng

## 4. Ví dụ sử dụng
```js
import Header from './components/Header';
<Header />
```

## 5. Lưu ý
- Nên responsive cho mobile/tablet
- Có thể custom menu qua props hoặc context