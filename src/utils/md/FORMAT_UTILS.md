# FORMATUTILS.md - Định dạng dữ liệu

## 1. Tổng quan
Cung cấp các hàm tiện ích để định dạng số, tiền, ngày tháng, phần trăm, mã code, v.v. Dùng để chuẩn hóa hiển thị dữ liệu trên UI.

## 2. Mục đích
- Định dạng dữ liệu hiển thị cho người dùng
- Chuẩn hóa cách hiển thị số liệu, tiền tệ, ngày tháng
- Tăng trải nghiệm người dùng, giảm lỗi hiển thị

## 3. Các hàm chính & Giải thích

### formatPrice(price, currency, locale)
- **Mô tả:** Định dạng giá tiền theo locale/currency
- **Trả về:** string (ví dụ: "1.000.000 ₫")
- **Ví dụ:**
  ```js
  formatPrice(1234567); // "1.234.567 ₫"
  ```

### formatNumber(number)
- **Mô tả:** Định dạng số có dấu phân cách
- **Trả về:** string

### formatPercentage(value)
- **Mô tả:** Định dạng phần trăm (12.5%)
- **Trả về:** string

### formatDate(date)
- **Mô tả:** Định dạng ngày tháng (theo locale)
- **Trả về:** string

### formatTimeAgo(date)
- **Mô tả:** Hiển thị thời gian tương đối ("2 ngày trước")
- **Trả về:** string

### formatFileSize(bytes)
- **Mô tả:** Định dạng dung lượng file (KB, MB...)
- **Trả về:** string

### formatPhone(phone)
- **Mô tả:** Định dạng số điện thoại
- **Trả về:** string

### formatCode(code)
- **Mô tả:** Định dạng mã code (thêm dấu cách, chuẩn hóa)
- **Trả về:** string

## 4. Ví dụ sử dụng tổng hợp
```js
import { formatPrice, formatDate } from '../utils/formatUtils';
const price = formatPrice(1234567);
const date = formatDate('2024-05-01');
```

## 5. Lưu ý
- Nên dùng các hàm này để đảm bảo giao diện nhất quán
- Có thể mở rộng thêm các hàm định dạng khác nếu cần