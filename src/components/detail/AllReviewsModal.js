import React from 'react';
import { Modal, Button, Row, Col, Rate, Typography } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { Text } = Typography;

const AllReviewsModal = ({
    open,
    onClose,
    RATING_DATA,
    SAMPLE_REVIEWS
}) => (
    <Modal
        title={
            <div className="flex items-center gap-2">
                <StarOutlined className="text-yellow-500" />
                <span>Tất cả đánh giá sản phẩm</span>
            </div>
        }
        open={open}
        onCancel={onClose}
        footer={[
            <Button key="close" onClick={onClose}>
                Đóng
            </Button>,
            <Button key="write" type="primary" icon={<StarOutlined />}>
                Viết đánh giá
            </Button>
        ]}
        width={900}
        className="reviews-modal"
    >
        <div className="mb-4">
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-500 mb-2">4.5</div>
                            <Rate disabled defaultValue={4.5} className="mb-2" />
                            <Text className="text-gray-500 block">Dựa trên 128 đánh giá</Text>
                        </div>
                    </Col>
                    <Col xs={24} md={16}>
                        <div className="space-y-2">
                            {RATING_DATA.map((item) => (
                                <div key={item.star} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-12">
                                        <Text className="text-sm">{item.star}</Text>
                                        <StarOutlined className="text-yellow-400 text-xs" />
                                    </div>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <Text className="text-sm text-gray-500 w-8">{item.count}</Text>
                                    <Text className="text-sm text-gray-400 w-12">{item.percentage}%</Text>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Filter Options */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <Text strong className="text-sm mr-2">Lọc theo:</Text>
                <Button size="small" type="primary">Tất cả</Button>
                <Button size="small">5 sao ({RATING_DATA[0].count})</Button>
                <Button size="small">4 sao ({RATING_DATA[1].count})</Button>
                <Button size="small">3 sao ({RATING_DATA[2].count})</Button>
                <Button size="small">Có hình ảnh</Button>
            </div>
        </div>

        {/* All Reviews List */}
        <div className="max-h-[350px] overflow-y-auto">
            <div className="space-y-4">
                {SAMPLE_REVIEWS.map((review, index) => (
                    <div
                        key={review.id}
                        className={`${index < SAMPLE_REVIEWS.length - 1 ? 'border-b border-gray-100' : ''} pb-4`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 ${review.bgColor} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                                {review.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <Text strong className="text-gray-800">{review.name}</Text>
                                    <Rate disabled defaultValue={review.rating} className="text-sm" />
                                    <Text className="text-gray-400 text-xs">{review.time}</Text>
                                </div>
                                <Text className="text-gray-600 leading-relaxed mb-3">
                                    {review.comment}
                                </Text>
                                {index === 0 && (
                                    <div className="flex gap-2 mb-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                                            <Text className="text-xs text-gray-400">IMG</Text>
                                        </div>
                                        <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                                            <Text className="text-xs text-gray-400">IMG</Text>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm">
                                    <Button type="text" size="small" className="text-gray-500 hover:text-blue-600 p-0">
                                        👍 Hữu ích (12)
                                    </Button>
                                    <Button type="text" size="small" className="text-gray-500 hover:text-blue-600 p-0">
                                        💬 Trả lời
                                    </Button>
                                    <Button type="text" size="small" className="text-gray-500 hover:text-red-600 p-0">
                                        🚩 Báo cáo
                                    </Button>
                                </div>
                                {/* Seller Response (Optional) */}
                                {index === 1 && (
                                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Text className="text-xs text-white font-bold">S</Text>
                                            </div>
                                            <Text strong className="text-blue-700 text-sm">Phản hồi từ Shop</Text>
                                            <Text className="text-gray-400 text-xs">1 tuần trước</Text>
                                        </div>
                                        <Text className="text-gray-700 text-sm leading-relaxed">
                                            Cảm ơn bạn đã tin tưởng và mua hàng tại shop! Chúng tôi rất vui khi sản phẩm đáp ứng được nhu cầu của bạn. Nếu có bất kỳ thắc mắc nào, hãy liên hệ với chúng tôi nhé!
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Load More Button */}
            <div className="text-center pt-4">
                <Button type="dashed" icon={<StarOutlined />}>
                    Xem thêm đánh giá
                </Button>
            </div>
        </div>
    </Modal>
);

export default AllReviewsModal;