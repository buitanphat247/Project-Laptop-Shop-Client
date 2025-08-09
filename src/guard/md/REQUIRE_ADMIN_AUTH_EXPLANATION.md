# RequireAdminAuth - Route Guard Component

## Tổng quan

File `src/guard/RequireAdminAuth.js` là một **Route Guard Component** trong React Router. Nó bảo vệ các route chỉ dành cho admin bằng cách kiểm tra quyền truy cập trước khi render component con.

## Mục đích

1. **Bảo mật**: Ngăn user không có quyền truy cập vào trang admin
2. **Authentication**: Kiểm tra user đã đăng nhập chưa
3. **Authorization**: Kiểm tra user có role admin không
4. **Audit Trail**: Log hoạt động truy cập để theo dõi bảo mật
5. **UX**: Redirect user về trang phù hợp khi không có quyền

## Cấu trúc component

### 1. Import statements

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, logUserActivity } from '../utils/auth';
```

**Giải thích:**
- `React`: Cần thiết cho functional component
- `Navigate`: Component từ React Router để redirect
- `isAuthenticated`: Kiểm tra trạng thái đăng nhập
- `getUserRole`: Lấy role của user từ cookie
- `logUserActivity`: Log hoạt động để audit trail

### 2. Component function

```javascript
const RequireAdminAuth = ({ children }) => {
    // Logic kiểm tra quyền truy cập
    return children || <Navigate />;
};
```

**Props:**
- `children`: Components con cần được bảo vệ

**Returns:**
- `children`: Nếu có quyền truy cập
- `<Navigate>`: Redirect component nếu không có quyền

## Luồng hoạt động chi tiết

### Bước 1: Kiểm tra đăng nhập

```javascript
const isLoggedIn = isAuthenticated();
```

**Hàm `isAuthenticated()` sẽ kiểm tra:**
1. Có access token trong cookie không
2. Token còn hạn không (JWT expiration)
3. Có login status trong cookie không
4. Session có hợp lệ không (24 giờ)

**Kết quả:**
- `true`: User đã đăng nhập
- `false`: User chưa đăng nhập

### Bước 2: Lấy role của user

```javascript
const userRole = getUserRole();
```

**Hàm `getUserRole()` sẽ:**
1. Lấy profile user từ cookie `profile_user`
2. Decode Base64 profile
3. Parse JSON profile
4. Trả về role của user

**Các role có thể:**
- `'admin'`: Quản trị viên
- `'user'`: User thường
- `'guest'`: Khách
- `null`: Không có role

### Bước 3: Debug logging

```javascript
console.log('RequireAdminAuth check:', {
    isLoggedIn,        // true/false
    userRole,          // 'admin', 'user', 'guest', null
    isAdmin: userRole === 'admin'  // true/false
});
```

**Mục đích:**
- Theo dõi quá trình kiểm tra trong development
- Debug khi có vấn đề về authentication/authorization

### Bước 4: Kiểm tra đăng nhập

```javascript
if (!isLoggedIn) {
    console.log('❌ User not authenticated, redirecting to auth');
    
    logUserActivity('admin_access_denied', { 
        reason: 'not_authenticated',
        timestamp: new Date().toISOString()
    });
    
    return <Navigate to="/auth" replace />;
}
```

**Khi user chưa đăng nhập:**
1. Log lỗi với emoji ❌
2. Log hoạt động với reason `'not_authenticated'`
3. Redirect về `/auth` với `replace=true`

**Lưu ý:**
- `replace={true}`: Không lưu vào browser history
- User không thể back về trang admin bằng nút back

### Bước 5: Kiểm tra quyền admin

```javascript
if (userRole !== 'admin') {
    console.log('❌ User is not admin, redirecting to home');
    
    logUserActivity('admin_access_denied', { 
        reason: 'insufficient_permissions',
        userRole: userRole,
        timestamp: new Date().toISOString()
    });
    
    return <Navigate to="/" replace />;
}
```

**Khi user không phải admin:**
1. Log lỗi với emoji ❌
2. Log hoạt động với reason `'insufficient_permissions'`
3. Include `userRole` để biết role hiện tại
4. Redirect về trang chủ `/`

### Bước 6: Cho phép truy cập

```javascript
console.log('✅ Admin access granted');
logUserActivity('admin_access_granted', { 
    userRole,
    timestamp: new Date().toISOString()
});

return children;
```

**Khi user là admin:**
1. Log thành công với emoji ✅
2. Log hoạt động với action `'admin_access_granted'`
3. Render component con (`children`)

## Các scenario có thể xảy ra

### Scenario 1: User chưa đăng nhập
```
1. Truy cập /admin
2. isAuthenticated() = false
3. Log: "❌ User not authenticated"
4. Redirect: /auth
```

### Scenario 2: User đã đăng nhập nhưng không phải admin
```
1. Truy cập /admin
2. isAuthenticated() = true
3. getUserRole() = 'user'
4. Log: "❌ User is not admin"
5. Redirect: /
```

### Scenario 3: User là admin
```
1. Truy cập /admin
2. isAuthenticated() = true
3. getUserRole() = 'admin'
4. Log: "✅ Admin access granted"
5. Render: AdminDashboard
```

## Cách sử dụng

### 1. Wrap component con

```javascript
// Trong App.js hoặc router
<Route 
    path="/admin" 
    element={
        <RequireAdminAuth>
            <AdminDashboard />
        </RequireAdminAuth>
    } 
/>
```

### 2. Sử dụng với layout

```javascript
<Route 
    path="/admin/*" 
    element={
        <RequireAdminAuth>
            <AdminLayout>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UserManager />} />
                </Routes>
            </AdminLayout>
        </RequireAdminAuth>
    } 
/>
```

## Log hoạt động (Audit Trail)

### Các action được log:

1. **`admin_access_denied`** - Khi truy cập bị từ chối
   - `reason: 'not_authenticated'` - Chưa đăng nhập
   - `reason: 'insufficient_permissions'` - Không đủ quyền

2. **`admin_access_granted`** - Khi truy cập thành công
   - `userRole: 'admin'` - Role của user

### Thông tin được log:

```javascript
{
    userId: "user_id_from_profile",
    action: "admin_access_denied",
    details: {
        reason: "not_authenticated",
        timestamp: "2024-01-01T12:00:00.000Z"
    },
    timestamp: "2024-01-01T12:00:00.000Z",
    userAgent: "Mozilla/5.0...",
    url: "http://localhost:3000/admin"
}
```

## Lợi ích

1. **Bảo mật**: Ngăn truy cập trái phép
2. **UX tốt**: Redirect user về trang phù hợp
3. **Audit trail**: Theo dõi hoạt động truy cập
4. **Maintainable**: Logic tập trung ở một component
5. **Reusable**: Có thể sử dụng cho nhiều route admin

## Lưu ý quan trọng

1. **Performance**: Component chạy mỗi lần render
2. **Dependency**: Phụ thuộc vào auth utils
3. **Error handling**: Xử lý lỗi khi decode cookie
4. **Security**: Không chỉ dựa vào client-side check
5. **UX**: Có thể thêm loading state

## Mở rộng

### Thêm loading state:

```javascript
const RequireAdminAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Kiểm tra auth
        setIsLoading(false);
    }, []);
    
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    // Logic hiện tại...
};
```

### Thêm toast notification:

```javascript
import { toast } from 'react-toastify';

if (userRole !== 'admin') {
    toast.warning('Bạn không có quyền truy cập trang này!');
    return <Navigate to="/" replace />;
}
```

### Thêm multiple roles:

```javascript
const allowedRoles = ['admin', 'super_admin'];
if (!allowedRoles.includes(userRole)) {
    // Redirect
}
```

## Kết luận

`RequireAdminAuth` là một component quan trọng trong hệ thống bảo mật của ứng dụng. Nó đảm bảo chỉ admin mới có thể truy cập các trang quản trị, đồng thời cung cấp audit trail để theo dõi hoạt động truy cập. 