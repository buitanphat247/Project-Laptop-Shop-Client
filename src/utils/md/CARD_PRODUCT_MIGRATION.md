# CardProduct.js Migration to Utils

## Tổng quan

File `src/components/card/CardProduct.js` đã được refactor để tách các hàm tiện ích sang thư mục `utils`. Điều này giúp tái sử dụng code và dễ bảo trì hơn.

## Các hàm đã được tách

### 1. `formatPrice()` → `src/utils/formatUtils.js`

**Trước:**
```javascript
// Trong CardProduct.js
const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return numPrice.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
};
```

**Sau:**
```javascript
// Trong src/utils/formatUtils.js
export const formatPrice = (price, currency = 'VND', locale = 'vi-VN') => {
    const numPrice = Number(price) || 0;
    return numPrice.toLocaleString(locale, {
        style: 'currency',
        currency: currency
    });
};
```

**Cải tiến:**
- Thêm parameters `currency` và `locale` để linh hoạt hơn
- Có thể sử dụng cho nhiều loại tiền tệ khác nhau
- JSDoc documentation chi tiết

### 2. `getStockStatus()` → `src/utils/productUtils.js`

**Trước:**
```javascript
// Trong CardProduct.js
const getStockStatus = () => {
    if (stock === 0) {
        return { text: 'Hết hàng', color: 'bg-red-500', textColor: 'text-red-500' };
    } else if (stock <= 5) {
        return { text: `Còn ${stock} sản phẩm`, color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    } else if (stock <= 10) {
        return { text: `Còn ${stock} sản phẩm`, color: 'bg-orange-500', textColor: 'text-orange-600' };
    } else {
        return { text: `Còn ${stock} sản phẩm`, color: 'bg-green-500', textColor: 'text-green-600' };
    }
};
```

**Sau:**
```javascript
// Trong src/utils/productUtils.js
export const getStockStatus = (stock) => {
    if (stock === 0) {
        return { 
            text: 'Hết hàng', 
            color: 'bg-red-500', 
            textColor: 'text-red-500',
            status: 'out_of_stock'
        };
    } else if (stock <= 5) {
        return { 
            text: `Còn ${stock} sản phẩm`, 
            color: 'bg-yellow-500', 
            textColor: 'text-yellow-600',
            status: 'low_stock'
        };
    } else if (stock <= 10) {
        return { 
            text: `Còn ${stock} sản phẩm`, 
            color: 'bg-orange-500', 
            textColor: 'text-orange-600',
            status: 'medium_stock'
        };
    } else {
        return { 
            text: `Còn ${stock} sản phẩm`, 
            color: 'bg-green-500', 
            textColor: 'text-green-600',
            status: 'in_stock'
        };
    }
};
```

**Cải tiến:**
- Thêm parameter `stock` để có thể tái sử dụng
- Thêm field `status` để dễ xử lý logic
- Có thể sử dụng cho nhiều component khác

### 3. `generateProductUrl()` → `src/utils/productUtils.js`

**Trước:**
```javascript
// Trong CardProduct.js
const productUrl = `/product/${id || '1354'}`;
```

**Sau:**
```javascript
// Trong src/utils/productUtils.js
export const generateProductUrl = (productId, basePath = '/product') => {
    const id = productId || '1354';
    return `${basePath}/${id}`;
};
```

**Cải tiến:**
- Tách thành hàm riêng biệt
- Thêm parameter `basePath` để linh hoạt
- Có thể tái sử dụng cho nhiều loại URL

## Cách sử dụng mới

### Trong CardProduct.js

```javascript
import React from "react";
import { NavLink } from "react-router-dom";
import { FaEye, FaUser, FaClock } from "react-icons/fa";
// Import các hàm tiện ích từ utils
import { formatPrice, getStockStatus, generateProductUrl } from "../../utils";

const CardProduct = ({
    id,
    name = "Tên sản phẩm",
    imageUrl = "https://via.placeholder.com/300x240?text=No+Image",
    price = 0,
    stock = 0,
    category,
    desc,
}) => {
    // Generate product URL sử dụng hàm từ utils
    const productUrl = generateProductUrl(id);

    // Get stock status sử dụng hàm từ utils
    const stockStatus = getStockStatus(stock);

    return (
        <div className="bg-white cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 group">
            {/* ... rest of component ... */}
            
            {/* Price Section */}
            <div>
                <div className="text-red-600 font-bold text-xl">
                    {formatPrice(price)} {/* Sử dụng hàm từ utils */}
                </div>
            </div>

            {/* Stock info */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stockStatus.color}`}></div>
                <span className={`text-xs font-medium ${stockStatus.textColor}`}>
                    {stockStatus.text}
                </span>
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
import { formatPrice, getStockStatus } from "../../utils";

// Trong ProductDetail.js
const ProductDetail = ({ product }) => {
    return (
        <div>
            <h2>{product.name}</h2>
            <p>{formatPrice(product.price)}</p>
            <span>{getStockStatus(product.stock).text}</span>
        </div>
    );
};

// Trong ProductList.js
const ProductList = ({ products }) => {
    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <p>{formatPrice(product.price)}</p>
                    <span>{getStockStatus(product.stock).text}</span>
                </div>
            ))}
        </div>
    );
};
```

### 2. **Maintainability (Dễ bảo trì)**
```javascript
// Chỉ cần sửa một chỗ trong utils
export const formatPrice = (price, currency = 'VND', locale = 'vi-VN') => {
    // Logic mới ở đây
    // Tất cả component sử dụng sẽ tự động cập nhật
};
```

### 3. **Testing (Dễ test)**
```javascript
// Có thể test riêng từng hàm
import { formatPrice, getStockStatus } from '../utils/formatUtils';

describe('formatPrice', () => {
    test('should format price correctly', () => {
        expect(formatPrice(1500000)).toBe('1.500.000 ₫');
        expect(formatPrice(0)).toBe('0 ₫');
    });
});

describe('getStockStatus', () => {
    test('should return correct status for out of stock', () => {
        const result = getStockStatus(0);
        expect(result.text).toBe('Hết hàng');
        expect(result.status).toBe('out_of_stock');
    });
});
```

### 4. **Type Safety (An toàn kiểu dữ liệu)**
```javascript
// JSDoc comments giúp IDE hiểu rõ kiểu dữ liệu
/**
 * @param {number} stock - Số lượng tồn kho
 * @returns {object} - Object chứa thông tin trạng thái
 */
export const getStockStatus = (stock) => {
    // ...
};
```

## Các hàm bổ sung trong utils

### FormatUtils.js
- `formatNumber()` - Format số với dấu phẩy
- `formatPercentage()` - Format phần trăm
- `formatDate()` - Format ngày tháng
- `formatTimeAgo()` - Format thời gian tương đối
- `formatFileSize()` - Format kích thước file
- `formatPhone()` - Format số điện thoại
- `formatCode()` - Format mã code

### ProductUtils.js
- `generateCategoryUrl()` - Tạo URL danh mục
- `isInStock()` - Kiểm tra còn hàng
- `isLowStock()` - Kiểm tra sắp hết hàng
- `getProductDisplayStatus()` - Trạng thái hiển thị sản phẩm
- `calculateDiscountedPrice()` - Tính giá sau giảm
- `calculateDiscountPercent()` - Tính phần trăm giảm
- `getDiscountInfo()` - Thông tin giảm giá
- `sortProducts()` - Sắp xếp sản phẩm
- `filterProducts()` - Lọc sản phẩm

## Best Practices

### 1. Import từ utils
```javascript
// Tốt: Import từ utils
import { formatPrice, getStockStatus } from "../../utils";

// Không tốt: Import trực tiếp từ file cụ thể
import { formatPrice } from "../../utils/formatUtils";
```

### 2. Sử dụng JSDoc
```javascript
/**
 * Format giá tiền theo định dạng VND
 * @param {number|string} price - Giá tiền cần format
 * @returns {string} - Giá tiền đã được format
 */
export const formatPrice = (price) => {
    // ...
};
```

### 3. Default parameters
```javascript
// Cung cấp giá trị mặc định
export const generateProductUrl = (productId, basePath = '/product') => {
    const id = productId || '1354';
    return `${basePath}/${id}`;
};
```

### 4. Error handling
```javascript
export const formatPrice = (price, currency = 'VND', locale = 'vi-VN') => {
    const numPrice = Number(price) || 0; // Xử lý giá trị không hợp lệ
    return numPrice.toLocaleString(locale, {
        style: 'currency',
        currency: currency
    });
};
```

## Kết luận

Việc tách các hàm từ `CardProduct.js` sang `utils` mang lại nhiều lợi ích:

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