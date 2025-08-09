import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Pagination, Spin, message, Empty, Button } from 'antd';
import CardProduct from '../components/card/CardProduct';
import SectionBar from '../components/section/SectionBar';
import ProductFilters from '../components/filters/ProductFilters';
import { FaBox, FaLaptop } from 'react-icons/fa';
import axiosClient from '../config/axios';
import { categoryOptions as defaultCategoryOptions } from '../config/constant';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [error, setError] = useState(null);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [categories, setCategories] = useState([]);

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        priceRange: [0, 100000000],
        sortBy: '',
        category: '',
        minRating: 0
    });

    const pageSize = 20;

    // Fetch products and categories from API with filters
    const fetchProducts = useCallback(async (page = 1, currentFilters = filters) => {
        setLoading(true);
        setError(null);

        try {


            const [productRes, categoryRes] = await Promise.all([
                axiosClient.get('/product', {
                    params: {
                        page: page,
                        limit: pageSize,
                        search: currentFilters.search,
                        // brand: currentFilters.brand, // Đã loại bỏ brand
                        minPrice: currentFilters.priceRange[0],
                        maxPrice: currentFilters.priceRange[1],
                        sortBy: currentFilters.sortBy,
                        category: currentFilters.category,
                        minRating: currentFilters.minRating
                    }
                }),
                axiosClient.get('/category') // Fetch categories
            ]);



            const { data: productData, pagination } = productRes.data;
            const categoryData = categoryRes.data?.data || [];

            // Convert categories to options format
            const categoryOptionsFormatted = [
                { value: '', label: 'Tất cả danh mục' },
                ...categoryData.map(c => ({ value: c.id, label: c.name }))
            ];

            setTimeout(() => {
                setProducts(Array.isArray(productData) ? productData : []);
                setTotalProducts(pagination?.total || 0);
                setCurrentPage(page);
                setCategories(categoryOptionsFormatted); // Set fetched categories
                setLoading(false);
            }, 250);

        } catch (error) {
            console.error('❌ Error fetching products or categories:', error);
            setError('Không thể tải sản phẩm hoặc danh mục');

            // Mock data fallback
            const mockProducts = Array.from({ length: pageSize }, (_, index) => {
                return {
                    id: index + 1,
                    name: `Laptop Gaming ${index + 1}`,
                    price: Math.floor(Math.random() * 50000000) + 10000000,
                    imageUrls: ['https://cdn.tgdd.vn/Files/2018/05/05/1086477/laptoppp_1280x720-800-resize.jpg'],
                    categoryInfo: { name: 'Laptop Gaming' },
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    views: Math.floor(Math.random() * 10000) + 1000,
                    description: 'Laptop gaming hiệu năng cao với card đồ họa mạnh mẽ'
                };
            });

            setTimeout(() => {
                setProducts(Array.isArray(mockProducts) ? mockProducts : []);
                setTotalProducts(750);
                setCategories(defaultCategoryOptions); // Fallback to default categories
                setLoading(false);
            }, 250);

            message.warning('Không thể tải dữ liệu từ server, hiển thị dữ liệu mẫu');
        }
    }, [pageSize, filters]); // Add filters to dependency array

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setCurrentPage(1);
        fetchProducts(1, newFilters);
    };

    // Handle search - only when form is submitted
    const handleSearch = (searchValue) => {
        const newFilters = { ...filters, search: searchValue };
        setFilters(newFilters);
        setCurrentPage(1);
        fetchProducts(1, newFilters);
    };

    // Clear all filters
    const clearFilters = () => {
        const defaultFilters = {
            search: '',
            priceRange: [0, 100000000],
            sortBy: '',
            category: '',
            minRating: 0
        };
        setFilters(defaultFilters);
        setCurrentPage(1);
        fetchProducts(1, defaultFilters);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchProducts(page);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Single useEffect for initial load and filter changes
    useEffect(() => {
        fetchProducts(1);
    }, [fetchProducts]); // Add fetchProducts to dependency array

    const hasActiveFilters = filters.search || filters.minRating > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 100000000 || filters.category || filters.sortBy;

    return (
        <>
            <SectionBar
                icon={<FaBox />}
                title={`Sản phẩm công nghệ `}
            />

            {/* Filters Component */}
            <ProductFilters
                filters={filters}
                setFilters={setFilters}
                filtersVisible={filtersVisible}
                setFiltersVisible={setFiltersVisible}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                categoryOptions={categories}
            />

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center min-h-96">
                    <Spin
                        size="large"
                        tip="Đang tải sản phẩm..."
                    />
                </div>
            )}

            {/* Error State */}
            {error && !loading && (!products || products.length === 0) && (
                <div className="flex flex-col items-center justify-center min-h-96">
                    <Empty
                        description={
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">{error}</p>
                                <button
                                    onClick={() => fetchProducts(currentPage)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Thử lại
                                </button>
                            </div>
                        }
                    />
                </div>
            )}

            {/* No Results */}
            {!loading && (!products || products.length === 0) && !error && (
                <div className="flex flex-col items-center justify-center min-h-96">
                    <Empty
                        description={
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">Không tìm thấy sản phẩm nào phù hợp với bộ lọc</p>
                                <Button onClick={clearFilters} type="primary">
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        }
                    />
                </div>
            )}

            {/* Products Grid */}
            {!loading && products && products.length > 0 && (
                <>
                    <div className="wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        {products.map((product, index) => (
                            <CardProduct
                                key={product.id || `product-${currentPage}-${index}`}
                                id={product.id}
                                name={product.name}
                                imageUrl={
                                    product.imageUrls && product.imageUrls.length > 0
                                        ? product.imageUrls[0]
                                        : "https://cdn.tgdd.vn/Products/Images/44/309016/msi-gaming-gf63-thin-12ucx-i5-841vn-1-600x600.jpg"
                                }
                                price={product.price}
                                stock={product.stock}
                                category={product.category}
                                desc={product.description}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mb-8">
                        <Pagination
                            current={currentPage}
                            total={totalProducts}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showQuickJumper
                            showTotal={(total, range) =>
                                `${range[0]}-${range[1]} của ${total} sản phẩm`
                            }
                            size="default"
                            className="bg-white p-4 rounded-lg shadow-sm"
                        />
                    </div>

                    {/* Product Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center text-sm text-gray-600">
                        <p>
                            Hiển thị <strong>{products ? products.length : 0}</strong> sản phẩm
                            trong trang <strong>{currentPage}</strong>
                            / Tổng cộng <strong>{totalProducts}</strong> sản phẩm laptop
                        </p>
                    </div>
                </>
            )}
        </>
    );
};

export default Product;