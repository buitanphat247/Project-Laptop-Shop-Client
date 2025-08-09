import React from 'react';
import { Card, Button, Input, Row, Col, Select, Space, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { categoryOptions, sortOptions } from '../../config/constant';

const { Option } = Select;

const NewsFilters = ({
    filters,
    setFilters,
    onFilterChange,
    onSearch,
    onClearFilters,
    hasActiveFilters
}) => {
    // Filter options
    // Đã chuyển categoryOptions và sortOptions sang constant.js

    return (
        <Card className="mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FilterOutlined />
                    Bộ lọc tin tức
                </h3>
                <Button
                    icon={<ClearOutlined />}
                    onClick={onClearFilters}
                    disabled={!hasActiveFilters}
                    type="default"
                >
                    Xóa bộ lọc
                </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <Input.Search
                    placeholder="Tìm kiếm tin tức theo tiêu đề, nội dung..."
                    size="large"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onSearch={onSearch}
                    prefix={<SearchOutlined />}
                    allowClear
                    enterButton="Tìm kiếm"
                />
            </div>

        </Card>
    );
};

export default NewsFilters;