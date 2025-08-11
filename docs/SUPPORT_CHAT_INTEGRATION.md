# Support Chat Backend API Integration

## Tổng quan
File `src/pages/Support.js` đã được tích hợp với backend API để có thể lưu trữ tin nhắn một cách bền vững, trong khi vẫn giữ nguyên tất cả logic frontend hiện có.

## 🐛 Bug Fixes (User Hanging Issue)

### Vấn đề đã được sửa:
1. **User bị "hanging" ở trạng thái "Đang kết nối với admin..."**
   - Nguyên nhân: `initializeConversation()` fail nhưng không có error handling đầy đủ
   - Giải pháp: Thêm try-catch và hiển thị thông báo lỗi rõ ràng

2. **Input field bị disable vĩnh viễn**
   - Nguyên nhân: `currentConversation` có thể là `null` ngay cả khi đã kết nối
   - Giải pháp: Chỉ disable input khi không có kết nối server, không phải khi không có conversation

3. **Không có retry mechanism**
   - Nguyên nhân: User không thể thử kết nối lại nếu fail
   - Giải pháp: Thêm nút "Thử kết nối lại" khi cần thiết

4. **Gửi tin nhắn đến tất cả admin**
   - Nguyên nhân: Trước đây chỉ gửi đến 1 admin cụ thể
   - Giải pháp: Thay đổi logic để gửi tin nhắn đến TẤT CẢ admin online

### Cải tiến đã thực hiện:
- ✅ **Error Handling**: Hiển thị thông báo lỗi rõ ràng cho user
- ✅ **Connection Status**: Hiển thị trạng thái kết nối chính xác
- ✅ **Retry Button**: Cho phép user thử kết nối lại
- ✅ **Better UX**: Input field luôn sẵn sàng khi có kết nối server
- ✅ **System Messages**: Hiển thị thông báo hệ thống để user biết trạng thái
- ✅ **Multi-Admin Support**: Tin nhắn được gửi đến tất cả admin thay vì chỉ 1 admin

## Những thay đổi đã thực hiện

### 1. Import axiosClient
```javascript
import axiosClient from '../config/axios';
```

### 2. State mới được thêm vào
```javascript
// State cho conversation management
const [currentConversation, setCurrentConversation] = useState(null);
const [conversations, setConversations] = useState([]);
const [isLoadingMessages, setIsLoadingMessages] = useState(false);
```

### 3. Các hàm API helper mới

#### `findAdminUser()`
- Tìm admin user để tạo conversation
- Gọi API: `GET /api/users/admin`

#### `initializeConversation()`
- Khởi tạo conversation giữa user và admin
- Gọi API: `POST /api/conversations/create-conversation`
- Tự động load tin nhắn và đánh dấu đã đọc

#### `loadAdminConversations()`
- Tải danh sách conversations cho admin
- Gọi API: `GET /api/conversations/conversations/:userId`

#### `loadMessages(conversationId, page)`
- Tải tin nhắn theo conversation ID với phân trang
- Gọi API: `GET /api/conversations/messages/:conversationId`
- Chuyển đổi format message từ backend sang frontend

#### `handleIncomingMessage(data)`
- Xử lý tin nhắn đến từ socket
- Tự động lưu vào database
- Gọi API: `POST /api/conversations/send-message`

#### `markMessagesAsRead(conversationId)`
- Đánh dấu tin nhắn đã đọc
- Gọi API: `PUT /api/conversations/conversation/:conversationId/read/:userId`
- Reload conversations để cập nhật unread count

### 4. Cập nhật useEffect
- Gọi `initializeConversation()` cho regular users
- Gọi `loadAdminConversations()` cho admin users
- Sử dụng `handleIncomingMessage()` để xử lý tin nhắn đến

### 5. Cập nhật hàm gửi tin nhắn

#### `handleSendMessage()` (Regular User)
- Thêm `conversationId` vào message data
- Lưu tin nhắn vào database sau khi gửi qua socket
- Chỉ hoạt động khi có `currentConversation`

#### `handleAdminSendMessage()` (Admin)
- Thêm `conversationId` vào message data
- Lưu tin nhắn vào database sau khi gửi qua socket
- Sử dụng `selectedUser.conversationId`

### 6. Cập nhật UI Admin

#### Sidebar Conversations
- Thay đổi từ `connectedUsers` sang `conversations`
- Hiển thị thông tin conversation: lastMessage, unreadCount
- Click vào conversation để load tin nhắn và đánh dấu đã đọc

#### Chat Header
- Hiển thị thông tin user từ conversation (`fullName` hoặc `email`)
- Cập nhật placeholder text

#### Messages Area
- Thêm loading state khi tải tin nhắn
- Hiển thị tin nhắn từ conversation được chọn
- Cập nhật typing indicator

#### Message Input
- Cập nhật placeholder text phù hợp

### 7. Cập nhật UI Regular User

#### Messages Area
- Thêm loading state khi tải tin nhắn
- Hiển thị tin nhắn từ `currentConversation`

#### Message Input
- Chỉ hoạt động khi có `currentConversation`
- Cập nhật placeholder text phù hợp

## API Endpoints được sử dụng

1. **`POST /api/conversations/create-conversation`** - Tạo conversation mới
2. **`GET /api/conversations/conversations/:userId`** - Lấy danh sách conversations
3. **`GET /api/conversations/messages/:conversationId`** - Lấy tin nhắn theo conversation
4. **`POST /api/conversations/send-message`** - Gửi tin nhắn mới
5. **`PUT /api/conversations/conversation/:conversationId/read/:userId`** - Đánh dấu tin nhắn đã đọc
6. **`GET /api/users/admins`** - Tìm tất cả admin users (thay vì chỉ 1 admin)

## Logic hoạt động

### Regular User Flow
1. User đăng nhập → `initializeConversation()` được gọi
2. Tìm **TẤT CẢ admin users** và tạo conversation với admin đầu tiên
3. Load tin nhắn từ conversation
4. Gửi tin nhắn → Socket.IO (đến tất cả admin) + Database
5. Nhận tin nhắn → Socket.IO + Database

### Admin User Flow
1. Admin đăng nhập → `loadAdminConversations()` được gọi
2. Hiển thị danh sách conversations với unread count
3. Click vào conversation → Load tin nhắn + Mark as read
4. Gửi tin nhắn → Socket.IO + Database
5. Nhận tin nhắn → Socket.IO + Database

## Tính năng bảo toàn

✅ **Socket.IO real-time messaging** - Giữ nguyên hoàn toàn  
✅ **Typing indicators** - Giữ nguyên hoàn toàn  
✅ **User connection status** - Giữ nguyên hoàn toàn  
✅ **Message display logic** - Giữ nguyên hoàn toàn  
✅ **Admin/User role handling** - Giữ nguyên hoàn toàn  
✅ **UI/UX components** - Giữ nguyên hoàn toàn  
✅ **Error handling** - Giữ nguyên hoàn toàn  

## Tính năng mới được thêm

🆕 **Persistent message storage** - Tin nhắn được lưu vào database  
🆕 **Conversation management** - Quản lý cuộc trò chuyện  
🆕 **Message history** - Lịch sử tin nhắn với phân trang  
🆕 **Unread message tracking** - Theo dõi tin nhắn chưa đọc  
🆕 **Admin conversation list** - Danh sách conversations cho admin  
🆕 **Automatic conversation creation** - Tự động tạo conversation  

## Lưu ý quan trọng

1. **Backward Compatibility**: Tất cả logic cũ vẫn hoạt động bình thường
2. **Graceful Degradation**: Nếu API fail, chat vẫn hoạt động qua Socket.IO
3. **State Management**: State mới không ảnh hưởng đến state cũ
4. **Error Handling**: API errors được log nhưng không break UI
5. **Performance**: Messages được load theo pagination để tối ưu performance

## Testing

Để test integration:
1. Đảm bảo backend API đang chạy
2. Test với regular user - kiểm tra conversation được tạo
3. Test với admin user - kiểm tra conversations được load
4. Test gửi/nhận tin nhắn - kiểm tra cả real-time và persistence
5. Test unread count - kiểm tra đánh dấu đã đọc

## Troubleshooting

### Lỗi thường gặp:
1. **API endpoint không đúng**: Kiểm tra URL trong `axiosClient`
2. **Conversation không được tạo**: Kiểm tra `findAdminUser()` API
3. **Messages không load**: Kiểm tra `conversationId` và API response
4. **Unread count không update**: Kiểm tra `markMessagesAsRead()` API

### Debug:
- Sử dụng console.log để theo dõi API calls
- Kiểm tra Network tab trong DevTools
- Kiểm tra backend logs
