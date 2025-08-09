# encodingUtils.js - Mã hóa/giải mã dữ liệu

## Tổng quan
Cung cấp các hàm tiện ích để mã hóa và giải mã dữ liệu (Base64, v.v.).

## Mục đích
- Hỗ trợ encode/decode dữ liệu khi truyền qua network
- Bảo vệ dữ liệu nhạy cảm ở mức cơ bản

## Các hàm chính
- `encodeBase64(str)`: Mã hóa chuỗi sang Base64
- `decodeBase64(str)`: Giải mã chuỗi từ Base64
- `testEncodeDecode()`: Hàm test encode/decode

## Ví dụ sử dụng
```js
import { encodeBase64, decodeBase64 } from '../utils/encodingUtils';

const encoded = encodeBase64('hello');
const decoded = decodeBase64(encoded);
```

## Lưu ý
- Base64 KHÔNG phải là mã hóa bảo mật, chỉ dùng để encode dữ liệu dạng text.
- Không dùng để bảo vệ thông tin quan trọng.