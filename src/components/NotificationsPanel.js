import React, { useState, useEffect } from 'react';
import { 
    CloseOutlined, 
    FullscreenOutlined, 
    SettingOutlined,
    UserOutlined,
    FileTextOutlined,
    MessageOutlined
} from '@ant-design/icons';

const NotificationsPanel = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('all');

    // Prevent body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const notifications = [
        {
            id: 1,
            type: 'lead',
            user: 'Wade Warren',
            action: 'added new lead',
            target: 'Brooklyn Simmons',
            time: '12 min ago',
            category: 'Lead',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            unread: true
        },
        {
            id: 2,
            type: 'lead',
            user: 'Esther Howard',
            action: 'added new lead',
            target: 'Leslie Alexander',
            time: '12 min ago',
            category: 'Lead',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
            unread: true
        },
        {
            id: 3,
            type: 'reply',
            user: 'Jenny Willson',
            action: 'sent you reply',
            message: 'We have scheduled a meeting for next week.',
            time: '12 min ago',
            category: 'Reply',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
            unread: true,
            color: 'bg-green-100'
        },
        {
            id: 4,
            type: 'reply',
            user: 'Robert Fox',
            action: 'sent you reply',
            message: 'Please ensure the feedback is constructive and actionable. We need to finalize this by tomorrow.',
            time: '12 min ago',
            category: 'Reply',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
            unread: true,
            color: 'bg-purple-100'
        },
        {
            id: 5,
            type: 'file',
            user: 'Emily',
            action: 'sent Files',
            file: 'Copies of Government.pdf',
            fileSize: '2 MB',
            time: '12 min ago',
            category: 'File',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
            unread: false
        },
        {
            id: 6,
            type: 'lead',
            user: 'Sarah Johnson',
            action: 'added new lead',
            target: 'Michael Chen',
            time: '15 min ago',
            category: 'Lead',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
            unread: true
        },
        {
            id: 7,
            type: 'reply',
            user: 'David Wilson',
            action: 'sent you reply',
            message: 'Great work on the latest project! Looking forward to our next collaboration.',
            time: '18 min ago',
            category: 'Reply',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
            unread: true,
            color: 'bg-blue-100'
        },
        {
            id: 8,
            type: 'file',
            user: 'Lisa Anderson',
            action: 'sent Files',
            file: 'Project_Report_Q4.pdf',
            fileSize: '5.2 MB',
            time: '25 min ago',
            category: 'File',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
            unread: false
        },
        {
            id: 9,
            type: 'lead',
            user: 'Tom Martinez',
            action: 'added new lead',
            target: 'Jessica Lee',
            time: '30 min ago',
            category: 'Lead',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            unread: false
        },
        {
            id: 10,
            type: 'reply',
            user: 'Maria Garcia',
            action: 'sent you reply',
            message: 'The client feedback has been incorporated. Please review the updated design.',
            time: '45 min ago',
            category: 'Reply',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
            unread: false,
            color: 'bg-yellow-100'
        },
        {
            id: 11,
            type: 'file',
            user: 'Alex Thompson',
            action: 'sent Files',
            file: 'Design_Mockups.zip',
            fileSize: '12.8 MB',
            time: '1 hour ago',
            category: 'File',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
            unread: false
        },
        {
            id: 12,
            type: 'lead',
            user: 'Rachel Green',
            action: 'added new lead',
            target: 'Kevin Park',
            time: '1 hour ago',
            category: 'Lead',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
            unread: false
        },
        {
            id: 13,
            type: 'reply',
            user: 'Chris Brown',
            action: 'sent you reply',
            message: 'Meeting rescheduled to tomorrow at 2 PM. Please update your calendar.',
            time: '2 hours ago',
            category: 'Reply',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            unread: false,
            color: 'bg-red-100'
        },
        {
            id: 14,
            type: 'file',
            user: 'Sophie Turner',
            action: 'sent Files',
            file: 'Budget_2024.xlsx',
            fileSize: '3.1 MB',
            time: '3 hours ago',
            category: 'File',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
            unread: false
        },
        {
            id: 15,
            type: 'lead',
            user: 'Mike Davis',
            action: 'added new lead',
            target: 'Amanda White',
            time: '4 hours ago',
            category: 'Lead',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
            unread: false
        }
    ];

    const filteredNotifications = notifications.filter(notification => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return notification.unread;
        if (activeTab === 'mentions') return notification.type === 'reply';
        return true;
    });

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <>
            <style>
                {`
                    @keyframes slideInFromRight {
                        from {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes slideOutToRight {
                        from {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                    }
                    
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes fadeOut {
                        from {
                            opacity: 1;
                            transform: translateY(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                    }
                    
                    /* Custom scrollbar for notifications list */
                    .notifications-scroll::-webkit-scrollbar {
                        width: 6px;
                    }
                    
                    .notifications-scroll::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 3px;
                    }
                    
                    .notifications-scroll::-webkit-scrollbar-thumb {
                        background: #c1c1c1;
                        border-radius: 3px;
                    }
                    
                    .notifications-scroll::-webkit-scrollbar-thumb:hover {
                        background: #a8a8a8;
                    }
                    
                    /* Prevent horizontal scroll */
                    .notifications-scroll {
                        scrollbar-width: thin;
                        scrollbar-color: #c1c1c1 #f1f1f1;
                        max-height: calc(100vh - 200px);
                        height: 100%;
                    }
                    
                    /* Ensure proper flex behavior */
                    .panel-container {
                        display: flex;
                        flex-direction: column;
                        height: 100vh;
                    }
                    
                    .scrollable-content {
                        flex: 1;
                        overflow-y: auto;
                        overflow-x: hidden;
                        min-height: 0;
                    }

                    /* Disabled overlay styles */
                    .disabled-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.7);
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        backdrop-filter: blur(2px);
                    }

                    .disabled-message {
                        background: white;
                        padding: 2rem;
                        border-radius: 12px;
                        text-align: center;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                        max-width: 300px;
                    }
                `}
            </style>
            <div className={`fixed inset-0 z-50 flex justify-end transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-black transition-all duration-200 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`}
                    onClick={onClose}
                ></div>
            
            {/* Panel */}
            <div className={`relative w-96 h-full bg-white shadow-2xl transform transition-all duration-200 ease-out panel-container ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Disabled Overlay */}
                <div className="disabled-overlay">
                    <div className="disabled-message">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Tính năng đã bị vô hiệu hóa
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Giao diện thông báo hiện tại đang được bảo trì và không khả dụng.
                        </p>
                        <button 
                            onClick={onClose}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>

                

                {/* Header */}
                <div 
                    className={`flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`} 
                    style={{animationDelay: '100ms'}}
                >
                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110" disabled>
                            <FullscreenOutlined className="text-gray-400" />
                        </button>
                        <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110"
                            onClick={onClose}
                        >
                            <CloseOutlined className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div 
                    className={`flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`} 
                    style={{animationDelay: '200ms'}}
                >
                    <div className="flex space-x-6">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                activeTab === 'all' 
                                    ? 'text-purple-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            disabled
                        >
                            All
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('unread')}
                            className={`px-3 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                activeTab === 'unread' 
                                    ? 'text-purple-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            disabled
                        >
                            Unread
                        </button>
                        <button
                            onClick={() => setActiveTab('mentions')}
                            className={`px-3 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                activeTab === 'mentions' 
                                    ? 'text-purple-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            disabled
                        >
                            Mentions
                        </button>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110" disabled>
                        <SettingOutlined className="text-gray-400" />
                    </button>
                </div>

                {/* Notifications List */}
                <div className="scrollable-content notifications-scroll">
                    {filteredNotifications.map((notification, index) => (
                        <div 
                            key={notification.id} 
                            className="border-b border-gray-100"
                            style={{
                                animationDelay: `${index * 30}ms`,
                                animation: isOpen ? 'slideInFromRight 0.2s ease-out forwards' : 'slideOutToRight 0.2s ease-in forwards'
                            }}
                        >
                            <div className="p-4 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]">
                                <div className="flex items-start space-x-3">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={notification.avatar}
                                            alt={notification.user}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">{notification.user}</span>
                                                    {' '}
                                                    <span className="text-gray-600">{notification.action}</span>
                                                    {notification.target && (
                                                        <span className="font-medium"> {notification.target}</span>
                                                    )}
                                                </p>

                                                {/* Message bubble for replies */}
                                                {notification.type === 'reply' && (
                                                    <div className={`mt-2 p-3 rounded-lg ${notification.color}`}>
                                                        <p className="text-sm text-gray-800 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <button className="text-sm text-purple-600 font-medium hover:text-purple-700" disabled>
                                                            Reply
                                                        </button>
                                                    </div>
                                                )}

                                                {/* File info */}
                                                {notification.type === 'file' && (
                                                    <div className="mt-2 flex items-center space-x-2">
                                                        <FileTextOutlined className="text-gray-500" />
                                                        <span className="text-sm text-gray-700">
                                                            {notification.file}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {notification.fileSize}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        {notification.time} • {notification.category}
                                                    </span>
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default NotificationsPanel; 