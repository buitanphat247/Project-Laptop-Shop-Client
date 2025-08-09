/**
 * Product Utilities
 * 
 * Các hàm tiện ích liên quan đến sản phẩm.
 * Bao gồm xử lý stock status, URL generation, v.v.
 */

/**
 * Lấy trạng thái tồn kho dựa trên số lượng
 * 
 * @param {number} stock - Số lượng tồn kho
 * @returns {object} - Object chứa thông tin trạng thái
 * 
 * @example
 * getStockStatus(0) // { text: 'Hết hàng', color: 'bg-red-500', textColor: 'text-red-500' }
 * getStockStatus(3) // { text: 'Còn 3 sản phẩm', color: 'bg-yellow-500', textColor: 'text-yellow-600' }
 * getStockStatus(8) // { text: 'Còn 8 sản phẩm', color: 'bg-orange-500', textColor: 'text-orange-600' }
 * getStockStatus(15) // { text: 'Còn 15 sản phẩm', color: 'bg-green-500', textColor: 'text-green-600' }
 */
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

/**
 * Tạo URL cho sản phẩm
 * 
 * @param {string|number} productId - ID sản phẩm
 * @param {string} basePath - Đường dẫn cơ sở (mặc định: '/product')
 * @returns {string} - URL sản phẩm
 * 
 * @example
 * generateProductUrl('123') // "/product/123"
 * generateProductUrl(456) // "/product/456"
 * generateProductUrl('abc', '/san-pham') // "/san-pham/abc"
 */
export const generateProductUrl = (productId, basePath = '/product') => {
    const id = productId || '1354';
    return `${basePath}/${id}`;
};

/**
 * Tạo URL cho danh mục sản phẩm
 * 
 * @param {string|number} categoryId - ID danh mục
 * @param {string} basePath - Đường dẫn cơ sở (mặc định: '/category')
 * @returns {string} - URL danh mục
 * 
 * @example
 * generateCategoryUrl('laptop') // "/category/laptop"
 * generateCategoryUrl(123) // "/category/123"
 */
export const generateCategoryUrl = (categoryId, basePath = '/category') => {
    return `${basePath}/${categoryId}`;
};

/**
 * Kiểm tra sản phẩm có còn hàng không
 * 
 * @param {number} stock - Số lượng tồn kho
 * @returns {boolean} - true nếu còn hàng, false nếu hết hàng
 * 
 * @example
 * isInStock(5) // true
 * isInStock(0) // false
 */
export const isInStock = (stock) => {
    return stock > 0;
};

/**
 * Kiểm tra sản phẩm có sắp hết hàng không (≤ 5 sản phẩm)
 * 
 * @param {number} stock - Số lượng tồn kho
 * @returns {boolean} - true nếu sắp hết hàng
 * 
 * @example
 * isLowStock(3) // true
 * isLowStock(10) // false
 */
export const isLowStock = (stock) => {
    return stock > 0 && stock <= 5;
};

/**
 * Lấy trạng thái hiển thị cho sản phẩm
 * 
 * @param {object} product - Object sản phẩm
 * @returns {object} - Thông tin trạng thái hiển thị
 * 
 * @example
 * getProductDisplayStatus({ stock: 0, isActive: true })
 * // { canPurchase: false, message: 'Hết hàng', status: 'out_of_stock' }
 */
export const getProductDisplayStatus = (product) => {
    const { stock = 0, isActive = true, isPublished = true } = product;
    
    if (!isActive) {
        return {
            canPurchase: false,
            message: 'Sản phẩm không khả dụng',
            status: 'inactive'
        };
    }
    
    if (!isPublished) {
        return {
            canPurchase: false,
            message: 'Sản phẩm chưa xuất bản',
            status: 'unpublished'
        };
    }
    
    if (stock === 0) {
        return {
            canPurchase: false,
            message: 'Hết hàng',
            status: 'out_of_stock'
        };
    }
    
    if (stock <= 5) {
        return {
            canPurchase: true,
            message: `Chỉ còn ${stock} sản phẩm`,
            status: 'low_stock'
        };
    }
    
    return {
        canPurchase: true,
        message: 'Còn hàng',
        status: 'in_stock'
    };
};

/**
 * Tính toán giá sau khi áp dụng giảm giá
 * 
 * @param {number} originalPrice - Giá gốc
 * @param {number} discountPercent - Phần trăm giảm giá
 * @returns {number} - Giá sau khi giảm
 * 
 * @example
 * calculateDiscountedPrice(1000000, 20) // 800000
 * calculateDiscountedPrice(500000, 0) // 500000
 */
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    const price = Number(originalPrice) || 0;
    const discount = Number(discountPercent) || 0;
    
    if (discount <= 0) return price;
    if (discount >= 100) return 0;
    
    return Math.round(price * (1 - discount / 100));
};

/**
 * Tính phần trăm giảm giá
 * 
 * @param {number} originalPrice - Giá gốc
 * @param {number} currentPrice - Giá hiện tại
 * @returns {number} - Phần trăm giảm giá
 * 
 * @example
 * calculateDiscountPercent(1000000, 800000) // 20
 * calculateDiscountPercent(500000, 500000) // 0
 */
export const calculateDiscountPercent = (originalPrice, currentPrice) => {
    const original = Number(originalPrice) || 0;
    const current = Number(currentPrice) || 0;
    
    if (original <= 0) return 0;
    if (current >= original) return 0;
    
    return Math.round(((original - current) / original) * 100);
};

/**
 * Lấy thông tin giảm giá
 * 
 * @param {object} product - Object sản phẩm
 * @returns {object} - Thông tin giảm giá
 * 
 * @example
 * getDiscountInfo({ originalPrice: 1000000, currentPrice: 800000 })
 * // { hasDiscount: true, percent: 20, saved: 200000 }
 */
export const getDiscountInfo = (product) => {
    const { originalPrice, currentPrice, price } = product;
    
    const original = originalPrice || price;
    const current = currentPrice || price;
    
    if (!original || !current) {
        return {
            hasDiscount: false,
            percent: 0,
            saved: 0
        };
    }
    
    const percent = calculateDiscountPercent(original, current);
    const saved = original - current;
    
    return {
        hasDiscount: percent > 0,
        percent,
        saved
    };
};

/**
 * Sắp xếp danh sách sản phẩm
 * 
 * @param {array} products - Danh sách sản phẩm
 * @param {string} sortBy - Tiêu chí sắp xếp
 * @param {string} sortOrder - Thứ tự sắp xếp ('asc' hoặc 'desc')
 * @returns {array} - Danh sách đã sắp xếp
 * 
 * @example
 * sortProducts(products, 'price', 'asc')
 * sortProducts(products, 'name', 'desc')
 */
export const sortProducts = (products, sortBy = 'name', sortOrder = 'asc') => {
    if (!Array.isArray(products)) return [];
    
    return [...products].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Xử lý giá trị null/undefined
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';
        
        // So sánh số
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // So sánh chuỗi
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (sortOrder === 'asc') {
            return aStr.localeCompare(bStr);
        } else {
            return bStr.localeCompare(aStr);
        }
    });
};

/**
 * Lọc sản phẩm theo tiêu chí
 * 
 * @param {array} products - Danh sách sản phẩm
 * @param {object} filters - Object chứa các bộ lọc
 * @returns {array} - Danh sách đã lọc
 * 
 * @example
 * filterProducts(products, { 
 *   category: 'laptop', 
 *   minPrice: 1000000, 
 *   maxPrice: 5000000,
 *   inStock: true 
 * })
 */
export const filterProducts = (products, filters = {}) => {
    if (!Array.isArray(products)) return [];
    
    return products.filter(product => {
        // Lọc theo danh mục
        if (filters.category && product.category?.id !== filters.category) {
            return false;
        }
        
        // Lọc theo giá tối thiểu
        if (filters.minPrice && product.price < filters.minPrice) {
            return false;
        }
        
        // Lọc theo giá tối đa
        if (filters.maxPrice && product.price > filters.maxPrice) {
            return false;
        }
        
        // Lọc theo trạng thái tồn kho
        if (filters.inStock && !isInStock(product.stock)) {
            return false;
        }
        
        // Lọc theo từ khóa tìm kiếm
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const productName = product.name?.toLowerCase() || '';
            const productDesc = product.description?.toLowerCase() || '';
            
            if (!productName.includes(searchTerm) && !productDesc.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
}; 