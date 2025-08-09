# CKEDITORCOMPONENT.md - Component CKEditorComponent

## 1. Tổng quan
CKEditorComponent.js là component tích hợp trình soạn thảo văn bản CKEditor 5 vào React app.

## 2. Props
- value: Nội dung hiện tại
- onChange: Hàm callback khi thay đổi nội dung
- config: Cấu hình CKEditor (toolbar, placeholder...)
- disabled: Trạng thái disabled

## 3. Chức năng chính
- Hiển thị trình soạn thảo văn bản WYSIWYG
- Hỗ trợ cấu hình toolbar, placeholder, upload ảnh...
- Nhận và trả về nội dung HTML

## 4. Ví dụ sử dụng
```js
<CKEditorComponent value={content} onChange={setContent} config={config} />
```

## 5. Lưu ý
- Nên kiểm tra nội dung đầu ra để tránh XSS
- Có thể custom config qua file riêng