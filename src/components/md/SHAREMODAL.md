# SHAREMODAL.md - Component ShareModal

## 1. Tổng quan
ShareModal.js là component hiển thị modal chia sẻ sản phẩm/tin tức qua mạng xã hội.

## 2. Props
- visible: Trạng thái hiển thị modal
- onClose: Hàm đóng modal
- url: Đường dẫn cần chia sẻ

## 3. Chức năng chính
- Hiển thị các tuỳ chọn chia sẻ (Facebook, Zalo, copy link...)

## 4. Ví dụ sử dụng
```js
<ShareModal visible={show} onClose={closeModal} url={url} />
```

## 5. Lưu ý
- Nên kiểm tra url hợp lệ