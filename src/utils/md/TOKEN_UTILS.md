# tokenUtils.js - Tiện ích token

## Tổng quan
Cung cấp các hàm tiện ích kiểm tra, làm mới, xác thực token (JWT, v.v.).

## Mục đích
- Kiểm tra token còn hạn không
- Làm mới token khi sắp hết hạn
- Hỗ trợ xác thực an toàn

## Các hàm chính
- `isTokenValid(token)`: Kiểm tra token còn hạn
- `isTokenExpiringSoon(token)`: Kiểm tra token sắp hết hạn
- `refreshAccessToken(refreshToken)`: Làm mới access token

## Ví dụ sử dụng
```js
import { isTokenValid, refreshAccessToken } from '../utils/tokenUtils';

if (!isTokenValid(token)) {
  refreshAccessToken(refreshToken);
}
```

## Lưu ý
- Token nên được lưu trữ an toàn (cookie HttpOnly, Secure).
- Không nên lưu token ở localStorage nếu có thể.