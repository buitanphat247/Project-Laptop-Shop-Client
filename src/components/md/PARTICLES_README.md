# Particles.js Configuration

## Cấu hình Particles.js cho Laptop Shop

### Files đã tạo:
1. `public/particlesjs-config.json` - File cấu hình particles
2. `src/components/ParticlesBackground.js` - Component React để load particles
3. `src/App.js` - Đã thêm ParticlesBackground component
4. `src/App.css` - CSS styles cho particles

### Cách hoạt động:
1. **ParticlesBackground component** load particles.js script từ CDN
2. **Config file** định nghĩa hiệu ứng particles (số lượng, màu sắc, chuyển động)
3. **CSS** đảm bảo particles hiển thị đúng vị trí (fixed background)

### Tính năng particles:
- ✅ 80 particles màu xanh (#3b82f6)
- ✅ Chuyển động mượt mà
- ✅ Tương tác hover (repulse)
- ✅ Tương tác click (push)
- ✅ Kết nối particles bằng đường thẳng
- ✅ Responsive design

### Tùy chỉnh:
- Thay đổi màu sắc trong `particlesjs-config.json`
- Điều chỉnh số lượng particles
- Thay đổi tốc độ chuyển động
- Tùy chỉnh hiệu ứng tương tác

### Lưu ý:
- Particles chỉ hiển thị ở background
- Không ảnh hưởng đến tương tác UI
- Tối ưu performance với pointer-events: none 