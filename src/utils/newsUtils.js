/**
 * News Utilities
 * 
 * Các hàm tiện ích liên quan đến tin tức.
 * Bao gồm format date, author name, view count, URL generation, v.v.
 */

/**
 * Format ngày tháng cho tin tức
 * 
 * @param {string} dateString - Chuỗi ngày tháng
 * @returns {string} - Ngày tháng đã được format
 * 
 * @example
 * formatNewsDate('2024-12-25') // "25 tháng 12 năm 2024"
 * formatNewsDate(null) // "N/A"
 */
export const formatNewsDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Lấy tên tác giả từ object hoặc string
 * 
 * @param {object|string} author - Thông tin tác giả
 * @returns {string} - Tên tác giả
 * 
 * @example
 * getAuthorName({ fullName: 'John Doe' }) // "John Doe"
 * getAuthorName('John Doe') // "John Doe"
 * getAuthorName(null) // "Admin"
 */
export const getAuthorName = (author) => {
    if (typeof author === 'string') return author;
    if (author && author.fullName) return author.fullName;
    return 'Admin';
};

/**
 * Tạo số lượt xem ngẫu nhiên dựa trên ID
 * 
 * @param {string|number} id - ID của tin tức
 * @returns {number} - Số lượt xem
 * 
 * @example
 * generateViewCount('123') // 12345 (random)
 * generateViewCount(null) // 0
 */
export const generateViewCount = (id) => {
    if (!id) return 0;
    const seed = parseInt(id) || 1;
    return Math.floor(Math.random() * seed * 100) + 50;
};

/**
 * Format số lượt xem
 * 
 * @param {number} count - Số lượt xem
 * @returns {string} - Số lượt xem đã được format
 * 
 * @example
 * formatViewCount(1500) // "1.5K"
 * formatViewCount(500) // "500"
 */
export const formatViewCount = (count) => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
};

/**
 * Tạo URL cho tin tức
 * 
 * @param {string|number} id - ID tin tức
 * @param {string} slug - Slug tin tức
 * @param {string} basePath - Đường dẫn cơ sở (mặc định: '/news')
 * @returns {string} - URL tin tức
 * 
 * @example
 * generateNewsUrl('123', 'tin-tuc-moi') // "/news/tin-tuc-moi"
 * generateNewsUrl('123', null) // "/news/123"
 * generateNewsUrl(null, null) // "/news/1"
 */
export const generateNewsUrl = (id, slug, basePath = '/news') => {
    if (slug) {
        return `${basePath}/${slug}`;
    }
    return `${basePath}/${id || '1'}`;
};

/**
 * Lấy trạng thái xuất bản
 * 
 * @param {boolean} published - Trạng thái xuất bản
 * @returns {object} - Object chứa thông tin trạng thái
 * 
 * @example
 * getPublishStatus(true) // { text: 'Đã xuất bản', color: 'bg-green-500', textColor: 'text-white' }
 * getPublishStatus(false) // { text: 'Chưa xuất bản', color: 'bg-gray-500', textColor: 'text-white' }
 */
export const getPublishStatus = (published) => {
    if (published) {
        return {
            text: 'Đã xuất bản',
            color: 'bg-green-500',
            textColor: 'text-white',
            status: 'published'
        };
    } else {
        return {
            text: 'Chưa xuất bản',
            color: 'bg-gray-500',
            textColor: 'text-white',
            status: 'draft'
        };
    }
};

/**
 * Tạo thumbnail fallback URL
 * 
 * @param {string} thumbnail - URL thumbnail
 * @param {string} fallbackUrl - URL fallback (mặc định: URL mặc định)
 * @returns {string} - URL thumbnail hoặc fallback
 * 
 * @example
 * getNewsThumbnail('https://example.com/image.jpg') // "https://example.com/image.jpg"
 * getNewsThumbnail(null) // "https://caodem.com/wp-content/uploads/2019/12/phong-nen-tin-tuc-thoi-su-caodem.com_.jpg"
 */
export const getNewsThumbnail = (thumbnail, fallbackUrl = 'https://caodem.com/wp-content/uploads/2019/12/phong-nen-tin-tuc-thoi-su-caodem.com_.jpg') => {
    return thumbnail || fallbackUrl;
};

/**
 * Tạo title mặc định cho tin tức
 * 
 * @param {string} title - Tiêu đề tin tức
 * @returns {string} - Tiêu đề hoặc mặc định
 * 
 * @example
 * getNewsTitle('Tin tức mới') // "Tin tức mới"
 * getNewsTitle(null) // "Tiêu đề tin tức"
 */
export const getNewsTitle = (title) => {
    return title || "Tiêu đề tin tức";
};

/**
 * Tạo description mặc định cho tin tức
 * 
 * @param {string} desc - Mô tả tin tức
 * @returns {string} - Mô tả hoặc mặc định
 * 
 * @example
 * getNewsDescription('Mô tả tin tức') // "Mô tả tin tức"
 * getNewsDescription(null) // "Tóm tắt nội dung bài viết..."
 */
export const getNewsDescription = (desc) => {
    return desc || "Tóm tắt nội dung bài viết...";
};

/**
 * Tạo author object mặc định
 * 
 * @param {object|string} author - Thông tin tác giả
 * @returns {object} - Object tác giả
 * 
 * @example
 * getAuthorObject({ fullName: 'John Doe' }) // { fullName: 'John Doe' }
 * getAuthorObject(null) // { fullName: "Admin" }
 */
export const getAuthorObject = (author) => {
    if (typeof author === 'string') {
        return { fullName: author };
    }
    return author || { fullName: "Admin" };
};

/**
 * Tạo ID mặc định cho tin tức
 * 
 * @param {string|number} id - ID tin tức
 * @returns {string} - ID hoặc mặc định
 * 
 * @example
 * getNewsId('123') // "123"
 * getNewsId(null) // "1"
 */
export const getNewsId = (id) => {
    return id || '1';
};

/**
 * Kiểm tra tin tức có được xuất bản không
 * 
 * @param {boolean} published - Trạng thái xuất bản
 * @returns {boolean} - true nếu đã xuất bản
 * 
 * @example
 * isNewsPublished(true) // true
 * isNewsPublished(false) // false
 */
export const isNewsPublished = (published) => {
    return published === true;
};

/**
 * Tạo thông tin meta cho tin tức
 * 
 * @param {object} news - Thông tin tin tức
 * @returns {object} - Object chứa thông tin meta
 * 
 * @example
 * getNewsMeta({ createdAt: '2024-12-25', author: { fullName: 'John' } })
 * // { date: "25 tháng 12 năm 2024", author: "John", viewCount: 1234 }
 */
export const getNewsMeta = (news) => {
    const { createdAt, author, id } = news;
    
    return {
        date: formatNewsDate(createdAt),
        author: getAuthorName(author),
        viewCount: formatViewCount(generateViewCount(id))
    };
}; 