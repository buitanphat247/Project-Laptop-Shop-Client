import React from 'react';
import { Breadcrumb, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const BreadcrumbNav = ({
    navigate,
    product,
    truncatedProductName
}) => (
    <>
        <Breadcrumb className="mb-4" separator=">">
            <Breadcrumb.Item>
                <Button
                    type="link"
                    onClick={() => navigate('/')}
                    className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800"
                >
                    Trang chủ
                </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Button
                    type="link"
                    className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800"
                    onClick={() => navigate('/products')}
                >
                    {product.category?.name || 'Sản phẩm'}
                </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <span className="text-xs text-gray-600 font-medium">
                    {truncatedProductName}
                </span>
            </Breadcrumb.Item>
        </Breadcrumb>

        <Button
            size="small"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="mb-4"
        >
            Quay lại
        </Button>
    </>
);

export default BreadcrumbNav;