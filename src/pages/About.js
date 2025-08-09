import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import CardReview from '../components/card/CardReview';

const reviews = [
    {
        name: "Nguyễn Văn A",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        comment: "Sản phẩm rất chất lượng, giao hàng nhanh, nhân viên hỗ trợ nhiệt tình. Sẽ ủng hộ thêm!"
    },
    {
        name: "Trần Thị B",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 4,
        comment: "Dịch vụ ổn, hàng chuẩn. Giao đúng hẹn, đóng gói chắc chắn."
    },
    {
        name: "Lê Văn C",
        avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
        rating: 5,
        comment: "Tư vấn nhiệt tình, hàng mới nguyên seal, giá tốt. Rất đáng mua!"
    },
    {
        name: "Phạm Thị Dung",
        avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 4,
        comment: "Shop nhiệt tình, đóng gói cẩn thận. Tuy nhiên giao hơi chậm một chút."
    },
    {
        name: "Đỗ Minh Tuấn",
        avatarUrl: "https://randomuser.me/api/portraits/men/90.jpg",
        rating: 5,
        comment: "Hàng đúng mô tả, dùng ổn định. Mình đã giới thiệu cho bạn bè rồi!"
    },
    {
        name: "Vũ Thị Hạnh",
        avatarUrl: "https://randomuser.me/api/portraits/women/15.jpg",
        rating: 5,
        comment: "Từ tư vấn đến giao hàng đều rất chuyên nghiệp. Sản phẩm dùng ổn định."
    },
    {
        name: "Hoàng Văn Long",
        avatarUrl: "https://randomuser.me/api/portraits/men/51.jpg",
        rating: 3,
        comment: "Sản phẩm ổn, nhưng giao hàng trễ 1 ngày so với dự kiến."
    },
    {
        name: "Ngô Thị Lan",
        avatarUrl: "https://randomuser.me/api/portraits/women/27.jpg",
        rating: 4,
        comment: "Nhân viên dễ thương, hỗ trợ nhanh. Giá cả hợp lý, sẽ quay lại."
    }
];

const About = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 250);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <Spin size="large" tip="Đang tải thông tin về chúng tôi..." />
            </div>
        );
    }

    return (
        <div className='space-y-8'>
            {/* Tiêu đề */}
            <h1 className="text-4xl font-bold text-blue-600">Về chúng tôi</h1>

            {/* Ảnh đại diện + mô tả */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
                <img
                    src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482887byM/anh-mo-ta.png"
                    alt="Laptop Shop NTK"
                    className="w-full max-w-md rounded-lg shadow-lg"
                />
                <div className="text-gray-700 space-y-4 text-justify">
                    <p>
                        Chào mừng bạn đến với <span className="font-semibold text-blue-500">Laptop Shop NTK</span> – nơi cung cấp các sản phẩm công nghệ chất lượng, giá cả phải chăng và dịch vụ tận tâm.
                    </p>
                    <p>
                        Với nhiều năm kinh nghiệm trong lĩnh vực phân phối laptop, thiết bị di động và phụ kiện chính hãng, chúng tôi cam kết mang đến cho khách hàng trải nghiệm mua sắm tiện lợi và uy tín nhất.
                    </p>
                    <p>
                        Mọi sản phẩm đều được kiểm tra kỹ lưỡng trước khi giao hàng, bảo hành chính hãng và hỗ trợ kỹ thuật 24/7.
                        Đội ngũ nhân viên nhiệt tình, sẵn sàng tư vấn để bạn chọn được sản phẩm phù hợp với nhu cầu.
                    </p>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">📌 Thông tin liên hệ</h2>
                        <ul className="text-gray-700 leading-relaxed text-lg">
                            <li>📍 Địa chỉ: 123 Nguyễn Văn A, TP. Bà Rịa</li>
                            <li>📞 Hotline: 0909 999 999</li>
                            <li>📧 Email: support@ntklaptop.vn</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">💬 Đánh giá từ khách hàng</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {reviews.map((review, index) => (
                        <CardReview
                            key={index}
                            name={review.name}
                            avatarUrl={review.avatarUrl}
                            rating={review.rating}
                            comment={review.comment}
                        />
                    ))}
                </div>
            </div>

            {/* Google Maps */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">🗺️ Bản đồ</h2>
                <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
                    <iframe
                        title="Google Map"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        style={{ border: 0 }}
                        allowFullScreen
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7293819504995!2d106.67570531533498!3d10.83334669228164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528d86b6fc05f%3A0xa0a313b2d09f38f9!2zU2FuaCBUcmFuZyBDaMOtbmggTmdoaeG7h3AgUXXDoW4!5e0!3m2!1sen!2s!4v1615193483773!5m2!1sen!2s"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default About;
