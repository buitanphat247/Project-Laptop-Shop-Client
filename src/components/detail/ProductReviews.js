import React from 'react';
import { Row, Col, Typography, Divider, Button, Rate } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProductReviews = ({
    RATING_DATA,
    SAMPLE_REVIEWS,
    onShowAllReviews
}) => (
    <div className="mt-8 bg-white border rounded-lg p-6">
        <Title level={4} className="mb-4 text-gray-800 flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            Đánh giá sản phẩm
        </Title>
        <Divider className="my-4" />

        <Row gutter={[24, 24]}>
            {/* Rating Overview */}
            <Col xs={24} lg={8}>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-orange-500 mb-2">4.5</div>
                    <Rate disabled defaultValue={4.5} className="text-lg mb-2" />
                    <Text className="text-gray-500 block">128 đánh giá</Text>

                    <div className="mt-4 space-y-2">
                        {RATING_DATA.map((item) => (
                            <div key={item.star} className="flex items-center gap-2">
                                <Text className="text-sm w-3">{item.star}</Text>
                                <StarOutlined className="text-yellow-400" />
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <Text className="text-sm text-gray-500 w-8">{item.count}</Text>
                            </div>
                        ))}
                    </div>
                </div>
            </Col>

            {/* Reviews List */}
            <Col xs={24} lg={16}>
                <div className="mb-4">
                    <Button type="primary" icon={<StarOutlined />} className="mr-2">
                        Viết đánh giá
                    </Button>
                    <Button
                        icon={<StarOutlined />}
                        onClick={onShowAllReviews}
                    >
                        Xem tất cả
                    </Button>
                </div>

                <div className="max-h-[500px] overflow-y-auto space-y-4">
                    {SAMPLE_REVIEWS.slice(0, 3).map((review, index) => (
                        <div
                            key={review.id}
                            className={`${index < 2 ? 'border-b border-gray-100' : ''} pb-4`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 ${review.bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
                                    {review.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Text strong>{review.name}</Text>
                                        <Rate disabled defaultValue={review.rating} className="text-sm" />
                                    </div>
                                    <Text className="text-gray-600 leading-relaxed mb-2">
                                        {review.comment}
                                    </Text>
                                    <Text className="text-gray-400 text-sm">{review.time}</Text>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Col>
        </Row>
    </div>
);

export default ProductReviews;