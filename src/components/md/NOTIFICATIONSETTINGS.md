# NOTIFICATIONSETTINGS.md - Component NotificationSettings

## 1. Tổng quan
NotificationSettings.js là component cài đặt thông báo cho user.

## 2. Props
- settings: Object cài đặt
- onChange: Callback khi đổi cài đặt

## 3. Chức năng chính
- Hiển thị các tuỳ chọn cài đặt thông báo
- Cho phép bật/tắt từng loại thông báo

## 4. Ví dụ sử dụng
```js
<NotificationSettings settings={data} onChange={fn} />
```

## 5. Lưu ý
- Nên truyền đúng format settings