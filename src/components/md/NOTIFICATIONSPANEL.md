# NOTIFICATIONSPANEL.md - Component NotificationsPanel

## 1. Tổng quan
NotificationsPanel.js là component hiển thị danh sách thông báo cho user. Có thể là panel trượt, popup hoặc dropdown.

## 2. Props
- Có thể nhận props: notifications (array), onRead, onClose, ...

## 3. Chức năng chính
- Hiển thị danh sách thông báo (chưa đọc, đã đọc)
- Cho phép đánh dấu đã đọc, xoá thông báo
- Có thể có phân trang, filter

## 4. Ví dụ sử dụng
```js
<NotificationsPanel notifications={data} onRead={fn} onClose={fn} />
```

## 5. Lưu ý
- Nên tối ưu hiệu năng khi danh sách lớn
- Responsive tốt cho mobile