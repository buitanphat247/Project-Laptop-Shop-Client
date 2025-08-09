# ANIMATEDCOUNTER.md - Component AnimatedCounter

## 1. Tổng quan
AnimatedCounter.js là component hiển thị số liệu động, tăng dần từ 0 đến giá trị đích (dùng cho dashboard, thống kê).

## 2. Props
- value: Giá trị đích (number)
- duration: Thời gian chạy animation (ms)
- format: Hàm format số (tuỳ chọn)

## 3. Chức năng chính
- Hiển thị số liệu động, hiệu ứng tăng số
- Tuỳ biến thời gian, format số

## 4. Ví dụ sử dụng
```js
<AnimatedCounter value={1000} duration={1500} />
```

## 5. Lưu ý
- Nên kiểm tra giá trị đầu vào là số
- Có thể dùng cho dashboard, card thống kê