# MainLayout - Layout Component cho Trang Khách (User-facing)

## Tổng quan

File `src/layouts/MainLayout.js` là một **Layout Component** trong React Router. Nó tạo cấu trúc layout chung cho tất cả các trang ngoài (khách, landing page, user), bao gồm Header, Footer và vùng nội dung chính.

## Mục đích

1. **Layout chung**: Tạo cấu trúc thống nhất cho tất cả trang ngoài
2. **Header/Footer**: Cố định trên cùng và dưới cùng
3. **Content area**: Vùng hiển thị nội dung chính
4. **Responsive**: Thiết kế responsive với Tailwind CSS
5. **Route nesting**: Hỗ trợ nested routes với React Router

## Cấu trúc component

### 1. Import statements

```javascript
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
```

**Giải thích:**
- `React`: Cần thiết cho functional component
- `Header`: Thanh điều hướng trên cùng
- `Footer`: Thanh thông tin dưới cùng
- `Outlet`: Component từ React Router để render nested routes

### 2. MainLayout component

```javascript
const MainLayout = ({ children }) => {
    return (
        <>
            <Header />
            <main className="container mx-auto py-5">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};
```

**Props:**
- `children` (ít dùng, chủ yếu dùng `<Outlet />`)

**Returns:** Layout component với Header, Footer và content area

## Layout Structure

### 1. Container chính

```javascript
<>
    <Header />
    <main className="container mx-auto py-5">
        <Outlet />
    </main>
    <Footer />
</>
```

**Mục đích:**
- Đảm bảo mọi trang đều có Header, Footer và vùng nội dung chính ở giữa
- Sử dụng Tailwind để căn giữa, padding hợp lý

### 2. Header

```javascript
<Header />
```
- Hiển thị thanh điều hướng trên cùng
- Có thể chứa logo, menu, user info

### 3. Content area

```javascript
<main className="container mx-auto py-5">
    <Outlet />
</main>
```
- Vùng nội dung chính, căn giữa, padding
- `<Outlet />` để render các route con

### 4. Footer

```javascript
<Footer />
```
- Hiển thị thông tin cuối trang (copyright, links...)

## Components được sử dụng

### 1. Header
- Thanh điều hướng trên cùng, có thể chứa logo, menu, user info

### 2. Footer
- Thông tin cuối trang, có thể chứa links, bản quyền

### 3. Outlet
- Render component con tương ứng với route hiện tại

## Layout Flow

### 1. User truy cập route ngoài

```
1. User truy cập /, /about, /products, ...
2. MainLayout được render
3. Header hiển thị trên cùng
4. Outlet render component tương ứng với route
5. Footer hiển thị dưới cùng
```

### 2. User navigate giữa các trang ngoài

```
1. User click menu "Sản phẩm" trong header
2. URL thay đổi thành /products
3. MainLayout vẫn giữ nguyên (không re-render)
4. Chỉ Outlet thay đổi, render Product component
5. Header/Footer vẫn hiển thị, chỉ content area thay đổi
```

## Responsive Design

- Sử dụng Tailwind CSS để đảm bảo layout responsive
- `container mx-auto` căn giữa và giới hạn chiều rộng
- `py-5` tạo padding dọc
- Header/Footer có thể thêm responsive classes nếu cần

## Cách sử dụng

### 1. Trong App.js hoặc router

```javascript
import MainLayout from './layouts/MainLayout';

<Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="products" element={<ProductList />} />
    <Route path="products/:id" element={<ProductDetail />} />
    <Route path="*" element={<NotFound />} />
</Route>
```

### 2. Với route parameters

```javascript
<Route element={<MainLayout />}>
    <Route path="products/:id" element={<ProductDetail />} />
</Route>
```

### 3. Với index route

```javascript
<Route element={<MainLayout />}>
    <Route index element={<Home />} />
</Route>
```

## Lợi ích

1. **Consistency**: Layout thống nhất cho tất cả trang ngoài
2. **Navigation**: Header/Footer luôn hiển thị, dễ navigate
3. **Performance**: Chỉ content thay đổi, header/footer không re-render
4. **Maintainable**: Logic layout tập trung ở một component
5. **Scalable**: Dễ thêm trang mới

## Hạn chế

1. **No sidebar**: Không có sidebar cố định như admin
2. **Header/Footer đơn giản**: Có thể cần tuỳ biến thêm
3. **Limited customization**: Ít tuỳ chọn tuỳ chỉnh

## Cải tiến có thể thực hiện

1. Thêm responsive cho header/footer
2. Thêm breadcrumb cho content area
3. Thêm loading state cho main content
4. Thêm animation chuyển trang

## So sánh với các layout khác

### 1. vs AdminLayout

| Tính năng      | MainLayout         | AdminLayout         |
|----------------|-------------------|---------------------|
| **Sidebar**    | Không có          | Cố định bên trái    |
| **Header**     | Có                | Không có            |
| **Footer**     | Có                | Không có            |
| **Responsive** | Có                | Chưa có             |
| **Navigation** | Main menu         | Admin menu          |

## Best Practices

### 1. Route structure

```javascript
// Tốt: Sử dụng nested routes
<Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
</Route>

// Không tốt: Route riêng lẻ
<Route path="/" element={<MainLayout><Home /></MainLayout>} />
<Route path="/about" element={<MainLayout><About /></MainLayout>} />
```

### 2. Component organization

```javascript
// Tốt: Tách biệt layout và content
<MainLayout>
    <Outlet />
</MainLayout>

// Không tốt: Logic layout trong content component
<Home>
    <Header />
    <Content />
    <Footer />
</Home>
```

### 3. Styling approach

```javascript
// Tốt: Sử dụng Tailwind utility classes
<div className="container mx-auto py-5">

// Không tốt: Inline styles
<div style={{ margin: '0 auto', padding: '20px' }}>
```

## Kết luận

`MainLayout` là một component quan trọng cho các trang ngoài của ứng dụng. Nó cung cấp layout thống nhất, dễ bảo trì, dễ mở rộng và đảm bảo trải nghiệm người dùng nhất quán trên toàn bộ website.

**Sử dụng khi:**
- Cần layout thống nhất cho user pages
- Cần header/footer cố định
- Sử dụng nested routes
- Muốn tách biệt layout và content

**Không sử dụng khi:**
- Cần sidebar cố định
- Layout đơn giản, chỉ 1-2 trang