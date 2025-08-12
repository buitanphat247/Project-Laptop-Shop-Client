/**
 * Axios Client Configuration
 * 
 * File này cấu hình axios client với các tính năng:
 * - Tự động thêm Authorization header với access token
 * - Tự động refresh token khi gặp lỗi 401/403
 * - Xử lý queue cho các request đồng thời
 * - Tự động logout khi refresh token thất bại
 */

import axios from 'axios';
// Import các utility functions từ thư mục utils
import { getCookie, setCookie, decodeBase64, getUserIdFromCookie } from '../utils/auth';

/**
 * Tạo axios client instance với cấu hình cơ bản
 * 
 * @property {string} baseURL - URL cơ sở cho tất cả API calls
 * @property {Object} headers - Headers mặc định cho mọi request
 * @property {boolean} withCredentials - Cho phép gửi cookies trong cross-origin requests
 */
const apiBaseUrl = 'https://project-laptop-shop-sever.vercel.app/api/v1';

const axiosClient = axios.create({
    baseURL: apiBaseUrl, // URL của backend API
    headers: {
        'Content-Type': 'application/json', // Định dạng dữ liệu gửi đi
    },
    withCredentials: true, // Cho phép gửi cookies (quan trọng cho authentication)
});

/**
 * Request Interceptor - Xử lý trước khi gửi request
 * 
 * Mục đích: Tự động thêm Authorization header với access token vào mọi request
 * 
 * @param {Function} config - Callback được gọi trước khi gửi request
 * @param {Function} error - Callback xử lý lỗi
 */
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy access token từ cookie
        const token = getCookie('accessToken');

        // Nếu có token, thêm vào Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config; // Trả về config đã được cập nhật
    },
    (error) => Promise.reject(error) // Xử lý lỗi nếu có
);

/**
 * Biến quản lý trạng thái refresh token
 * 
 * @var {boolean} isRefreshing - Đánh dấu đang trong quá trình refresh token
 * @var {Array} failedQueue - Queue chứa các request bị fail trong khi refresh
 */
let isRefreshing = false;
let failedQueue = [];

/**
 * Xử lý queue các request bị fail
 * 
 * Khi có nhiều request đồng thời bị 401/403, chỉ request đầu tiên sẽ refresh token.
 * Các request còn lại sẽ được đưa vào queue và chờ token mới.
 * 
 * @param {Error|null} error - Lỗi nếu refresh token thất bại
 * @param {string|null} token - Token mới nếu refresh thành công
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error); // Reject tất cả request nếu refresh thất bại
        } else {
            prom.resolve(token); // Resolve tất cả request với token mới
        }
    });
    failedQueue = []; // Xóa queue sau khi xử lý xong
};

/**
 * Response Interceptor - Xử lý sau khi nhận response
 * 
 * Mục đích: 
 * - Tự động refresh token khi gặp lỗi 401/403
 * - Xử lý queue các request đồng thời
 * - Tự động logout khi refresh token thất bại
 * 
 * @param {Function} response - Callback xử lý response thành công
 * @param {Function} error - Callback xử lý response lỗi
 */
axiosClient.interceptors.response.use(
    (response) => response, // Trả về response nếu thành công
    async (error) => {
        const originalRequest = error.config; // Lưu lại request gốc để retry

        // Kiểm tra điều kiện để refresh token:
        // 1. Có response lỗi (error.response tồn tại)
        // 2. Status code là 401 (Unauthorized) hoặc 403 (Forbidden)
        // 3. Request chưa được retry (tránh loop vô hạn)
        // 4. Không phải là request refresh token (tránh loop vô hạn)
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh-token')
        ) {
            // Nếu đang trong quá trình refresh token, đưa request vào queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    // Thêm request vào queue chờ token mới
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    // Khi có token mới, thêm vào header và retry request
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            // Đánh dấu request này đã được retry để tránh loop vô hạn
            originalRequest._retry = true;
            // Đánh dấu đang trong quá trình refresh token
            isRefreshing = true;

            try {
                // Lấy userId từ profile_user cookie thay vì refreshToken
                // Đây là cách tiếp cận khác với refresh token truyền thống
                const userId = getUserIdFromCookie();
                console.log('userId: ', userId);

                // Kiểm tra xem có userId không
                if (!userId) throw new Error('No userId found in profile');

                console.log('Refreshing token with userId:', userId);

                // Gọi API refresh token với userId
                // Thay vì gửi refresh token, chúng ta gửi userId để server tạo token mới
                const res = await axios.post(
                    `${apiBaseUrl}/auth/refresh-token`,
                    { userId: userId }, // Gửi userId thay vì refreshToken
                    { withCredentials: true } // Quan trọng: gửi cookies
                );

                // Lấy access token mới từ response
                const { accessToken } = res.data.data;
                console.log('accessToken refreshed with userId:', accessToken);

                // Lưu token mới vào cookie
                setCookie('accessToken', accessToken);
                // Cập nhật header mặc định cho axios client
                axiosClient.defaults.headers['Authorization'] = 'Bearer ' + accessToken;

                // Xử lý queue các request đang chờ
                processQueue(null, accessToken);

                // Thêm token mới vào request gốc và retry
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                return axiosClient(originalRequest);
            } catch (err) {
                // Xử lý lỗi khi refresh token thất bại
                console.error('Token refresh failed with userId:', err);

                // Reject tất cả request trong queue
                processQueue(err, null);

                // Clear cookies khi refresh thất bại
                // Đặt thời gian hết hạn = -1 để xóa cookie ngay lập tức
                setCookie('accessToken', '', -1);
                setCookie('profile_user', '', -1);
                setCookie('login_status', '', -1);

                // Redirect về trang login để user đăng nhập lại
                window.location.href = '/auth'; // logout
                return Promise.reject(err);
            } finally {
                // Luôn reset trạng thái isRefreshing, dù thành công hay thất bại
                isRefreshing = false;
            }
        }

        // Nếu không phải lỗi 401/403 hoặc đã retry rồi, trả về lỗi gốc
        return Promise.reject(error);
    }
);

/**
 * Export axios client đã được cấu hình
 * 
 * Client này có các tính năng:
 * - Tự động thêm Authorization header
 * - Tự động refresh token khi cần
 * - Xử lý queue request đồng thời
 * - Tự động logout khi refresh thất bại
 */
export default axiosClient;