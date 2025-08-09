# NEWSUTILS.md - Tiện ích xử lý tin tức

## 1. Tổng quan
Cung cấp các hàm tiện ích xử lý dữ liệu tin tức: format ngày, tạo URL, lấy thông tin tác giả, trạng thái xuất bản, sinh số lượt xem, v.v.

## 2. Mục đích
- Chuẩn hóa xử lý dữ liệu tin tức cho UI
- Hỗ trợ component NewsCard, NewsFilters, NewsManager
- Tăng khả năng tái sử dụng và test

## 3. Các hàm chính & Giải thích

### formatNewsDate(dateString)
- **Mô tả:** Định dạng ngày tháng cho tin tức (theo locale)
- **Trả về:** string
- **Ví dụ:**
  ```js
  formatNewsDate('2024-05-01'); // "1 tháng 5, 2024"
  ```

### getAuthorName(author)
- **Mô tả:** Lấy tên tác giả từ object author
- **Trả về:** string

### generateViewCount(id)
- **Mô tả:** Sinh số lượt xem ngẫu nhiên dựa trên id
- **Trả về:** number

### formatViewCount(count)
- **Mô tả:** Định dạng số lượt xem (1.2K, 3.4M...)
- **Trả về:** string

### generateNewsUrl(id, slug)
- **Mô tả:** Tạo URL cho tin tức
- **Trả về:** string

## 4. Ví dụ sử dụng tổng hợp
```js
import { formatNewsDate, getAuthorName, generateNewsUrl } from '../utils/newsUtils';
const date = formatNewsDate('2024-05-01');
const author = getAuthorName({ fullName: 'Admin' });
const url = generateNewsUrl(1, 'tin-tuc-moi');
```

## 5. Lưu ý
- Có thể mở rộng thêm các hàm xử lý meta, thumbnail, trạng thái xuất bản
- Đảm bảo dữ liệu đầu vào hợp lệ để tránh lỗi hiển thị