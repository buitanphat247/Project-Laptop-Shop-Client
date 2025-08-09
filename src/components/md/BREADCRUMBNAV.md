# BREADCRUMBNAV.md - Component BreadcrumbNav

## 1. Tổng quan
BreadcrumbNav.js là component hiển thị breadcrumb điều hướng (Home > Sản phẩm > ...).

## 2. Props
- items: Mảng breadcrumb (label, link)

## 3. Chức năng chính
- Hiển thị đường dẫn breadcrumb

## 4. Ví dụ sử dụng
```js
<BreadcrumbNav items={[{label: 'Home', link: '/'}, ...]} />
```

## 5. Lưu ý
- Nên truyền đúng format items