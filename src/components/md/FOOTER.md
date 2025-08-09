# FOOTER.md - Component Footer

## 1. Tổng quan
Footer.js là component hiển thị cuối trang, thường chứa thông tin bản quyền, liên hệ, liên kết nhanh, mạng xã hội.

## 2. Props
- Không nhận props trực tiếp (hoặc nhận các props cấu hình nội dung tuỳ dự án)

## 3. Chức năng chính
- Hiển thị thông tin bản quyền (copyright)
- Hiển thị liên kết nhanh (About, Chính sách, Liên hệ...)
- Hiển thị icon mạng xã hội

## 4. Ví dụ sử dụng
```js
import Footer from './components/Footer';
<Footer />
```

## 5. Lưu ý
- Nên responsive cho mobile/tablet
- Có thể custom nội dung qua props hoặc context