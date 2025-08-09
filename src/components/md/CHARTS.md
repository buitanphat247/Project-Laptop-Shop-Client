# CHARTS.md - Component Charts

## 1. Tổng quan
Charts.js là component hiển thị biểu đồ (line, bar, pie...) cho dashboard hoặc báo cáo.

## 2. Props
- data: Dữ liệu biểu đồ
- type: Loại biểu đồ (line, bar, pie...)
- options: Tuỳ chọn cấu hình biểu đồ

## 3. Chức năng chính
- Hiển thị biểu đồ với dữ liệu động
- Hỗ trợ nhiều loại biểu đồ
- Tuỳ biến màu sắc, tooltip, legend

## 4. Ví dụ sử dụng
```js
<Charts data={data} type="bar" options={options} />
```

## 5. Lưu ý
- Nên validate dữ liệu đầu vào
- Có thể dùng thư viện chart (Chart.js, Recharts...)