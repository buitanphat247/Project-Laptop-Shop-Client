import React from 'react';
import { Row, Col, Typography, Divider, Button, Rate } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import useDeviceDetection from '../../hooks/useDeviceDetection';

const { Title, Text } = Typography;

const ProductReviews = ({
    RATING_DATA,
    SAMPLE_REVIEWS,
    onShowAllReviews
}) => {
    const { isMobile, isTablet, isDesktop } = useDeviceDetection();
    
    return (
        <div className="mt-4 sm:mt-6 lg:mt-8 bg-white border rounded-lg p-3 sm:p-4 lg:p-6">
            <Title level={4} className="mb-3 sm:mb-4 text-base sm:text-lg lg:text-xl text-gray-800 flex items-center gap-2">
                <StarOutlined className="text-yellow-500" />
                Đánh giá sản phẩm
            </Title>
            <Divider className="my-3 sm:my-4" />

            <Row gutter={[16, 16]} className="sm:gutter-[20, 20] lg:gutter-[24, 24]">
                {/* Rating Overview */}
                <Col xs={24} lg={8}>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:p-6 text-center">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-2">4.5</div>
                        <Rate disabled defaultValue={4.5} className="text-base sm:text-lg mb-2" />
                        <Text className="text-gray-500 block text-sm sm:text-base">128 đánh giá</Text>

                        <div className="mt-3 sm:mt-4 space-y-2">
                            {RATING_DATA.map((item) => (
                                <div key={item.star} className="flex items-center gap-2">
                                    <Text className="text-xs sm:text-sm w-3">{item.star}</Text>
                                    <StarOutlined className="text-yellow-400 text-xs sm:text-sm" />
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                                        <div
                                            className="bg-yellow-400 h-1.5 sm:h-2 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <Text className="text-xs sm:text-sm text-gray-500 w-6 sm:w-8">{item.count}</Text>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>

                {/* Reviews List */}
                <Col xs={24} lg={16}>
                    <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button 
                            type="primary" 
                            icon={<StarOutlined />} 
                            className="mr-0 sm:mr-2 text-xs sm:text-sm"
                            size="small"
                        >
                            Viết đánh giá
                        </Button>
                    </div>

                    <div className="max-h-[400px] sm:max-h-[450px] lg:max-h-[500px] overflow-y-auto space-y-3 sm:space-y-4">
                        {SAMPLE_REVIEWS.map((review, index) => (
                            <div
                                key={review.id}
                                className={`${index < SAMPLE_REVIEWS.length - 1 ? 'border-b border-gray-100' : ''} pb-3 sm:pb-4`}
                            >
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${review.bgColor} rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm lg:text-base`}>
                                        {review.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                            <Text strong className="text-sm sm:text-base">{review.name}</Text>
                                            <Rate disabled defaultValue={review.rating} className="text-xs sm:text-sm" />
                                        </div>
                                        <Text className="text-gray-600 leading-relaxed mb-2 text-sm sm:text-base">
                                            {review.comment}
                                        </Text>
                                        <Text className="text-gray-400 text-xs sm:text-sm">{review.time}</Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductReviews;