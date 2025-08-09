# NewsCard.js Migration to Utils

## Tổng quan

File `src/components/card/NewsCard.js` đã được refactor để tách các hàm tiện ích sang thư mục `utils`. Điều này giúp tái sử dụng code và dễ bảo trì hơn.

## Các hàm đã được tách

### 1. `formatDate()` → `src/utils/newsUtils.js` (đổi tên thành `formatNewsDate`)

**Trước:**
```javascript
// Trong NewsCard.js
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
```

**Sau:**
```javascript
// Trong src/utils/newsUtils.js
export const formatNewsDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
```

**Cải tiến:**
- Đổi tên thành `formatNewsDate` để rõ ràng hơn
- JSDoc documentation chi tiết
- Có thể sử dụng cho nhiều component khác

### 2. `getAuthorName()` → `src/utils/newsUtils.js`

**Trước:**
```javascript
// Trong NewsCard.js
const getAuthorName = () => {
    if (typeof author === 'string') return author;
    if (author && author.fullName) return author.fullName;
    return 'Admin';
};
```

**Sau:**
```javascript
// Trong src/utils/newsUtils.js
export const getAuthorName = (author) => {
    if (typeof author === 'string') return author;
    if (author && author.fullName) return author.fullName;
    return 'Admin';
};
```

**Cải tiến:**
- Thêm parameter `author` để có thể tái sử dụng
- JSDoc documentation chi tiết
- Có thể sử dụng cho nhiều component khác

### 3. `generateViewCount()` → `src/utils/newsUtils.js`

**Trước:**
```javascript
// Trong NewsCard.js
const generateViewCount = () => {
    if (!id) return 0;
    const seed = parseInt(id) || 1;
    return Math.floor(Math.random() * seed * 100) + 50;
};
```

**Sau:**
```javascript
// Trong src/utils/newsUtils.js
export const generateViewCount = (id) => {
    if (!id) return 0;
    const seed = parseInt(id) || 1;
    return Math.floor(Math.random() * seed * 100) + 50;
};
```

**Cải tiến:**
- Thêm parameter `id` để có thể tái sử dụng
- JSDoc documentation chi tiết
- Có thể sử dụng cho nhiều component khác

### 4. `formatViewCount()` → `src/utils/newsUtils.js`

**Trước:**
```javascript
// Trong NewsCard.js
const formatViewCount = (count) => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
};
```

**Sau:**
```javascript
// Trong src/utils/newsUtils.js
export const formatViewCount = (count) => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
};
```

**Cải tiến:**
- JSDoc documentation chi tiết
- Có thể sử dụng cho nhiều component khác

### 5. `generateNewsUrl()` → `src/utils/newsUtils.js`

**Trước:**
```javascript
// Trong NewsCard.js
const newsUrl = slug ? `/news/${slug}` : `/news/${id || '1'}`;
```

**Sau:**
```javascript
// Trong src/utils/newsUtils.js
export const generateNewsUrl = (id, slug, basePath = '/news') => {
    if (slug) {
        return `${basePath}/${slug}`;
    }
    return `${basePath}/${id || '1'}`;
};
```

**Cải tiến:**
- Tách thành hàm riêng biệt
- Thêm parameter `basePath` để linh hoạt
- Có thể tái sử dụng cho nhiều loại URL

## Cách sử dụng mới

### Trong NewsCard.js

```javascript
import React from "react";
import { NavLink } from "react-router-dom";
import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
// Import các hàm tiện ích từ utils
import { 
    generateNewsUrl, 
    formatNewsDate, 
    getAuthorName, 
    generateViewCount, 
    formatViewCount 
} from "../../utils";

const NewsCard = ({
    id,
    title = "Tiêu đề tin tức",
    slug,
    desc = "Tóm tắt nội dung bài viết...",
    thumbnail = "https://caodem.com/wp-content/uploads/2019/12/phong-nen-tin-tuc-thoi-su-caodem.com_.jpg",
    createdAt,
    author = { fullName: "Admin" },
    published = true,
}) => {
    // Generate news URL sử dụng hàm từ utils
    const newsUrl = generateNewsUrl(id, slug);

    // Format date sử dụng hàm từ utils
    const formatDate = formatNewsDate;

    // Get author name sử dụng hàm từ utils
    const getAuthorNameFromProps = () => getAuthorName(author);

    // Generate random view count sử dụng hàm từ utils
    const generateViewCountFromProps = () => generateViewCount(id);

    // Format view count sử dụng hàm từ utils
    const formatViewCountFromProps = formatViewCount;

    const viewCount = generateViewCountFromProps();

    return (
        <div className="bg-white cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 group">
            {/* ... rest of component ... */}
            
            {/* Meta Info Section */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                        <UserOutlined />
                        <span>{getAuthorNameFromProps()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CalendarOutlined />
                        <span>{formatDate(createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* View count */}
            <div className="flex items-center gap-1 text-gray-400 text-xs">
                <EyeOutlined />
                <span>{formatViewCountFromProps(viewCount)} lượt xem</span>
            </div>
            
            {/* ... rest of component ... */}
        </div>
    );
};
```

## Lợi ích của việc tách

### 1. **Reusability (Tái sử dụng)**
```javascript
// Có thể sử dụng trong nhiều component khác
import { formatNewsDate, getAuthorName, generateViewCount } from "../../utils";

// Trong NewsDetail.js
const NewsDetail = ({ news }) => {
    return (
        <div>
            <h2>{news.title}</h2>
            <p>Ngày: {formatNewsDate(news.createdAt)}</p>
            <p>Tác giả: {getAuthorName(news.author)}</p>
            <p>Lượt xem: {generateViewCount(news.id)}</p>
        </div>
    );
};

// Trong NewsList.js
const NewsList = ({ newsList }) => {
    return (
        <div>
            {newsList.map(news => (
                <div key={news.id}>
                    <p>Ngày: {formatNewsDate(news.createdAt)}</p>
                    <p>Tác giả: {getAuthorName(news.author)}</p>
                </div>
            ))}
        </div>
    );
};
```

### 2. **Maintainability (Dễ bảo trì)**
```javascript
// Chỉ cần sửa một chỗ trong utils
export const formatNewsDate = (dateString) => {
    // Logic mới ở đây
    // Tất cả component sử dụng sẽ tự động cập nhật
};
```

### 3. **Testing (Dễ test)**
```javascript
// Có thể test riêng từng hàm
import { formatNewsDate, getAuthorName, generateViewCount } from '../utils/newsUtils';

describe('formatNewsDate', () => {
    test('should format date correctly', () => {
        expect(formatNewsDate('2024-12-25')).toBe('25 tháng 12 năm 2024');
        expect(formatNewsDate(null)).toBe('N/A');
    });
});

describe('getAuthorName', () => {
    test('should return author name from object', () => {
        expect(getAuthorName({ fullName: 'John Doe' })).toBe('John Doe');
    });
    
    test('should return author name from string', () => {
        expect(getAuthorName('John Doe')).toBe('John Doe');
    });
    
    test('should return default name', () => {
        expect(getAuthorName(null)).toBe('Admin');
    });
});
```

### 4. **Type Safety (An toàn kiểu dữ liệu)**
```javascript
// JSDoc comments giúp IDE hiểu rõ kiểu dữ liệu
/**
 * @param {string} dateString - Chuỗi ngày tháng
 * @returns {string} - Ngày tháng đã được format
 */
export const formatNewsDate = (dateString) => {
    // ...
};
```

## Các hàm bổ sung trong newsUtils.js

### NewsUtils.js
- `getPublishStatus()` - Lấy trạng thái xuất bản
- `getNewsThumbnail()` - Tạo thumbnail fallback URL
- `getNewsTitle()` - Tạo title mặc định
- `getNewsDescription()` - Tạo description mặc định
- `getAuthorObject()` - Tạo author object mặc định
- `getNewsId()` - Tạo ID mặc định
- `isNewsPublished()` - Kiểm tra trạng thái xuất bản
- `getNewsMeta()` - Tạo thông tin meta cho tin tức

## Best Practices

### 1. Import từ utils chính
```javascript
// ✅ Tốt
import { formatNewsDate, getAuthorName, generateViewCount } from '../../utils';

// ❌ Không tốt (trừ khi cần thiết)
import { formatNewsDate } from '../../utils/newsUtils';
```

### 2. Sử dụng JSDoc
```javascript
/**
 * Format ngày tháng cho tin tức
 * @param {string} dateString - Chuỗi ngày tháng
 * @returns {string} - Ngày tháng đã được format
 */
export const formatNewsDate = (dateString) => {
    // ...
};
```

### 3. Default parameters
```javascript
// Cung cấp giá trị mặc định
export const generateNewsUrl = (id, slug, basePath = '/news') => {
    if (slug) {
        return `${basePath}/${slug}`;
    }
    return `${basePath}/${id || '1'}`;
};
```

### 4. Error handling
```javascript
export const formatNewsDate = (dateString) => {
    if (!dateString) return 'N/A'; // Xử lý giá trị không hợp lệ
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
```

## Kết luận

Việc tách các hàm từ `NewsCard.js` sang `utils` mang lại nhiều lợi ích:

1. **Code reusability** - Có thể sử dụng ở nhiều nơi
2. **Easier maintenance** - Dễ bảo trì và cập nhật
3. **Better testing** - Dễ viết test cho từng hàm
4. **Type safety** - JSDoc giúp IDE hiểu rõ kiểu dữ liệu
5. **Consistency** - Đảm bảo tính nhất quán trong toàn bộ ứng dụng

**Sử dụng khi:**
- Cần tái sử dụng logic ở nhiều component
- Cần centralize business logic
- Cần dễ test và maintain

**Không sử dụng khi:**
- Logic chỉ dành riêng cho một component
- Logic quá đơn giản và không cần tái sử dụng 