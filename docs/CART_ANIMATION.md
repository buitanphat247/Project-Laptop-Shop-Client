# Cart Animation - Animation +1 khi thêm sản phẩm vào giỏ hàng

## Mô tả
Tính năng này tạo ra animation "+1" đẹp mắt khi có sản phẩm mới được thêm vào giỏ hàng. Animation sẽ xuất hiện ở góc phải trên của màn hình với hiệu ứng fade in, bounce và fade out.

## Cách hoạt động

### 1. CartAnimation Component
- **Vị trí**: Hiển thị ở góc phải trên màn hình (top-20 right-20)
- **Animation phases**:
  - **Enter**: Fade in với scale từ 0.75 → 1.0 (0.3s)
  - **Bounce**: Hiệu ứng bounce (0.7s) 
  - **Exit**: Fade out với scale từ 1.0 → 0.75 (0.3s)
- **Tổng thời gian**: 1.3 giây

### 2. CartContext Integration
- Thêm state `showAnimation` để control animation
- Hàm `addToCart()` sẽ trigger animation khi có sản phẩm mới
- Hàm `hideAnimation()` để ẩn animation sau khi hoàn thành

### 3. Header Integration
- CartAnimation được render trong Header component
- Sử dụng `showAnimation` và `hideAnimation` từ CartContext

## Sử dụng

### Trong component khác
```javascript
import { useCart } from '../context/CartContext';

const MyComponent = () => {
    const { addToCart } = useCart();
    
    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId, 1);
            // Animation sẽ tự động hiển thị
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };
    
    return (
        <button onClick={() => handleAddToCart(123)}>
            Thêm vào giỏ hàng
        </button>
    );
};
```

### Test component
Sử dụng `CartAnimationTest` component để test animation:
```javascript
import CartAnimationTest from './components/CartAnimationTest';

// Trong route hoặc component
<CartAnimationTest />
```

## CSS Animations
Các animation được định nghĩa trong `src/styles/index.css`:
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.75);
  }
}
```

## Responsive Design
- **Desktop**: `right-20` (80px từ phải)
- **Mobile**: `right-16` (64px từ phải)
- Text size: `text-lg` trên mobile, `text-xl` trên desktop

## Customization
Để thay đổi animation, bạn có thể:

1. **Thay đổi thời gian**: Sửa các giá trị timeout trong `useEffect`
2. **Thay đổi vị trí**: Sửa CSS classes `top-20 right-20`
3. **Thay đổi màu sắc**: Sửa `from-green-500 to-emerald-500`
4. **Thay đổi kích thước**: Sửa `text-lg md:text-xl`

## Lưu ý
- Animation chỉ hiển thị khi thực sự có sản phẩm mới được thêm vào giỏ hàng
- Không hiển thị khi fetch lại cart từ server
- Sử dụng `pointer-events-none` để không ảnh hưởng đến tương tác người dùng
- Z-index cao (z-50) để hiển thị trên các element khác
