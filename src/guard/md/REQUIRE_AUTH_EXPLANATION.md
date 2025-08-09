# RequireAuth - Route Guard Component

## Tổng quan

File `src/guard/RequireAuth.js` là một **Route Guard Component** đơn giản trong React Router. Nó bảo vệ các route yêu cầu đăng nhập bằng cách kiểm tra access token trong cookie trước khi render component con.

## Mục đích

1. **Bảo mật**: Ngăn user chưa đăng nhập truy cập vào trang private
2. **Authentication**: Kiểm tra user đã đăng nhập chưa
3. **UX**: Redirect user về trang auth khi chưa đăng nhập
4. **State Preservation**: Lưu lại trang hiện tại để redirect back sau khi login

## So sánh với RequireAdminAuth

| Tính năng | RequireAuth | RequireAdminAuth |
|-----------|-------------|------------------|
| **Kiểm tra đăng nhập** | ✅ | ✅ |
| **Kiểm tra role** | ❌ | ✅ |
| **Log hoạt động** | ❌ | ✅ |
| **Redirect khi chưa login** | `/auth` | `/auth` |
| **Redirect khi không đủ quyền** | N/A | `/` |
| **State preservation** | ✅ | ❌ |

## Cấu trúc component

### 1. Import statements

```javascript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
```

**Giải thích:**
- `React`: Cần thiết cho functional component
- `Navigate`: Component từ React Router để redirect
- `useLocation`: Hook để lấy thông tin location hiện tại

### 2. getCookie function

```javascript
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return '';
}
```

**Cách hoạt động:**
1. Tạo chuỗi tìm kiếm với format `"; name=value"`
2. Tách chuỗi theo pattern `"; name="`
3. Nếu tìm thấy (parts.length === 2), lấy giá trị
4. Trả về chuỗi rỗng nếu không tìm thấy

**Ví dụ:**
```javascript
// document.cookie = "accessToken=abc123; profile_user=xyz"
getCookie('accessToken') // Returns: "abc123"
getCookie('profile_user') // Returns: "xyz"
getCookie('nonexistent') // Returns: ""
```

### 3. RequireAuth component

```javascript
function RequireAuth({ children }) {
  const accessToken = getCookie('accessToken');
  const isLoggedIn = !!accessToken;
  const location = useLocation();
  
  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return children;
}
```

**Props:**
- `children`: Components con cần được bảo vệ

**Returns:**
- `children`: Nếu đã đăng nhập
- `<Navigate>`: Redirect component nếu chưa đăng nhập

## Luồng hoạt động chi tiết

### Bước 1: Lấy access token

```javascript
const accessToken = getCookie('accessToken');
```

**Hàm `getCookie('accessToken')` sẽ:**
1. Tìm cookie có tên 'accessToken'
2. Trả về giá trị token hoặc chuỗi rỗng
3. Không kiểm tra token có hợp lệ không (chỉ kiểm tra tồn tại)

### Bước 2: Kiểm tra trạng thái đăng nhập

```javascript
const isLoggedIn = !!accessToken;
```

**Toán tử `!!` sẽ convert:**
- `""` (chuỗi rỗng) → `false`
- `"abc123"` (token hợp lệ) → `true`
- `null` → `false`
- `undefined` → `false`

### Bước 3: Lấy thông tin location

```javascript
const location = useLocation();
```

**`useLocation()` trả về object:**
```javascript
{
  pathname: "/profile",           // Đường dẫn hiện tại
  search: "?tab=settings",        // Query parameters
  hash: "#section1",              // Fragment identifier
  state: { from: "/previous" }    // State từ navigation trước
}
```

### Bước 4: Kiểm tra và redirect

```javascript
if (!isLoggedIn) {
  return <Navigate to="/auth" state={{ from: location }} replace />;
}
```

**Khi user chưa đăng nhập:**
1. Redirect về `/auth`
2. Truyền location hiện tại qua `state`
3. Sử dụng `replace={true}` để không lưu vào history

### Bước 5: Cho phép truy cập

```javascript
return children;
```

**Khi user đã đăng nhập:**
- Render component con (`children`)

## Các scenario có thể xảy ra

### Scenario 1: User chưa đăng nhập
```
1. Truy cập /profile
2. getCookie('accessToken') = ""
3. isLoggedIn = false
4. Redirect: /auth với state={from: "/profile"}
```

### Scenario 2: User đã đăng nhập
```
1. Truy cập /profile
2. getCookie('accessToken') = "abc123"
3. isLoggedIn = true
4. Render: Profile component
```

### Scenario 3: User login thành công và redirect back
```
1. User truy cập /profile (chưa login)
2. Redirect về /auth với state={from: "/profile"}
3. User login thành công
4. Auth page redirect về /profile (từ state.from)
```

## Cách sử dụng

### 1. Wrap component con

```javascript
// Trong App.js hoặc router
<Route 
    path="/profile" 
    element={
        <RequireAuth>
            <Profile />
        </RequireAuth>
    } 
/>
```

### 2. Sử dụng với layout

```javascript
<Route 
    path="/dashboard/*" 
    element={
        <RequireAuth>
            <DashboardLayout>
                <Routes>
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </DashboardLayout>
        </RequireAuth>
    } 
/>
```

### 3. Sử dụng với nested routes

```javascript
<Route 
    path="/user" 
    element={
        <RequireAuth>
            <UserLayout />
        </RequireAuth>
    }
>
    <Route path="profile" element={<Profile />} />
    <Route path="orders" element={<Orders />} />
    <Route path="settings" element={<Settings />} />
</Route>
```

## State preservation (Lưu trạng thái)

### Cách hoạt động:

1. **User truy cập trang private** (ví dụ: `/profile`)
2. **RequireAuth redirect** về `/auth` với `state={{ from: "/profile" }}`
3. **Auth page nhận state** và lưu lại
4. **User login thành công**
5. **Auth page redirect** về trang gốc từ `state.from`

### Code trong Auth page:

```javascript
// Trong SignIn.js
import { useLocation, useNavigate } from 'react-router-dom';

function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    // Redirect về trang gốc hoặc trang chủ
    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  };
  
  return (
    // Login form
  );
}
```

## Lợi ích

1. **Đơn giản**: Logic kiểm tra đơn giản, dễ hiểu
2. **Nhẹ**: Không có log hoạt động, không kiểm tra role
3. **State preservation**: Lưu lại trang hiện tại để redirect back
4. **Performance**: Chỉ kiểm tra cookie, không decode token
5. **Reusable**: Có thể sử dụng cho nhiều route private

## Hạn chế

1. **Không kiểm tra token validity**: Chỉ kiểm tra tồn tại, không kiểm tra JWT expiration
2. **Không có audit trail**: Không log hoạt động truy cập
3. **Không kiểm tra role**: Không phân biệt user/admin
4. **Client-side only**: Không có server-side validation

## Cải tiến có thể thực hiện

### 1. Thêm token validation:

```javascript
import { isAuthenticated } from '../utils/auth';

function RequireAuth({ children }) {
  const isLoggedIn = isAuthenticated(); // Thay vì !!getCookie('accessToken')
  // ...
}
```

### 2. Thêm loading state:

```javascript
import { useState, useEffect } from 'react';

function RequireAuth({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie('accessToken');
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Logic hiện tại...
}
```

### 3. Thêm toast notification:

```javascript
import { toast } from 'react-toastify';

if (!isLoggedIn) {
  toast.info('Vui lòng đăng nhập để truy cập trang này!');
  return <Navigate to="/auth" state={{ from: location }} replace />;
}
```

### 4. Thêm debug logging:

```javascript
function RequireAuth({ children }) {
  const accessToken = getCookie('accessToken');
  const isLoggedIn = !!accessToken;
  
  console.log('RequireAuth check:', {
    hasToken: !!accessToken,
    isLoggedIn,
    currentPath: window.location.pathname
  });
  
  // Logic hiện tại...
}
```

## So sánh với các approach khác

### 1. vs localStorage:

```javascript
// localStorage approach
const token = localStorage.getItem('accessToken');

// Cookie approach (hiện tại)
const token = getCookie('accessToken');
```

**Ưu điểm cookie:**
- Tự động gửi với mọi request
- Có thể set httpOnly để bảo mật
- Có thể set expiration

### 2. vs Context API:

```javascript
// Context approach
const { isAuthenticated } = useAuth();

// Direct cookie check (hiện tại)
const isLoggedIn = !!getCookie('accessToken');
```

**Ưu điểm direct check:**
- Đơn giản, không cần setup context
- Luôn cập nhật với cookie mới nhất
- Không có dependency

## Kết luận

`RequireAuth` là một component đơn giản nhưng hiệu quả để bảo vệ các route private. Nó phù hợp cho các ứng dụng có yêu cầu authentication cơ bản, không cần kiểm tra role phức tạp hay audit trail chi tiết.

**Sử dụng khi:**
- Chỉ cần kiểm tra đăng nhập
- Không cần phân quyền theo role
- Muốn đơn giản, nhẹ
- Cần state preservation

**Không sử dụng khi:**
- Cần kiểm tra role admin
- Cần audit trail
- Cần kiểm tra token validity
- Cần loading state 