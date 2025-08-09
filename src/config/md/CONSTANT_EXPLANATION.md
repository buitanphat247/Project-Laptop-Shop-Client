# Constants Configuration File

## Tổng quan

File `src/config/constant.js` là một file cấu hình chứa tất cả các hằng số, dữ liệu mẫu và cấu hình được sử dụng trong toàn bộ ứng dụng. File này tập trung tất cả dữ liệu tĩnh để dễ quản lý và bảo trì.

## Mục đích

1. **Centralized Configuration**: Tập trung tất cả constants ở một nơi
2. **Dashboard Data**: Cung cấp dữ liệu cho các dashboard cards
3. **Sample Data**: Dữ liệu mẫu cho demo và testing
4. **Image URLs**: URLs cho hình ảnh mặc định và fallback
5. **Utility Functions**: Các hàm tiện ích

## Cấu trúc file

### 1. Import statements

```javascript
import { Space, Tag } from 'antd';
import React from 'react';
import { Eye, DollarSign, Clock, Users, Package, ShoppingCart, FileText } from "lucide-react";
```

**Giải thích:**
- `antd`: Ant Design components cho UI
- `React`: Cần thiết cho JSX elements
- `lucide-react`: Icon library cho dashboard cards

### 2. Dashboard Cards Data

#### User Management Cards

```javascript
export const DASHBOARD_USER_CARDS_DATA = [
    {
        title: "Total Users",        // Tiêu đề card
        icon: <Users size={16} />,   // Icon Users từ lucide-react
        value: "2,450",              // Giá trị hiển thị
        change: 12.5                 // Phần trăm thay đổi
    },
    // ...
];
```

**Các metrics:**
- **Total Users**: Tổng số người dùng
- **Active Users**: Người dùng đang hoạt động
- **New Users**: Người dùng mới đăng ký

#### Product Management Cards

```javascript
export const DASHBOARD_PRODUCT_CARDS_DATA = [
    {
        title: "Total Products",
        icon: <Package size={16} />,
        value: "1,250",
        change: 15.8
    },
    // ...
];
```

**Các metrics:**
- **Total Products**: Tổng số sản phẩm
- **Revenue**: Doanh thu từ sản phẩm
- **Stock Items**: Số lượng tồn kho

#### Order Management Cards

```javascript
export const DASHBOARD_ORDER_CARDS_DATA = [
    {
        title: "Total Orders",
        icon: <ShoppingCart size={16} />,
        value: "3,120",
        change: 18.9
    },
    // ...
];
```

**Các metrics:**
- **Total Orders**: Tổng số đơn hàng
- **Order Revenue**: Doanh thu từ đơn hàng
- **Pending Orders**: Đơn hàng đang chờ xử lý

#### News Management Cards

```javascript
export const DASHBOARD_NEWS_CARDS_DATA = [
    {
        title: "Total Articles",
        icon: <FileText size={16} />,
        value: "245",
        change: 18.7
    },
    // ...
];
```

**Các metrics:**
- **Total Articles**: Tổng số bài viết
- **Published**: Bài viết đã xuất bản
- **Draft Articles**: Bài viết nháp

#### Default Cards

```javascript
export const DASHBOARD_DEFAULT_CARDS_DATA = [
    {
        title: "Page Views",
        icon: <Eye size={16} />,
        value: "12,450",
        change: 15.8
    },
    // ...
];
```

**Các metrics:**
- **Page Views**: Lượt xem trang
- **Total Revenue**: Tổng doanh thu
- **Bounce Rate**: Tỷ lệ thoát

### 3. Image Constants

```javascript
export const DEFAULT_IMAGE = "https://via.placeholder.com/600x600?text=No+Image";
export const FALLBACK_IMAGE = "https://cdn.tgdd.vn/Products/Images/44/309016/msi-gaming-gf63-thin-12ucx-i5-841vn-1-600x600.jpg";
```

**Mục đích:**
- `DEFAULT_IMAGE`: Hình ảnh mặc định khi không có ảnh
- `FALLBACK_IMAGE`: Hình ảnh thay thế khi ảnh gốc bị lỗi

### 4. Sample Reviews Data

```javascript
export const SAMPLE_REVIEWS = [
    {
        id: 1,
        name: 'Anh Tuấn',
        avatar: 'A',
        rating: 5,
        comment: 'Sản phẩm rất tốt, giao hàng nhanh...',
        time: '2 ngày trước',
        bgColor: 'bg-blue-500'
    },
    // ...
];
```

**Cấu trúc review:**
- `id`: ID duy nhất
- `name`: Tên người đánh giá
- `avatar`: Chữ cái đầu cho avatar
- `rating`: Số sao (1-5)
- `comment`: Nội dung đánh giá
- `time`: Thời gian đánh giá
- `bgColor`: Màu nền cho avatar

### 5. Service Features Data

```javascript
export const SERVICE_FEATURES = [
    { icon: 'SafetyCertificateOutlined', color: 'text-green-600', title: 'Bảo hành', desc: '24 tháng' },
    { icon: 'TruckOutlined', color: 'text-blue-600', title: 'Miễn phí', desc: 'Giao hàng' },
    // ...
];
```

**Các dịch vụ:**
- **Bảo hành**: 24 tháng
- **Miễn phí giao hàng**
- **Đổi trả**: 7 ngày
- **Hỗ trợ**: 24/7
- **Trả góp**: 0% lãi suất
- **Giao nhanh**: 2 giờ

### 6. Rating Data

```javascript
export const RATING_DATA = [
    { star: 5, count: 89, percentage: 70 },
    { star: 4, count: 26, percentage: 20 },
    // ...
];
```

**Cấu trúc rating:**
- `star`: Số sao (1-5)
- `count`: Số lượng đánh giá
- `percentage`: Phần trăm trong tổng số

### 7. Dashboard Cards Data Map

```javascript
export const DASHBOARD_CARDS_DATA_MAP = {
    user: DASHBOARD_USER_CARDS_DATA,        // Data cho User Management
    product: DASHBOARD_PRODUCT_CARDS_DATA,  // Data cho Product Management
    order: DASHBOARD_ORDER_CARDS_DATA,      // Data cho Order Management
    news: DASHBOARD_NEWS_CARDS_DATA,        // Data cho News Management
    default: DASHBOARD_DEFAULT_CARDS_DATA,  // Data mặc định
};
```

**Mục đích:** Mapping để lấy đúng dữ liệu cho từng module

### 8. Utility Functions

```javascript
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const statsData = {
    totalRoutes: getRandomInt(100, 500),      // Tổng số routes
    activeRoutes: getRandomInt(100, 300),     // Routes đang hoạt động
    totalPermissions: getRandomInt(200, 100), // Tổng số permissions
    adminUsers: getRandomInt(100, 200),       // Số admin users
    regularUsers: getRandomInt(100, 300)      // Số regular users
};
```

**Functions:**
- `getRandomInt()`: Tạo số ngẫu nhiên trong khoảng
- `statsData`: Dữ liệu thống kê mẫu

## Cách sử dụng

### 1. Import và sử dụng dashboard data

```javascript
import { DASHBOARD_CARDS_DATA_MAP } from '../config/constant';

// Lấy data cho user management
const userData = DASHBOARD_CARDS_DATA_MAP.user;

// Lấy data cho product management
const productData = DASHBOARD_CARDS_DATA_MAP.product;
```

### 2. Sử dụng sample reviews

```javascript
import { SAMPLE_REVIEWS } from '../config/constant';

// Hiển thị danh sách reviews
SAMPLE_REVIEWS.map(review => (
    <ReviewCard key={review.id} review={review} />
));
```

### 3. Sử dụng image constants

```javascript
import { DEFAULT_IMAGE, FALLBACK_IMAGE } from '../config/constant';

// Sử dụng khi không có ảnh
<img src={product.image || DEFAULT_IMAGE} alt="Product" />

// Sử dụng khi ảnh bị lỗi
<img 
    src={product.image} 
    onError={(e) => e.target.src = FALLBACK_IMAGE} 
    alt="Product" 
/>
```

### 4. Sử dụng service features

```javascript
import { SERVICE_FEATURES } from '../config/constant';

// Hiển thị danh sách dịch vụ
SERVICE_FEATURES.map(feature => (
    <ServiceFeature key={feature.title} feature={feature} />
));
```

### 5. Sử dụng rating data

```javascript
import { RATING_DATA } from '../config/constant';

// Hiển thị biểu đồ rating
RATING_DATA.map(rating => (
    <RatingBar key={rating.star} rating={rating} />
));
```

## Lợi ích

1. **Centralized Management**: Tất cả constants ở một nơi
2. **Easy Maintenance**: Dễ bảo trì và cập nhật
3. **Consistency**: Đảm bảo tính nhất quán
4. **Reusability**: Có thể tái sử dụng ở nhiều nơi
5. **Type Safety**: JSDoc comments giúp IDE hiểu rõ cấu trúc

## Best Practices

### 1. Naming Convention

```javascript
// Tốt: UPPER_SNAKE_CASE cho constants
export const DASHBOARD_USER_CARDS_DATA = [...];

// Không tốt: camelCase cho constants
export const dashboardUserCardsData = [...];
```

### 2. JSDoc Comments

```javascript
/**
 * Dashboard Card Data cho User Management
 * 
 * @type {Array} - Mảng chứa các object card data
 */
export const DASHBOARD_USER_CARDS_DATA = [...];
```

### 3. Grouping Related Data

```javascript
// Nhóm các data liên quan
export const DASHBOARD_CARDS_DATA_MAP = {
    user: DASHBOARD_USER_CARDS_DATA,
    product: DASHBOARD_PRODUCT_CARDS_DATA,
    // ...
};
```

### 4. Default Values

```javascript
// Cung cấp giá trị mặc định
export const DEFAULT_IMAGE = "https://via.placeholder.com/600x600?text=No+Image";
```

## Cải tiến có thể thực hiện

### 1. Thêm TypeScript

```typescript
interface DashboardCard {
    title: string;
    icon: React.ReactNode;
    value: string | number;
    change: number;
}

export const DASHBOARD_USER_CARDS_DATA: DashboardCard[] = [...];
```

### 2. Thêm Environment Variables

```javascript
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030';
export const IMAGE_CDN_URL = process.env.REACT_APP_CDN_URL || 'https://cdn.example.com';
```

### 3. Thêm Validation

```javascript
const validateCardData = (data) => {
    return data.every(card => 
        card.title && 
        card.icon && 
        card.value !== undefined && 
        typeof card.change === 'number'
    );
};
```

### 4. Thêm Localization

```javascript
export const DASHBOARD_USER_CARDS_DATA = [
    {
        titleKey: "dashboard.users.total",
        icon: <Users size={16} />,
        value: "2,450",
        change: 12.5
    },
    // ...
];
```

## Kết luận

File `constant.js` là một phần quan trọng trong kiến trúc ứng dụng. Nó cung cấp:

- **Dữ liệu mẫu** cho dashboard và UI components
- **Constants** cho URLs và cấu hình
- **Utility functions** cho việc tạo dữ liệu mẫu
- **Centralized configuration** cho toàn bộ ứng dụng

**Sử dụng khi:**
- Cần dữ liệu mẫu cho demo/testing
- Cần constants cho URLs và cấu hình
- Cần centralized data management
- Cần reusable data structures

**Không sử dụng khi:**
- Dữ liệu thay đổi thường xuyên
- Cần real-time data
- Cần server-side validation
- Cần user-specific data 