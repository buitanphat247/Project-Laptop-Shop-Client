# CARDSERVICE.md - Component CardService

## 1. Tổng quan
CardService.js là component hiển thị dịch vụ/ưu đãi dạng card (bảo hành, giao hàng, đổi trả...)

## 2. Props
- service: Object dịch vụ (icon, title, desc)

## 3. Chức năng chính
- Hiển thị icon, tiêu đề, mô tả dịch vụ

## 4. Ví dụ sử dụng
```js
<CardService service={item} />
```

## 5. Lưu ý
- Có thể custom icon/style qua props