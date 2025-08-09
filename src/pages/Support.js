import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SendOutlined, UserOutlined, MessageOutlined, CheckCircleOutlined, CloseCircleOutlined, TeamOutlined, PhoneOutlined, VideoCameraOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

function getDecodedProfileUser() {
    const rawCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('profile_user'))
        ?.split('=')[1];

    if (!rawCookie) return null;

    const cookieValue = decodeURIComponent(rawCookie);

    // 1. Thử parse trực tiếp (cookie là JSON string)
    try {
        return JSON.parse(cookieValue);
    } catch { }

    // 2. Thử base64 (1 lớp hoặc 2 lớp)
    try {
        let decoded = atob(cookieValue);
        try {
            // Nếu decode lần nữa mà thành JSON thì là base64 double
            const decodedTwice = atob(decoded);
            return JSON.parse(decodedTwice);
        } catch {
            // Nếu không thì chỉ base64 1 lớp
            return JSON.parse(decoded);
        }
    } catch { }

    // 3. Thử parse kiểu JWT
    try {
        const parts = cookieValue.split('.');
        if (parts.length === 3) {
            const payload = parts[1];
            const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
            const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
            const decodedPayload = atob(base64);
            return JSON.parse(decodedPayload);
        }
    } catch { }

    return null;
}

const Support = () => {
    // Gọi tất cả hook ở đầu component
    const { user, role, isLoggedIn, isAuthLoading } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserSocketId, setSelectedUserSocketId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState(new Set());

    useEffect(() => {
        if (!user) return;
        const newSocket = io('http://localhost:3030');
        setSocket(newSocket);

        // Check if user is admin
        if (user && user.role === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        // Socket event listeners
        newSocket.on('connect', () => {
            setIsConnected(true);
            if (user) {
                newSocket.emit('join', user);
            }
        });

        newSocket.on('receive_message', (data) => {
            setMessages(prev => [...prev, data])
        });

        newSocket.on('users_list', (usersList) => {
            setConnectedUsers(usersList);
        });

        newSocket.on('typing_start', (data) => {
            setTypingUsers(prev => new Set([...prev, data.userId]));
        });

        newSocket.on('typing_stop', (data) => {
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.off('receive_message');
            newSocket.off('users_list');
            newSocket.off('typing_start');
            newSocket.off('typing_stop');
            newSocket.close();
        };
    }, [user]);

    // Sau khi gọi hết hook, mới kiểm tra loading và return skeleton nếu cần
    if (isAuthLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-pulse w-32 h-32 bg-gray-200 rounded-full"></div>
            </div>
        );
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket && isConnected && user) {
            socket.emit('send_message', {
                from: user.id,
                to: 'admin',
                role: user.role,
                email: user.email,
                message: message,
                timestamp: new Date().toISOString()
            });
            setMessage('');
            // Stop typing indicator
            socket.emit('typing_stop', { userId: user.id, role: user.role });
            setIsTyping(false);
        }
    };

    // Hàm gửi tin nhắn riêng cho admin
    const handleAdminSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket && isConnected && selectedUserSocketId && user) {
            socket.emit('admin_send_message', {
                from: user.id,
                to: selectedUserSocketId,
                role: user.role,
                email: user.email,
                message: message,
                timestamp: new Date().toISOString(),
                target_user_id: selectedUser.userId
            });
            setMessage('');
            // Stop typing indicator
            socket.emit('typing_stop', {
                userId: user.id,
                role: user.role,
                targetUserId: selectedUser?.userId
            });
            setIsTyping(false);
        }
    };

    // Hàm xử lý khi user đang nhập tin nhắn
    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (!user) return;
        if (!isTyping && e.target.value.trim()) {
            setIsTyping(true);
            socket.emit('typing_start', {
                userId: user.id,
                role: user.role,
                targetUserId: isAdmin ? selectedUser?.userId : null
            });
        } else if (isTyping && !e.target.value.trim()) {
            setIsTyping(false);
            socket.emit('typing_stop', {
                userId: user.id,
                role: user.role,
                targetUserId: isAdmin ? selectedUser?.userId : null
            });
        }
    };

    // Lọc tin nhắn theo user được chọn
    const getMessagesForSelectedUser = () => {
        if (!selectedUser) return [];
        return messages.filter(msg =>
            msg.from === selectedUser.userId ||
            (msg.target_user_id === selectedUser.userId && msg.role === 'admin')
        );
    };

    const selectedUserMessages = getMessagesForSelectedUser();

    // Helper to get the latest message for a user
    const getLatestMessage = (userId) => {
        const userMessages = messages.filter(msg => msg.from === userId || msg.target_user_id === userId);
        if (userMessages.length === 0) return 'Chưa có tin nhắn';
        const latestMessage = userMessages[userMessages.length - 1];
        if (latestMessage.role === 'admin') {
            return `Bạn: ${latestMessage.message}`;
        } else {
            return `User: ${latestMessage.message}`;
        }
    };

    // Admin UI
    if (isAdmin) {
        return (
            <div className="bg-gray-50 ">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <UserOutlined className="text-white text-lg" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800">
                                    Admin Dashboard
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Quản lý hỗ trợ khách hàng
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Connection Status */}
                          

                            {/* Admin Info */}
                            {user && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 rounded-lg">
                                    <span className="text-sm text-red-700 font-medium">
                                        {user.name || user.email || 'Admin'}
                                    </span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-red-200 text-red-700">
                                        Admin
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex h-full">
                    {/* Sidebar */}
                    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                        {/* Sidebar Header */}


                        {/* Users List */}
                        <div className="flex-1 overflow-y-auto">
                            {connectedUsers.length > 0 ? (
                                connectedUsers
                                    .filter(user => user.role !== 'admin') // Loại bỏ admin khỏi danh sách
                                    .map((user, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                            selectedUser && selectedUser.userId === user.userId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                                        }`}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setSelectedUserSocketId(user.socket_id);
                                        }}
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                                <UserOutlined className="text-gray-600" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-800 truncate">
                                                {user.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {getLatestMessage(user.userId)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <TeamOutlined className="text-4xl mb-2" />
                                    <p>Chưa có người dùng nhắn tin</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <UserOutlined className="text-gray-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-800">
                                            {selectedUser ? selectedUser.name : 'Chọn người dùng để hỗ trợ'}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {selectedUser ? selectedUser.email : 'Chọn một người dùng từ danh sách bên trái'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-2 hover:bg-gray-100 rounded-full">
                                        <PhoneOutlined className="text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-full">
                                        <VideoCameraOutlined className="text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded-full">
                                        <InfoCircleOutlined className="text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {selectedUser ? (
                                <div className="space-y-4">
                                    {selectedUserMessages.length > 0 ? (
                                        selectedUserMessages.map((msg, index) => (
                                            <div key={index} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md xl:max-w-lg break-words ${
                                                    msg.role === 'admin' 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        msg.role === 'admin' 
                                                            ? 'text-blue-200' 
                                                            : 'text-gray-500'
                                                    }`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <MessageOutlined className="text-4xl mb-2" />
                                            <p>Chưa có tin nhắn từ {selectedUser.name}</p>
                                        </div>
                                    )}
                                    
                                    {/* Typing Indicator for Admin */}
                                    {typingUsers.has(selectedUser?.userId) && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                                                <div className="flex items-center space-x-1">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        {selectedUser?.name} đang soạn tin nhắn...
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <MessageOutlined className="text-6xl text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        Chọn cuộc trò chuyện để bắt đầu
                                    </h3>
                                    <p className="text-gray-500">
                                        Chọn một người dùng từ danh sách bên trái để hỗ trợ
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <form onSubmit={handleAdminSendMessage} className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    placeholder={selectedUser ? (isConnected ? "Nhập tin nhắn..." : "Đang kết nối...") : "Vui lòng chọn người dùng để nhắn tin"}
                                    value={message}
                                    onChange={handleTyping}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                    disabled={!isConnected || !selectedUser}
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() || !isConnected || !selectedUser}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SendOutlined />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Regular User UI
    return (
        <div className="bg-white">
            <div className=" mx-auto flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <UserOutlined className="text-white text-lg" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800">
                                    💬 Chat Support
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Xin chào! Chúng tôi sẽ hỗ trợ bạn ngay
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Connection Status */}
                            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isConnected
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                {isConnected ? (
                                    <CheckCircleOutlined className="text-green-600" />
                                ) : (
                                    <CloseCircleOutlined className="text-red-600" />
                                )}
                                <span className="text-sm font-medium">
                                    {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
                                </span>
                            </div>

                            {/* User Info */}
                            {user && (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                                    <span className="text-sm text-gray-600">
                                        {user.name || user.email || 'User'}
                                    </span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                        User
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {messages.length > 0 ? (
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'admin' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md xl:max-w-lg break-words ${
                                        msg.role === 'admin' 
                                            ? 'bg-white text-gray-800 shadow-sm border border-gray-200' 
                                            : 'bg-blue-600 text-white'
                                    }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                        <p className={`text-xs mt-1 ${
                                            msg.role === 'admin' 
                                                ? 'text-gray-500' 
                                                : 'text-blue-200'
                                        }`}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Typing Indicator for User */}
                            {(() => {
                                // Kiểm tra xem có admin nào đang nhập không
                                const adminTyping = Array.from(typingUsers).some(userId => {
                                    // Nếu có user nào đang typing và không phải là user hiện tại, thì đó là admin
                                    const currentUser = getDecodedProfileUser();
                                    return userId !== currentUser?.id;
                                });
                                
                                console.log('📝 Typing users:', Array.from(typingUsers));
                                console.log('👨‍💼 Admin typing:', adminTyping);
                                
                                return adminTyping ? (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                                            <div className="flex items-center space-x-1">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                </div>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    Admin đang soạn tin nhắn...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : null;
                            })()}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MessageOutlined className="text-6xl text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Chào mừng đến với Support Chat
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Chúng tôi sẽ kết nối bạn với nhân viên hỗ trợ ngay
                            </p>
                            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${isConnected
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {isConnected ? (
                                    <CheckCircleOutlined className="text-green-600" />
                                ) : (
                                    <CloseCircleOutlined className="text-yellow-600" />
                                )}
                                <span className="text-sm font-medium">
                                    {isConnected ? 'Đã sẵn sàng nhận hỗ trợ' : 'Đang kết nối với server...'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-4">
                        <input
                            type="text"
                            placeholder={isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."}
                            value={message}
                            onChange={handleTyping}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            disabled={!isConnected}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || !isConnected}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <SendOutlined />
                            <span>Gửi</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Support;