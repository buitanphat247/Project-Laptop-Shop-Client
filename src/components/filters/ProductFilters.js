import React from 'react';
import { Card, Button, Input, Row, Col, Select, Slider, Checkbox, Space, Form } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { categoryOptions, brandOptions, productSortOptions, ratingOptions } from '../../config/constant';

const { Option } = Select;

const ProductFilters = ({
    filters,
    setFilters,
    filtersVisible,
    setFiltersVisible,
    onFilterChange,
    onSearch,
    onClearFilters,
    hasActiveFilters,
    categoryOptions: categoryOptionsProp
}) => {
    const [form] = Form.useForm();
    
    // Filter options
    // Đã chuyển brandOptions, sortOptions, ratingOptions, featureOptions sang constant.js
    const sortOptions = productSortOptions;
    const categoryOpts = categoryOptionsProp && categoryOptionsProp.length > 0 ? categoryOptionsProp : categoryOptions;

    // Format price for display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Handle form submit
    const handleSubmit = (values) => {
        onSearch(values.search || '');
    };

    // Reset form when clear filters
    const handleClearFilters = () => {
        form.resetFields();
        onClearFilters();
    };

    return (
        <Card className="mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FilterOutlined />
                    Bộ lọc sản phẩm
                </h3>
                <div className="flex gap-2">
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleClearFilters}
                        disabled={!hasActiveFilters}
                        type="default"
                    >
                        Xóa bộ lọc
                    </Button>
                  
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <Form form={form} onFinish={handleSubmit} layout="inline" style={{ width: '100%' }}>
                    <div className="flex gap-2 w-full">
                        <Form.Item name="search" style={{ flex: 1, margin: 0 }}>
                            <Input
                                placeholder="Tìm kiếm laptop theo tên, model..."
                                size="large"
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item style={{ margin: 0 }}>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                icon={<SearchOutlined />}
                            >
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>

            {/* Quick Filters */}
            <Row gutter={[16, 16]} className="mb-4">
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Danh mục"
                        size="large"
                        value={filters.category}
                        onChange={(value) => onFilterChange('category', value)}
                        style={{ width: '100%' }}
                    >
                        {categoryOpts.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Sắp xếp theo"
                        size="large"
                        value={filters.sortBy}
                        onChange={(value) => onFilterChange('sortBy', value)}
                        style={{ width: '100%' }}
                    >
                        {productSortOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Đánh giá"
                        size="large"
                        value={filters.minRating}
                        onChange={(value) => onFilterChange('minRating', value)}
                        style={{ width: '100%' }}
                    >
                        {ratingOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Col>
               
            </Row>

            

        
        </Card>
    );
};

export default ProductFilters;