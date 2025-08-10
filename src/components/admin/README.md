# Admin Device Detection System

## 📱 Tổng quan

Hệ thống này đảm bảo rằng Admin Panel chỉ hiển thị và hoạt động tốt nhất trên Desktop (màn hình >= 1024px).

## 🔧 Components

### 1. `MobileAdminRedirect.js`
- **Chức năng**: Redirect mobile/tablet users khỏi admin routes
- **Cách hoạt động**: 
  - Detect device type
  - Nếu không phải desktop → hiển thị thông báo và redirect sau 3 giây
  - Nếu là desktop → hiển thị admin panel bình thường

### 2. `DesktopOnlyRoute.js`
- **Chức năng**: Wrapper component để chỉ hiển thị content trên desktop
- **Props**:
  - `children`: Content cần hiển thị
  - `fallback`: Component thay thế cho mobile/tablet (optional)

### 3. `AdminDeviceWarning.js`
- **Chức năng**: Hiển thị cảnh báo khi user truy cập admin trên mobile
- **Sử dụng**: Có thể thêm vào header hoặc navigation

## 🛠️ Hooks & Utils

### 1. `useDeviceDetection.js`
```javascript
const { deviceType, screenSize, isDesktop, isTablet, isMobile } = useDeviceDetection();
```

### 2. `deviceUtils.js`
```javascript
import { isDesktop, isTablet, isMobile, BREAKPOINTS } from '../utils/deviceUtils';
```

## 📏 Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: >= 1024px

## 🚀 Cách sử dụng

### 1. Trong Routes (App.js)
```javascript
<Route path="/admin" element={
  <RequireAdminAuth>
    <MobileAdminRedirect>
      <AdminLayout />
    </MobileAdminRedirect>
  </RequireAdminAuth>
}>
  {/* Admin routes */}
</Route>
```

### 2. Trong Components
```javascript
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

const MyComponent = () => {
  const { isDesktop, deviceType } = useDeviceDetection();
  
  if (!isDesktop) {
    return <div>Chỉ khả dụng trên Desktop</div>;
  }
  
  return <div>Admin Content</div>;
};
```

### 3. Conditional Rendering
```javascript
import DesktopOnlyRoute from './DesktopOnlyRoute';

<DesktopOnlyRoute>
  <AdminPanel />
</DesktopOnlyRoute>
```

## 🎯 Tính năng

- ✅ **Auto Redirect**: Tự động chuyển hướng mobile/tablet users
- ✅ **Responsive Detection**: Detect real-time khi resize window
- ✅ **User Friendly**: Hiển thị thông báo rõ ràng
- ✅ **Flexible**: Có thể customize fallback component
- ✅ **Performance**: Optimized với useEffect cleanup

## 🔄 Cập nhật

Để thay đổi breakpoints, cập nhật trong:
- `src/utils/deviceUtils.js`
- `src/hooks/useDeviceDetection.js`

## 📱 Testing

1. **Desktop**: Mở DevTools → Responsive → Desktop
2. **Tablet**: Mở DevTools → Responsive → iPad
3. **Mobile**: Mở DevTools → Responsive → iPhone

## 🎨 Customization

### Thay đổi thông báo
```javascript
// Trong MobileAdminRedirect.js
title="Admin Panel chỉ khả dụng trên Desktop"
subTitle="Đang chuyển hướng về trang chủ..."
```

### Thay đổi thời gian redirect
```javascript
// Trong MobileAdminRedirect.js
setTimeout(() => {
  navigate('/', { replace: true });
}, 3000); // Thay đổi 3000ms
```



