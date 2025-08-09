# LANGUAGEREGION.md - Component LanguageRegion

## 1. Tổng quan
LanguageRegion.js là component chọn ngôn ngữ, vùng miền cho user.

## 2. Props
- value: Giá trị hiện tại
- onChange: Callback khi đổi ngôn ngữ/vùng

## 3. Chức năng chính
- Hiển thị danh sách ngôn ngữ, vùng miền
- Cho phép chọn và đổi ngôn ngữ

## 4. Ví dụ sử dụng
```js
<LanguageRegion value={lang} onChange={fn} />
```

## 5. Lưu ý
- Nên truyền đúng format value