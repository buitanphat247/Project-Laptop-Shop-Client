# DESCRIPTIONMODAL.md - Component DescriptionModal

## 1. Tổng quan
DescriptionModal.js là component hiển thị modal mô tả chi tiết sản phẩm.

## 2. Props
- visible: Trạng thái hiển thị modal
- onClose: Hàm đóng modal
- description: Nội dung mô tả

## 3. Chức năng chính
- Hiển thị mô tả chi tiết trong modal

## 4. Ví dụ sử dụng
```js
<DescriptionModal visible={show} onClose={closeModal} description={desc} />
```

## 5. Lưu ý
- Nên kiểm tra description hợp lệ