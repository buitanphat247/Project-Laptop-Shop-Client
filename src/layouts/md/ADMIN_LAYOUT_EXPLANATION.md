# AdminLayout - Layout Component cho Admin Dashboard

## Tổng quan

File `src/layouts/AdminLayout.js` là một **Layout Component** trong React Router. Nó tạo cấu trúc layout chung cho tất cả trang admin, bao gồm sidebar cố định và content area để hiển thị nội dung.

## Mục đích

1. **Layout chung**: Tạo cấu trúc thống nhất cho tất cả trang admin
2. **Navigation**: Cung cấp sidebar với menu navigation
3. **Content area**: Vùng hiển thị nội dung chính
4. **Responsive**: Thiết kế responsive với Tailwind CSS
5. **Route nesting**: Hỗ trợ nested routes với React Router

## Cấu trúc component

### 1. Import statements

```javascript
import React from 'react';
import { Outlet } from 'react-router-dom';
import SectionSideBar from '../components/section/SectionSideBar';
```

**Giải thích:**
- `React`: Cần thiết cho functional component
- `Outlet`: Component từ React Router để render nested routes
- `SectionSideBar`: Component sidebar chứa navigation menu

### 2. AdminLayout component

```javascript
const AdminLayout = () => {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen z-30">
                <SectionSideBar />
            </div>
            {/* Content */}
            <div className="flex-1 bg-gray-100 p-6 ml-[240px]">
                <Outlet />
            </div>
        </div>
    );
};
```

**Props:** Không có props
**Returns:** Layout component với sidebar và content area

## Layout Structure

### 1. Container chính

```javascript
<div className="min-h-screen flex">
```

**Classes:**
- `min-h-screen`: Chiều cao tối thiểu = 100vh (viewport height)
- `flex`: Sử dụng flexbox layout

**Mục đích:** Tạo container chính với chiều cao tối thiểu bằng màn hình

### 2. Sidebar cố định

```javascript
<div className="fixed top-0 left-0 h-screen z-30">
    <SectionSideBar />
</div>
```

**Classes:**
- `fixed`: Cố định vị trí, không scroll theo content
- `top-0 left-0`: Đặt ở góc trên bên trái màn hình
- `h-screen`: Chiều cao = 100vh
- `z-30`: Z-index cao để đảm bảo hiển thị trên content

**Mục đích:** Tạo sidebar cố định bên trái, luôn hiển thị khi scroll

### 3. Content area

```javascript
<div className="flex-1 bg-gray-100 p-6 ml-[240px]">
    <Outlet />
</div>
```

**Classes:**
- `flex-1`: Chiếm hết không gian còn lại trong flex container
- `bg-gray-100`: Background màu xám nhạt
- `p-6`: Padding 24px (1.5rem) tất cả các cạnh
- `ml-[240px]`: Margin-left 240px để tránh bị che bởi sidebar

**Mục đích:** Tạo vùng nội dung chính với padding và margin phù hợp

## Components được sử dụng

### 1. SectionSideBar

```javascript
<SectionSideBar />
```

**Chức năng:**
- Hiển thị logo/brand
- Navigation menu cho admin
- User profile section
- Logout button
- Responsive toggle cho mobile

**Vị trí:** Bên trái, cố định

### 2. Outlet

```javascript
<Outlet />
```

**Chức năng:** Render component con tương ứng với route hiện tại

**Ví dụ:**
- `/admin/dashboard` → render `<Dashboard />`
- `/admin/users` → render `<UserManager />`
- `/admin/products` → render `<ProductManager />`

## Layout Flow

### 1. User truy cập admin route

```
1. User truy cập /admin/dashboard
2. RequireAdminAuth kiểm tra quyền
3. AdminLayout được render
4. SectionSideBar hiển thị bên trái
5. Outlet render Dashboard component bên phải
```

### 2. User navigate giữa các trang admin

```
1. User click menu "Users" trong sidebar
2. URL thay đổi thành /admin/users
3. AdminLayout vẫn giữ nguyên (không re-render)
4. Chỉ Outlet thay đổi, render UserManager component
5. Sidebar vẫn hiển thị, chỉ content area thay đổi
```

## Responsive Design

### Desktop (mặc định)

```css
/* Sidebar cố định, content có margin-left */
.sidebar {
    position: fixed;
    width: 240px;
}

.content {
    margin-left: 240px;
}
```

### Mobile (cần thêm responsive classes)

```css
/* Có thể thêm responsive cho mobile */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
        /* Hoặc ẩn sidebar */
    }
    
    .content {
        margin-left: 0;
    }
}
```

## Cách sử dụng

### 1. Trong App.js hoặc router

```javascript
import AdminLayout from './layouts/AdminLayout';

// Sử dụng với nested routes
<Route 
    path="/admin/*" 
    element={
        <RequireAdminAuth>
            <AdminLayout />
        </RequireAdminAuth>
    }
>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users" element={<UserManager />} />
    <Route path="products" element={<ProductManager />} />
    <Route path="orders" element={<OrderManager />} />
</Route>
```

### 2. Với route parameters

```javascript
<Route path="/admin/*" element={<AdminLayout />}>
    <Route path="users/:id" element={<UserDetail />} />
    <Route path="products/:id/edit" element={<EditProduct />} />
</Route>
```

### 3. Với index route

```javascript
<Route path="/admin/*" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="users" element={<UserManager />} />
</Route>
```

## Lợi ích

1. **Consistency**: Layout thống nhất cho tất cả trang admin
2. **Navigation**: Sidebar luôn hiển thị, dễ navigate
3. **Performance**: Chỉ content thay đổi, sidebar không re-render
4. **Maintainable**: Logic layout tập trung ở một component
5. **Scalable**: Dễ thêm trang admin mới

## Hạn chế

1. **Fixed width**: Sidebar có chiều rộng cố định 240px
2. **Not responsive**: Chưa có responsive design cho mobile
3. **No header**: Không có header component
4. **Limited customization**: Ít tùy chọn tùy chỉnh

## Cải tiến có thể thực hiện

### 1. Thêm responsive design

```javascript
const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <div className="min-h-screen flex">
            {/* Mobile sidebar */}
            <div className={`md:hidden fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <SectionSideBar />
                </div>
            </div>
            
            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <SectionSideBar />
                </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 bg-gray-100 p-6 md:ml-64">
                <Outlet />
            </div>
        </div>
    );
};
```

### 2. Thêm header component

```javascript
<div className="flex-1 bg-gray-100 p-6 ml-[240px]">
    <AdminHeader />
    <Outlet />
</div>
```

### 3. Thêm breadcrumb

```javascript
<div className="flex-1 bg-gray-100 p-6 ml-[240px]">
    <Breadcrumb />
    <Outlet />
</div>
```

### 4. Thêm loading state

```javascript
const AdminLayout = () => {
    const [isLoading, setIsLoading] = useState(false);
    
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen z-30">
                <SectionSideBar />
            </div>
            
            {/* Content */}
            <div className="flex-1 bg-gray-100 p-6 ml-[240px]">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <Outlet />
                )}
            </div>
        </div>
    );
};
```

## So sánh với các layout khác

### 1. vs MainLayout

| Tính năng | AdminLayout | MainLayout |
|-----------|-------------|------------|
| **Sidebar** | Cố định bên trái | Có thể ẩn/hiện |
| **Header** | Không có | Có header |
| **Footer** | Không có | Có footer |
| **Responsive** | Chưa có | Có responsive |
| **Navigation** | Admin menu | Main menu |

### 2. vs DashboardLayout

| Tính năng | AdminLayout | DashboardLayout |
|-----------|-------------|-----------------|
| **Purpose** | Admin pages | User dashboard |
| **Sidebar** | Admin menu | User menu |
| **Content** | Admin tools | User data |
| **Access** | Admin only | Authenticated users |

## Best Practices

### 1. Route structure

```javascript
// Tốt: Sử dụng nested routes
<Route path="/admin/*" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users" element={<UserManager />} />
</Route>

// Không tốt: Route riêng lẻ
<Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
<Route path="/admin/users" element={<AdminLayout><UserManager /></AdminLayout>} />
```

### 2. Component organization

```javascript
// Tốt: Tách biệt layout và content
<AdminLayout>
    <Outlet />
</AdminLayout>

// Không tốt: Logic layout trong content component
<Dashboard>
    <Sidebar />
    <Content />
</Dashboard>
```

### 3. Styling approach

```javascript
// Tốt: Sử dụng Tailwind utility classes
<div className="min-h-screen flex bg-gray-100">

// Không tốt: Inline styles
<div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f3f4f6' }}>
```

## Kết luận

`AdminLayout` là một component quan trọng trong hệ thống admin. Nó cung cấp layout thống nhất và navigation thuận tiện cho tất cả trang admin. Component này đơn giản nhưng hiệu quả, có thể mở rộng thêm tính năng responsive và customization khi cần thiết.

**Sử dụng khi:**
- Cần layout thống nhất cho admin pages
- Cần sidebar navigation cố định
- Sử dụng nested routes
- Muốn tách biệt layout và content

**Không sử dụng khi:**
- Cần responsive design ngay lập tức
- Cần header/footer trong layout
- Layout đơn giản, không cần sidebar 