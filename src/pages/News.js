import React, { useState, useEffect, useCallback } from 'react';
import { Pagination, Spin, message, Empty, Button } from 'antd';
import SectionBar from '../components/section/SectionBar';
import NewsFilters from '../components/filters/NewsFilters';
import NewsCard from '../components/card/NewsCard';
import { FaNewspaper } from 'react-icons/fa';
import axiosClient from '../config/axios';
import useDeviceDetection from '../hooks/useDeviceDetection';

const News = () => {
    const { isDesktop } = useDeviceDetection();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNews, setTotalNews] = useState(0);
    const [error, setError] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        sortBy: 'newest',
        author: '',
        featured: false
    });

    const pageSize = 12;

    // Fetch news from API with filters
    const fetchNews = useCallback(async (page = 1, currentFilters = filters) => {
        setLoading(true);
        setError(null);

        try {
            console.log(`🚀 Fetching news for page ${page} with filters:`, currentFilters);

            const response = await axiosClient.get('/news', {
                params: {
                    page: page,
                    limit: pageSize,
                    search: currentFilters.search,
                    category: currentFilters.category,
                    sortBy: currentFilters.sortBy,
                    author: currentFilters.author,
                    featured: currentFilters.featured,
                }
            });


            // Sử dụng data từ API trực tiếp không xử lý gì
            const { data, pagination } = response.data;

            // Set timeout 500ms cho loading state
            setNews(data || []);
            setTotalNews(pagination?.total || 0);
            setCurrentPage(page);
            setLoading(false);

        } catch (error) {
            console.error('❌ Error fetching news:', error);

            // Set timeout 500ms cho error state
            setTimeout(() => {
                setError('Không thể tải tin tức');
                setNews([]);
                setTotalNews(0);
                setLoading(false);
                message.error('Không thể tải dữ liệu tin tức');
            }, 250);
        }
    }, [filters, pageSize]); // Added 'filters' to dependency array

    // Handle filter changes
    const handleFilterChange = useCallback((key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setCurrentPage(1);
        fetchNews(1, newFilters);
    }, [filters, fetchNews]);

    // Handle search
    const handleSearch = useCallback((value) => {
        handleFilterChange('search', value);
    }, [handleFilterChange]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        const defaultFilters = {
            search: '',
            category: '',
            sortBy: 'newest',
            author: '',
            featured: false
        };
        setFilters(defaultFilters);
        setCurrentPage(1);
        fetchNews(1, defaultFilters);
    }, [fetchNews]);

    // Handle page change
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        fetchNews(page);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [fetchNews]);

    // Initial load
    useEffect(() => {
        fetchNews(1);
    }, [fetchNews]); // Added 'fetchNews' to dependency array

    const hasActiveFilters = filters.search || filters.category || filters.author || filters.featured;

    return (
        <>
            <SectionBar
                icon={<FaNewspaper />}
                title={`Tin tức ${totalNews > 0 ? `(${totalNews} bài viết)` : ''}`}
            />

            {/* NewsFilters Component */}
            <NewsFilters
                filters={filters}
                setFilters={setFilters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center min-h-96">
                    <Spin size="large" tip="Đang tải tin tức..." />
                </div>
            )}

            {/* Error State */}
            {error && !loading && news.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-96">
                    <Empty
                        description={
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">{error}</p>
                                <Button
                                    onClick={() => fetchNews(currentPage)}
                                    type="primary"
                                >
                                    Thử lại
                                </Button>
                            </div>
                        }
                    />
                </div>
            )}

            {/* No Results */}
            {!loading && news.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center min-h-96">
                    <Empty
                        description={
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">Không tìm thấy tin tức nào phù hợp với bộ lọc</p>
                                <Button onClick={clearFilters} type="primary">
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        }
                    />
                </div>
            )}

            {/* News Grid */}
            {!loading && news.length > 0 && (
                <>
                    <div className="wrapper grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        {news.map((article, index) => (
                            <NewsCard
                                key={article.id || `news-${currentPage}-${index}`}
                                {...article}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mb-6 sm:mb-8 lg:px-8">
                        <Pagination
                            current={currentPage}
                            total={totalNews}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showQuickJumper
                            showTotal={(total, range) =>
                                `${range[0]}-${range[1]} của ${total} sản phẩm`
                            }
                            size={isDesktop ? "default" : "small"}
                            className="bg-white p-4 rounded-lg shadow-sm"
                            responsive={{
                                hideOnSinglePage: true,
                                showSizeChanger: false,
                                showQuickJumper: false,
                                showTotal: false
                            }}
                            simple={!isDesktop}
                        />
                    </div>

                    {/* Product Summary - Chỉ hiển thị trên desktop */}
                    <div className="hidden lg:block bg-gray-50 p-4 rounded-lg mb-4 text-center text-sm text-gray-600 lg:px-8">
                        <p className="leading-relaxed">
                            Hiển thị <strong>{news ? news.length : 0}</strong> sản phẩm
                            trong trang <strong>{currentPage}</strong>
                            / Tổng cộng <strong>{totalNews}</strong> sản phẩm laptop
                        </p>
                    </div>
                </>
            )}
        </>
    );
};

export default News;