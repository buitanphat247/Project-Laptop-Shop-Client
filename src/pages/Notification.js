
import React, { useState } from 'react';
import { BellOutlined, CheckCircleTwoTone, InfoCircleTwoTone } from '@ant-design/icons';

const mockNotifications = [
    {
        id: 1,
        title: 'Đơn hàng mới',
        message: 'Bạn vừa đặt thành công đơn hàng #12345.',
        read: false,
        time: '2 phút trước',
        type: 'order',
    },
    {
        id: 2,
        title: 'Khuyến mãi',
        message: 'Nhận ngay mã giảm giá 10% cho đơn hàng tiếp theo!',
        read: true,
        time: '1 giờ trước',
        type: 'promo',
    },
    {
        id: 3,
        title: 'Tin tức',
        message: 'Laptop mới vừa ra mắt, xem ngay!',
        read: false,
        time: 'Hôm nay',
        type: 'news',
    },
];

const Notification = () => {
    const [notifications, setNotifications] = useState(mockNotifications);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg min-h-[400px]">
            <div className="flex items-center mb-6">
                <BellOutlined className="text-blue-500 text-2xl mr-2" />
                <h2 className="text-2xl font-bold">Thông báo của bạn</h2>
            </div>
            {notifications.length === 0 ? (
                <div className="text-center text-gray-400 py-16">
                    <BellOutlined className="text-4xl mb-2" />
                    <div>Không có thông báo nào.</div>
                </div>
            ) : (
                <ul className="space-y-4">
                    {notifications.map((n) => (
                        <li
                            key={n.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border transition shadow-sm ${n.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
                        >
                            <div className="pt-1">
                                {n.type === 'order' && <CheckCircleTwoTone twoToneColor="#52c41a" className="text-xl" />}
                                {n.type === 'promo' && <InfoCircleTwoTone twoToneColor="#faad14" className="text-xl" />}
                                {n.type === 'news' && <BellOutlined className="text-blue-400 text-xl" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className={`font-semibold ${n.read ? 'text-gray-500' : 'text-blue-700'}`}>{n.title}</span>
                                    <span className="text-xs text-gray-400 ml-2">{n.time}</span>
                                </div>
                                <div className={`mt-1 ${n.read ? 'text-gray-500' : 'text-gray-800'}`}>{n.message}</div>
                            </div>
                            {!n.read && (
                                <button
                                    className="ml-2 px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                                    onClick={() => markAsRead(n.id)}
                                >
                                    Đánh dấu đã đọc
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;