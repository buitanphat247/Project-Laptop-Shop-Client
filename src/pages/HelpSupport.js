import React, { useState } from 'react';
import { Input, Card, Collapse, Typography, Space } from 'antd';
import {
    SearchOutlined,
    UserOutlined,
    CreditCardOutlined,
    TruckOutlined,
    GiftOutlined,
    ShoppingCartOutlined,
    MailOutlined,
    PhoneOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const HelpSupport = () => {
    const [searchValue, setSearchValue] = useState('');

    // Support Categories
    const supportCategories = [
        {
            icon: <ShoppingCartOutlined className="text-xl sm:text-2xl text-blue-600" />,
            title: 'Đơn hàng & Thanh toán',
            description: 'Hỗ trợ về đặt hàng, thanh toán và theo dõi đơn hàng'
        },
        {
            icon: <UserOutlined className="text-xl sm:text-2xl text-green-600" />,
            title: 'Tài khoản',
            description: 'Quản lý tài khoản, đăng nhập và bảo mật'
        },
        {
            icon: <TruckOutlined className="text-xl sm:text-2xl text-orange-600" />,
            title: 'Vận chuyển & Trả hàng',
            description: 'Thông tin về vận chuyển, thời gian giao hàng và chính sách trả hàng'
        },
        {
            icon: <GiftOutlined className="text-xl sm:text-2xl text-purple-600" />,
            title: 'Khuyến mãi & Ưu đãi',
            description: 'Thông tin về các chương trình khuyến mãi và mã giảm giá'
        }
    ];

    // FAQ Data
    const faqData = {
        general: [
            {
                question: 'Làm thế nào để kích hoạt tài khoản?',
                answer: 'Sau khi đăng ký, bạn sẽ nhận được email xác nhận. Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác nhận để kích hoạt tài khoản.'
            },
            {
                question: 'Điểm tích lũy là gì? Làm sao để kiếm điểm?',
                answer: 'Điểm tích lũy được tính dựa trên giá trị đơn hàng. Mỗi 10,000 VNĐ chi tiêu sẽ được 1 điểm. Điểm có thể dùng để giảm giá cho các đơn hàng tiếp theo.'
            },
            {
                question: 'Tại sao có giới hạn thanh toán?',
                answer: 'Giới hạn thanh toán được áp dụng để đảm bảo an toàn cho tài khoản của bạn. Bạn có thể liên hệ hỗ trợ để tăng giới hạn nếu cần thiết.'
            },
            {
                question: 'Làm sao để theo dõi đơn hàng và thanh toán?',
                answer: 'Bạn có thể theo dõi đơn hàng trong phần "Đơn hàng" của tài khoản. Hệ thống sẽ gửi email cập nhật trạng thái đơn hàng.'
            }
        ],
        payments: [
            {
                question: 'Các phương thức thanh toán nào được hỗ trợ?',
                answer: 'Chúng tôi hỗ trợ thanh toán bằng thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và thanh toán khi nhận hàng (COD).'
            },
            {
                question: 'Làm sao để thanh toán bằng PayPal?',
                answer: 'Chọn PayPal khi thanh toán, bạn sẽ được chuyển đến trang PayPal để đăng nhập và xác nhận thanh toán.'
            },
            {
                question: 'Có thể thanh toán bằng PayPal mà không cần tài khoản PayPal không?',
                answer: 'Có, bạn có thể thanh toán bằng thẻ tín dụng/ghi nợ thông qua PayPal mà không cần tạo tài khoản PayPal.'
            }
        ],
        accounts: [
            {
                question: 'Nếu quên mật khẩu thì sao?',
                answer: 'Nhấp vào "Quên mật khẩu" trên trang đăng nhập, nhập email và làm theo hướng dẫn để đặt lại mật khẩu.'
            },
            {
                question: 'Nếu quên tên đăng nhập thì sao?',
                answer: 'Tên đăng nhập thường là email của bạn. Nếu không nhớ, hãy liên hệ hỗ trợ với thông tin cá nhân để được hỗ trợ.'
            },
            {
                question: 'Nếu nghĩ tài khoản bị hack thì sao?',
                answer: 'Ngay lập tức thay đổi mật khẩu và liên hệ hỗ trợ. Chúng tôi sẽ kiểm tra và bảo vệ tài khoản của bạn.'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#faf5ff]  px-3  py-5 rounded-2xl overflow-hidden">
            <div className="bg-[#faf5ff] rounded-xl overflow-hidden flex flex-col gap-5 sm:gap-5 lg:gap-5">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white  rounded-lg">
                    <div className="w-full mx-auto text-center">
                        <Title level={1} className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 text-white">
                            Trung tâm Hỗ trợ
                        </Title>
                        <Text className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 block opacity-90">
                            Chúng tôi có thể giúp gì cho bạn?
                        </Text>

                        {/* Search Bar */}
                        <div className="w-full max-w-2xl mx-auto px-2">
                            <Input
                                size="large"
                                placeholder="Tìm kiếm hỗ trợ với từ khóa, mã lỗi, v.v."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="rounded-full shadow-lg"
                                style={{ height: '48px', fontSize: '14px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Support Categories */}
                <div className="flex flex-col gap-4 sm:gap-5">
                    <Title level={2} className="text-center text-2xl sm:text-3xl font-bold text-gray-800 px-2">
                        Hỗ trợ theo Danh mục
                    </Title>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {supportCategories.map((category, index) => (
                            <Card
                                key={index}
                                className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                                bodyStyle={{ padding: '1.5rem 1rem sm:2rem 1.5rem' }}
                            >
                                <div className="mb-3 sm:mb-4">
                                    {category.icon}
                                </div>
                                <Title level={4} className="mb-2 text-gray-800 text-base sm:text-lg">
                                    {category.title}
                                </Title>
                                <Text className="text-gray-600 text-xs sm:text-sm">
                                    {category.description}
                                </Text>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="flex flex-col gap-4 sm:gap-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Search by Category */}
                        <div className="lg:col-span-1 order-2 lg:order-1">
                            <Card className="shadow-md border-0">
                                <Title level={3} className="mb-4 sm:mb-6 text-gray-800 text-lg sm:text-xl">
                                    Tìm kiếm theo Danh mục
                                </Title>
                                <Space direction="vertical" size="small" className="w-full">
                                    <div className="flex items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                        <CreditCardOutlined className="text-yellow-500 text-base sm:text-lg mr-2 sm:mr-3" />
                                        <Text strong className="text-gray-700 text-sm sm:text-base">Thanh toán</Text>
                                    </div>
                                    <div className="flex items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                        <UserOutlined className="text-yellow-500 text-base sm:text-lg mr-2 sm:mr-3" />
                                        <Text strong className="text-gray-700 text-sm sm:text-base">Tài khoản</Text>
                                    </div>
                                    <div className="flex items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                        <TruckOutlined className="text-yellow-500 text-base sm:text-lg mr-2 sm:mr-3" />
                                        <Text strong className="text-gray-700 text-sm sm:text-base">Vận chuyển</Text>
                                    </div>
                                    <div className="flex items-center p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                        <GiftOutlined className="text-yellow-500 text-base sm:text-lg mr-2 sm:mr-3" />
                                        <Text strong className="text-gray-700 text-sm sm:text-base">Khác</Text>
                                    </div>
                                </Space>
                            </Card>
                        </div>

                        {/* FAQ Content */}
                        <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col gap-4 sm:gap-5">
                            {/* General Questions */}
                            <Card className="shadow-md border-0">
                                <Title level={3} className="mb-4 sm:mb-6 text-gray-800 text-lg sm:text-xl">
                                    Câu hỏi thường gặp
                                </Title>
                                <Collapse
                                    ghost
                                    expandIconPosition="end"
                                    className="faq-collapse"
                                >
                                    {faqData.general.map((item, index) => (
                                        <Panel
                                            header={
                                                <Text strong className="text-gray-700 text-sm sm:text-base">
                                                    {item.question}
                                                </Text>
                                            }
                                            key={index}
                                        >
                                            <Text className="text-gray-600 text-sm sm:text-base">
                                                {item.answer}
                                            </Text>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </Card>

                            {/* Payments FAQ */}
                            <Card className="shadow-md border-0">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <CreditCardOutlined className="text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3" />
                                    <Title level={3} className="mb-0 text-gray-800 text-lg sm:text-xl">
                                        Thanh toán
                                    </Title>
                                </div>
                                <Collapse
                                    ghost
                                    expandIconPosition="end"
                                    className="faq-collapse"
                                >
                                    {faqData.payments.map((item, index) => (
                                        <Panel
                                            header={
                                                <Text strong className="text-gray-700 text-sm sm:text-base">
                                                    {item.question}
                                                </Text>
                                            }
                                            key={index}
                                        >
                                            <Text className="text-gray-600 text-sm sm:text-base">
                                                {item.answer}
                                            </Text>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </Card>

                            {/* Accounts FAQ */}
                            <Card className="shadow-md border-0">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <UserOutlined className="text-yellow-500 text-lg sm:text-xl mr-2 sm:mr-3" />
                                    <Title level={3} className="mb-0 text-gray-800 text-lg sm:text-xl">
                                        Tài khoản
                                    </Title>
                                </div>
                                <Collapse
                                    ghost
                                    expandIconPosition="end"
                                    className="faq-collapse"
                                >
                                    {faqData.accounts.map((item, index) => (
                                        <Panel
                                            header={
                                                <Text strong className="text-gray-700 text-sm sm:text-base">
                                                    {item.question}
                                                </Text>
                                            }
                                            key={index}
                                        >
                                            <Text className="text-gray-600 text-sm sm:text-base">
                                                {item.answer}
                                            </Text>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col gap-4 sm:gap-5">
                    <Card className="shadow-md border-0 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm">
                        <div className="text-center">
                            <Title level={2} className="text-gray-800 mb-3 sm:mb-4 text-xl sm:text-2xl">
                                Vẫn cần hỗ trợ?
                            </Title>
                            <Text className="text-gray-600 mb-6 sm:mb-8 block text-sm sm:text-base">
                                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
                            </Text>
                            <div className="grid grid-cols-3 gap-5 justify-center">
                                <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <PhoneOutlined className="text-blue-600 text-lg sm:text-xl mb-2" />
                                    <div className="text-center hidden sm:block">
                                        <Text strong className="block text-gray-800 text-sm sm:text-base">Hotline</Text>
                                        <Text className="text-gray-600 text-xs sm:text-sm">1900-xxxx</Text>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <MailOutlined className="text-green-600 text-lg sm:text-xl mb-2" />
                                    <div className="text-center hidden sm:block">
                                        <Text strong className="block text-gray-800 text-sm sm:text-base">Email</Text>
                                        <Text className="text-gray-600 text-xs sm:text-sm">support@laptopshop.com</Text>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <FileTextOutlined className="text-purple-600 text-lg sm:text-xl mb-2" />
                                    <div className="text-center hidden sm:block">
                                        <Text strong className="block text-gray-800 text-sm sm:text-base">Live Chat</Text>
                                        <Text className="text-gray-600 text-xs sm:text-sm">24/7 Hỗ trợ</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <style>{`
                .faq-collapse .ant-collapse-item {
                    border-bottom: 1px solid #f0f0f0;
                }
                .faq-collapse .ant-collapse-item:last-child {
                    border-bottom: none;
                }
                .faq-collapse .ant-collapse-header {
                    padding: 12px 0 !important;
                }
                .faq-collapse .ant-collapse-content-box {
                    padding: 0 0 12px 0 !important;
                }
                
                @media (min-width: 640px) {
                    .faq-collapse .ant-collapse-header {
                        padding: 16px 0 !important;
                    }
                    .faq-collapse .ant-collapse-content-box {
                        padding: 0 0 16px 0 !important;
                    }
                }
                
                /* Custom background pattern */
                body {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    background-attachment: fixed;
                }
                
                /* Add subtle pattern overlay */
                .min-h-screen::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: -1;
                }
            `}</style>
        </div>
    );
};

export default HelpSupport;