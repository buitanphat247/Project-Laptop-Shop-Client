# CARDREVIEW.md - Component CardReview

## 1. Tổng quan
CardReview.js là component hiển thị đánh giá sản phẩm dạng card: avatar, tên, số sao, bình luận.

## 2. Props
- review: Object đánh giá (name, avatar, rating, comment, time)

## 3. Chức năng chính
- Hiển thị avatar, tên, số sao, bình luận, thời gian

## 4. Ví dụ sử dụng
```js
<CardReview review={item} />
```

## 5. Lưu ý
- Nên validate dữ liệu đầu vào
- Có thể custom style qua className