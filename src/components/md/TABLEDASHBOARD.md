# TABLEDASHBOARD.md - Component TableDashboard

## 1. Tổng quan
TableDashboard.js là component hiển thị bảng dữ liệu tổng hợp cho dashboard (user, sản phẩm, đơn hàng...)

## 2. Props
- data: Mảng dữ liệu
- columns: Định nghĩa cột
- title: Tiêu đề bảng (tuỳ chọn)

## 3. Chức năng chính
- Hiển thị bảng dữ liệu động
- Hỗ trợ sắp xếp, filter, phân trang (nếu có)

## 4. Ví dụ sử dụng
```js
<TableDashboard data={data} columns={columns} />
```

## 5. Lưu ý
- Nên truyền data/columns đúng format
- Responsive tốt cho mobile