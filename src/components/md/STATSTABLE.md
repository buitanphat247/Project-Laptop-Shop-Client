# STATSTABLE.md - Component StatsTable

## 1. Tổng quan
StatsTable.js là component hiển thị bảng thống kê số liệu (user, sản phẩm, đơn hàng, v.v.).

## 2. Props
- data: Mảng dữ liệu thống kê
- columns: Định nghĩa cột (tên, kiểu dữ liệu, format)
- title: Tiêu đề bảng (tuỳ chọn)

## 3. Chức năng chính
- Hiển thị bảng số liệu động
- Hỗ trợ sắp xếp, filter, phân trang (nếu có)
- Tuỳ biến cột, format dữ liệu

## 4. Ví dụ sử dụng
```js
<StatsTable data={data} columns={columns} title="Thống kê người dùng" />
```

## 5. Lưu ý
- Nên truyền data/columns đúng format
- Responsive tốt cho mobile/tablet