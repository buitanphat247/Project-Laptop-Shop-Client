# ALLREVIEWSMODAL.md - Component AllReviewsModal

## 1. Tổng quan
AllReviewsModal.js là component hiển thị modal danh sách tất cả đánh giá sản phẩm.

## 2. Props
- reviews: Mảng đánh giá
- visible: Trạng thái hiển thị modal
- onClose: Hàm đóng modal

## 3. Chức năng chính
- Hiển thị danh sách đánh giá chi tiết
- Cho phép đóng modal

## 4. Ví dụ sử dụng
```js
<AllReviewsModal reviews={reviews} visible={show} onClose={closeModal} />
```

## 5. Lưu ý
- Nên truyền reviews đúng format