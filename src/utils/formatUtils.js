/**
 * Format Utilities
 * 
 * Các hàm tiện ích để format dữ liệu hiển thị.
 * Bao gồm format giá tiền, số liệu, ngày tháng, v.v.
 */

/**
 * Format giá tiền theo định dạng VND
 * 
 * @param {number|string} price - Giá tiền cần format
 * @param {string} currency - Loại tiền tệ (mặc định: 'VND')
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} - Giá tiền đã được format
 * 
 * @example
 * formatPrice(1500000) // "1.500.000 ₫"
 * formatPrice(0) // "0 ₫"
 * formatPrice('abc') // "0 ₫"
 */
export const formatPrice = (price, currency = 'VND', locale = 'vi-VN') => {
    const numPrice = Number(price) || 0;
    return numPrice.toLocaleString(locale, {
        style: 'currency',
        currency: currency
    });
};

/**
 * Format số với dấu phẩy ngăn cách hàng nghìn
 * 
 * @param {number|string} number - Số cần format
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @returns {string} - Số đã được format
 * 
 * @example
 * formatNumber(1500000) // "1.500.000"
 * formatNumber(1234.56) // "1.234,56"
 */
export const formatNumber = (number, locale = 'vi-VN') => {
    const num = Number(number) || 0;
    return num.toLocaleString(locale);
};

/**
 * Format phần trăm
 * 
 * @param {number|string} value - Giá trị cần format
 * @param {number} decimals - Số chữ số thập phân (mặc định: 1)
 * @returns {string} - Phần trăm đã được format
 * 
 * @example
 * formatPercentage(0.1234) // "12.3%"
 * formatPercentage(0.5) // "50.0%"
 */
export const formatPercentage = (value, decimals = 1) => {
    const num = Number(value) || 0;
    return `${(num * 100).toFixed(decimals)}%`;
};

/**
 * Format ngày tháng
 * 
 * @param {string|Date} date - Ngày cần format
 * @param {string} locale - Locale (mặc định: 'vi-VN')
 * @param {object} options - Tùy chọn format
 * @returns {string} - Ngày tháng đã được format
 * 
 * @example
 * formatDate(new Date()) // "25/12/2024"
 * formatDate('2024-12-25', 'en-US') // "12/25/2024"
 */
export const formatDate = (date, locale = 'vi-VN', options = {}) => {
    const defaultOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...options
    };
    
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(locale, defaultOptions);
};

/**
 * Format thời gian tương đối (ago)
 * 
 * @param {string|Date} date - Ngày cần format
 * @returns {string} - Thời gian tương đối
 * 
 * @example
 * formatTimeAgo(new Date()) // "Vừa xong"
 * formatTimeAgo('2024-12-24') // "1 ngày trước"
 */
export const formatTimeAgo = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} giờ trước`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ngày trước`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} tháng trước`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} năm trước`;
    }
};

/**
 * Format kích thước file
 * 
 * @param {number} bytes - Kích thước file tính bằng bytes
 * @returns {string} - Kích thước file đã được format
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format số điện thoại
 * 
 * @param {string} phone - Số điện thoại cần format
 * @returns {string} - Số điện thoại đã được format
 * 
 * @example
 * formatPhone('0123456789') // "0123 456 789"
 * formatPhone('0987654321') // "0987 654 321"
 */
export const formatPhone = (phone) => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
    }
    
    return phone;
};

/**
 * Format mã code (thêm dấu gạch ngang)
 * 
 * @param {string} code - Mã code cần format
 * @param {number} groupSize - Số ký tự mỗi nhóm (mặc định: 4)
 * @returns {string} - Mã code đã được format
 * 
 * @example
 * formatCode('ABCD1234EFGH') // "ABCD-1234-EFGH"
 * formatCode('123456789', 3) // "123-456-789"
 */
export const formatCode = (code, groupSize = 4) => {
    if (!code) return '';
    
    const cleaned = code.replace(/\s/g, '');
    const groups = [];
    
    for (let i = 0; i < cleaned.length; i += groupSize) {
        groups.push(cleaned.slice(i, i + groupSize));
    }
    
    return groups.join('-');
}; 