# 🚀 Hướng dẫn Deploy ReactJS lên Vercel

## 📋 Yêu cầu trước khi deploy

1. **Tài khoản Vercel**: Đăng ký tại [vercel.com](https://vercel.com)
2. **Dự án đã build thành công**: Chạy `npm run build` để kiểm tra
3. **Thư mục build/**: Đảm bảo thư mục `build/` đã tồn tại và chứa files đã build
4. **Git repository**: Dự án phải được push lên GitHub/GitLab/Bitbucket

## 🛠️ Các bước deploy

### Bước 1: Chuẩn bị dự án

```bash
# Kiểm tra dự án build thành công (nếu chưa build)
npm run build

# Đảm bảo thư mục build/ tồn tại
ls -la build/

# Commit và push code lên Git (bao gồm cả thư mục build/)
git add .
git commit -m "Prepare for Vercel deployment with pre-built files"
git push origin main
```

### Bước 2: Deploy lên Vercel

#### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. **Đăng nhập Vercel**: Truy cập [vercel.com](https://vercel.com)
2. **Import Project**: Click "New Project"
3. **Chọn Repository**: Chọn repository từ GitHub/GitLab/Bitbucket
4. **Cấu hình Project**:
   - **Framework Preset**: `Other` (vì đã build sẵn)
   - **Root Directory**: `./` (để trống)
   - **Build Command**: `echo "Using pre-built files"` (hoặc để trống)
   - **Output Directory**: `build`
   - **Install Command**: `echo "No installation needed"` (hoặc để trống)
5. **Environment Variables** (nếu cần):
   - `REACT_APP_API_URL`: URL API backend
   - `REACT_APP_ENV`: `production`
6. **Deploy**: Click "Deploy"

#### Cách 2: Deploy qua Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Đăng nhập Vercel
vercel login

# Deploy
vercel

# Hoặc deploy production
vercel --prod
```

### Bước 3: Cấu hình Domain (Tùy chọn)

1. **Custom Domain**: Trong Vercel Dashboard → Settings → Domains
2. **SSL Certificate**: Tự động được cấu hình
3. **DNS Records**: Cập nhật DNS provider nếu cần

## ⚙️ Cấu hình trong vercel.json

File `vercel.json` đã được cập nhật để sử dụng build có sẵn:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "build/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Lưu ý**: Cấu hình này sẽ deploy trực tiếp từ thư mục `build/` mà không cần build lại.

## 🔧 Troubleshooting

### Lỗi Build Failed

```bash
# Kiểm tra lỗi build local
npm run build

# Xem logs trong Vercel Dashboard
# Kiểm tra Node.js version (khuyến nghị 18+)
```

### Lỗi Routing (404)

- Đảm bảo route cuối cùng trong `vercel.json` trỏ về `index.html`
- Kiểm tra `BrowserRouter` trong React app

### Lỗi Environment Variables

- Kiểm tra tên biến môi trường trong Vercel Dashboard
- Đảm bảo format: `REACT_APP_*`

## 📱 Kiểm tra sau khi deploy

1. **Build Status**: Xanh lá trong Vercel Dashboard
2. **Website**: Truy cập URL được cung cấp
3. **Console**: Kiểm tra không có lỗi JavaScript
4. **API Calls**: Kiểm tra kết nối backend
5. **Responsive**: Test trên mobile/tablet

## 🚀 Tự động deploy

Vercel sẽ tự động deploy mỗi khi bạn push code lên branch chính:
- **Preview Deployments**: Mỗi commit tạo preview URL
- **Production Deployments**: Merge vào main branch

## 📊 Monitoring

- **Analytics**: Xem traffic, performance
- **Functions**: Monitor serverless functions (nếu có)
- **Logs**: Xem logs real-time

## 🔄 Cập nhật deployment

```bash
# Chỉ cần push code mới
git add .
git commit -m "Update feature"
git push origin main

# Vercel tự động deploy
```

## 📞 Hỗ trợ

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Support**: [vercel.com/support](https://vercel.com/support)

---

**🎉 Chúc mừng! Dự án ReactJS của bạn đã được deploy thành công lên Vercel!**
