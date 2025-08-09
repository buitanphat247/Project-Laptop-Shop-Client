# DASHBOARDCARD.md - Component DashboardCard

## 1. Tổng quan
DashboardCard.js là component hiển thị card thống kê cho dashboard (user, sản phẩm, doanh thu...)

## 2. Props
- title: Tiêu đề card
- value: Giá trị thống kê
- icon: Icon hiển thị
- change: Phần trăm thay đổi (tuỳ chọn)

## 3. Chức năng chính
- Hiển thị số liệu, icon, tiêu đề, phần trăm thay đổi
- Có thể custom màu sắc, icon

## 4. Ví dụ sử dụng
```js
<DashboardCard title="Tổng Users" value={1000} icon={<UserIcon />} change={12.5} />
```

## 5. Lưu ý
- Nên truyền đủ props để hiển thị đúng
- Có thể dùng cho nhiều loại dashboard khác nhau