import React from 'react';
import { Spin, Divider, Typography } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import CardProduct from '../card/CardProduct';

const { Title, Text } = Typography;

const RelatedProducts = ({ loadingRelated, relatedProducts, FALLBACK_IMAGE }) => (
    <div className="mt-6 bg-white border rounded-lg p-5">
        <Title level={4} className="mb-3">Sản phẩm liên quan</Title>
        <Divider className="my-4" />

        {loadingRelated ? (
            <div className="text-center py-8">
                <Spin tip="Đang tải sản phẩm liên quan..." />
            </div>
        ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {relatedProducts.map((relatedProduct) => (
                    <CardProduct
                        key={relatedProduct.id}
                        id={relatedProduct.id}
                        name={relatedProduct.name}
                        desc={relatedProduct.description}
                        imageUrl={relatedProduct.imageUrls?.[0] || FALLBACK_IMAGE}
                        price={relatedProduct.price}
                        stock={relatedProduct.stock}
                        category={relatedProduct.categoryInfo}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-6 text-gray-500">
                <StarOutlined className="text-2xl mb-3" />
                <Text>Không có sản phẩm liên quan</Text>
            </div>
        )}
    </div>
);

export default RelatedProducts;