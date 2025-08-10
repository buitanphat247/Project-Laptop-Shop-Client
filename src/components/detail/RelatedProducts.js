import React from 'react';
import { Spin, Divider, Typography } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import CardProduct from '../card/CardProduct';

const { Title, Text } = Typography;

const RelatedProducts = ({ loadingRelated, relatedProducts, FALLBACK_IMAGE }) => (
    <div className="mt-4 sm:mt-6 border rounded-lg p-3 sm:p-5">
        <Title level={4} className="mb-2 sm:mb-3 text-base sm:text-lg">Sản phẩm liên quan</Title>
        <Divider className="my-2 sm:my-4" />

        {loadingRelated ? (
            <div className="text-center py-6 sm:py-8">
                <Spin tip="Đang tải sản phẩm liên quan..." />
            </div>
        ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
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
            <div className="text-center py-4 sm:py-6 text-gray-500">
                <StarOutlined className="text-xl sm:text-2xl mb-2 sm:mb-3" />
                <Text className="text-sm sm:text-base">Không có sản phẩm liên quan</Text>
            </div>
        )}
    </div>
);

export default RelatedProducts;