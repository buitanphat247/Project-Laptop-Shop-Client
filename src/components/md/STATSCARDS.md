# STATSCARDS.md - Component StatsCards

## 1. Tổng quan
StatsCards.js là component hiển thị các card thống kê về quyền, nhóm quyền, user...

## 2. Props
- stats: Mảng dữ liệu thống kê (title, value, icon...)

## 3. Chức năng chính
- Hiển thị nhiều card thống kê dạng lưới
- Tuỳ biến icon, màu sắc, số liệu

## 4. Ví dụ sử dụng
```js
<StatsCards stats={data} />
```

## 5. Lưu ý
- Nên truyền đúng format stats