# NEWSCARD.md - Component NewsCard

## 1. Tổng quan
NewsCard.js là component hiển thị tin tức dạng card: ảnh, tiêu đề, mô tả, tác giả, ngày đăng, lượt xem.

## 2. Props
- id, title, slug, desc, thumbnail, createdAt, author, published

## 3. Chức năng chính
- Hiển thị ảnh, tiêu đề, mô tả, tác giả, ngày đăng, badge xuất bản
- Hiển thị lượt xem, nút đọc thêm

## 4. Ví dụ sử dụng
```js
<NewsCard id={1} title="Tin mới" desc="..." />
```

## 5. Lưu ý
- Nên truyền đủ props để hiển thị đầy đủ
- Có thể custom style qua className