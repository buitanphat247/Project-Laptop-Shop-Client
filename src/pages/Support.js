import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SendOutlined, UserOutlined, MessageOutlined, CheckCircleOutlined, CloseCircleOutlined, TeamOutlined, PhoneOutlined, VideoCameraOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../config/axios';

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
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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

        // Load tin nhắn từ database khi component mount
        const loadMessagesFromDatabase = async () => {
            setIsLoadingMessages(true);
            try {
                const response = await axiosClient.get(`/load-messages/${user.id}?role=${user.role}`);
                if (response.data.success && response.data.data.length > 0) {
                    console.log('response.data.data: ', response.data.data);
                    // Chuyển đổi tin nhắn từ database sang format hiển thị
                    const dbMessages = response.data.data.flatMap(conversation => {
                        return conversation.messages.map(msg => {
                            // Xác định role của người gửi
                            let senderRole;
                            if (msg.senderId === user.id) {
                                senderRole = user.role; // Người gửi là user hiện tại
                            } else if (msg.senderId === 1) {
                                senderRole = 'admin'; // Người gửi là admin
                            } else {
                                senderRole = 'user'; // Người gửi là user khác
                            }

                            // Xác định email dựa trên senderId
                            let senderEmail;
                            if (msg.senderId === 1) {
                                senderEmail = 'admin@gmail.com'; // Admin email
                            } else if (msg.senderId === user.id) {
                                senderEmail = user.email; // User hiện tại
                            } else {
                                senderEmail = 'user@gmail.com'; // User khác
                            }

                            return {
                                from: msg.senderId,
                                to: msg.receiverId,
                                role: senderRole,
                                email: senderEmail,
                                message: msg.content,
                                timestamp: msg.createdAt,
                                target_user_id: msg.receiverId
                            };
                        });
                    });
                    console.log('dbMessages: ', dbMessages);

                    // Kiểm tra và loại bỏ duplicate messages
                    setMessages(prevMessages => {
                        const existingMessageIds = new Set();
                        const uniqueMessages = [];

                        // Lấy tất cả tin nhắn từ database và tin nhắn hiện tại
                        const allMessages = [...prevMessages, ...dbMessages];

                        allMessages.forEach(msg => {
                            // Tạo unique key cho mỗi tin nhắn
                            const messageKey = `${msg.from}-${msg.to}-${msg.message}-${msg.timestamp}`;

                            if (!existingMessageIds.has(messageKey)) {
                                existingMessageIds.add(messageKey);
                                uniqueMessages.push(msg);
                            }
                        });

                        console.log('✅ Đã loại bỏ duplicate, tổng tin nhắn:', uniqueMessages.length);
                        return uniqueMessages;
                    });

                    console.log('✅ Đã load tin nhắn từ database:', dbMessages.length, 'tin nhắn');
                }
            } catch (error) {
                console.error('❌ Lỗi load tin nhắn từ database:', error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        loadMessagesFromDatabase();

        // Socket event listeners
        newSocket.on('connect', () => {
            setIsConnected(true);
            if (user) {
                newSocket.emit('join', user);
            }
        });

        newSocket.on('receive_message', (data) => {
            setMessages(prev => {
                // Kiểm tra xem tin nhắn đã tồn tại chưa để tránh duplicate
                const isDuplicate = prev.some(msg =>
                    msg.from === data.from &&
                    msg.to === data.to &&
                    msg.message === data.message &&
                    msg.timestamp === data.timestamp
                );

                if (isDuplicate) {
                    console.log('🚫 Tin nhắn duplicate, bỏ qua:', data);
                    return prev;
                }

                console.log('✅ Thêm tin nhắn mới từ socket:', data);
                return [...prev, data];
            });
        });

        newSocket.on('users_list', (usersList) => {
            // Merge users online với users từ database
            setConnectedUsers(prevUsers => {
                const onlineUsers = new Map(usersList.map(user => [user.userId, user]));
                const mergedUsers = prevUsers.map(dbUser => ({
                    ...dbUser,
                    socket_id: onlineUsers.get(dbUser.userId)?.socket_id || null,
                    isOnline: onlineUsers.has(dbUser.userId)
                }));

                // Thêm users mới online mà chưa có trong database
                const newOnlineUsers = usersList.filter(onlineUser =>
                    !prevUsers.some(dbUser => dbUser.userId === onlineUser.userId)
                );

                return [...mergedUsers, ...newOnlineUsers];
            });
        });

        // Load danh sách users cho admin từ database
        const loadUsersFromDatabase = async () => {
            if (user.role === 'admin') {
                setIsLoadingUsers(true);
                try {
                    const response = await axiosClient.get(`/load-messages/${user.id}?role=admin`);
                    if (response.data.success && response.data.data.length > 0) {
                        // Chuyển đổi conversations thành danh sách users
                        const usersFromDB = response.data.data.map(conversation => {
                            const otherUser = conversation.user1Id === user.id ? conversation.user2 : conversation.user1;
                            return {
                                userId: otherUser.id,
                                email: otherUser.email,
                                role: otherUser.id === 1 ? 'admin' : 'user',
                                name: otherUser.fullName || otherUser.email,
                                socket_id: null // Sẽ được cập nhật khi user online
                            };
                        }).filter(user => user.role !== 'admin'); // Loại bỏ admin khỏi danh sách

                        setConnectedUsers(usersFromDB);
                        console.log('✅ Đã load danh sách users từ database:', usersFromDB.length, 'users');
                    }
                } catch (error) {
                    console.error('❌ Lỗi load users từ database:', error);
                } finally {
                    setIsLoadingUsers(false);
                }
            }
        };

        loadUsersFromDatabase();

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

    // Function để load tin nhắn cho user cụ thể
    const loadMessagesForUser = async (targetUserId) => {
        try {
            const response = await axiosClient.get(`/messages/${user.id}/${targetUserId}`);
            if (response.data.success && response.data.data.messages) {
                // Chuyển đổi tin nhắn sang format hiển thị
                const userMessages = response.data.data.messages.map(msg => {
                    // Xác định role của người gửi
                    let senderRole;
                    if (msg.senderId === user.id) {
                        senderRole = user.role; // Người gửi là user hiện tại
                    } else if (msg.senderId === 1) {
                        senderRole = 'admin'; // Người gửi là admin
                    } else {
                        senderRole = 'user'; // Người gửi là user khác
                    }

                    // Xác định email dựa trên senderId
                    let senderEmail;
                    if (msg.senderId === 1) {
                        senderEmail = 'admin@gmail.com'; // Admin email
                    } else if (msg.senderId === user.id) {
                        senderEmail = user.email; // User hiện tại
                    } else {
                        senderEmail = 'user@gmail.com'; // User khác
                    }

                    return {
                        from: msg.senderId,
                        to: msg.receiverId,
                        role: senderRole,
                        email: senderEmail,
                        message: msg.content,
                        timestamp: msg.createdAt,
                        target_user_id: msg.receiverId
                    };
                });
                console.log('userMessages: ', userMessages);

                // Cập nhật messages state với tin nhắn của user này
                setMessages(prevMessages => {
                    // Loại bỏ tin nhắn cũ của user này
                    const filteredMessages = prevMessages.filter(msg =>
                        !(msg.from === targetUserId || msg.target_user_id === targetUserId)
                    );

                    // Kiểm tra và loại bỏ duplicate messages
                    const existingMessageIds = new Set();
                    const uniqueMessages = [];

                    const allMessages = [...filteredMessages, ...userMessages];
                    allMessages.forEach(msg => {
                        const messageKey = `${msg.from}-${msg.to}-${msg.message}-${msg.timestamp}`;

                        if (!existingMessageIds.has(messageKey)) {
                            existingMessageIds.add(messageKey);
                            uniqueMessages.push(msg);
                        }
                    });

                    console.log('✅ Đã loại bỏ duplicate trong loadMessagesForUser, tổng tin nhắn:', uniqueMessages.length);
                    return uniqueMessages;
                });

                console.log('✅ Đã load tin nhắn cho user:', targetUserId, userMessages.length, 'tin nhắn');
            }
        } catch (error) {
            console.error('❌ Lỗi load tin nhắn cho user:', error);
        }
    };

    // Helper to get the latest message for a user
    const getLatestMessage = (userId) => {
        const userMessages = messages.filter(msg =>
            (msg.from === userId && msg.role !== 'admin') ||
            (msg.target_user_id === userId && msg.role === 'admin')
        );

        if (userMessages.length === 0) return 'Chưa có tin nhắn';

        const latestMessage = userMessages[userMessages.length - 1];
        const messageText = latestMessage.message.length > 30
            ? latestMessage.message.substring(0, 30) + '...'
            : latestMessage.message;

        if (latestMessage.role === 'admin') {
            return `Bạn: ${messageText}`;
        } else {
            return `User: ${messageText}`;
        }
    };

    // Admin UI
    if (isAdmin) {
        return (
            <div className="bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <UserOutlined className="text-white text-sm sm:text-lg" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    Admin Dashboard
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Quản lý hỗ trợ khách hàng
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Admin Info */}
                            {user && (
                                <div className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-red-100 rounded-lg">
                                    <span className="text-xs sm:text-sm text-red-700 font-medium">
                                        {user.name || user.email || 'Admin'}
                                    </span>
                                    <span className="px-1 sm:px-2 py-1 text-xs rounded-full bg-red-200 text-red-700">
                                        Admin
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Sidebar */}
                    <div className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col order-2 lg:order-1">
                        {/* Users List */}
                        <div className="flex-1 overflow-y-auto max-h-64 lg:max-h-none">
                            {isLoadingUsers ? (
                                <div className="text-center py-6 text-gray-500">
                                    <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
                                    <p className="text-sm">Đang tải danh sách người dùng...</p>
                                </div>
                            ) : connectedUsers.length > 0 ? (
                                connectedUsers
                                    .filter(user => user.role !== 'admin')
                                    .map((user, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedUser && selectedUser.userId === user.userId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                                                }`}
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setSelectedUserSocketId(user.socket_id);

                                                // Load tin nhắn cụ thể cho user này từ database
                                                if (user.role === 'admin') {
                                                    loadMessagesForUser(user.userId);
                                                }
                                            }}
                                        >
                                            <div className="relative">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <UserOutlined className="text-gray-600 text-sm sm:text-base" />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-800 truncate text-sm sm:text-base">
                                                    {user.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                                    {getLatestMessage(user.userId)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-center py-6 sm:py-8 text-gray-500">
                                    <TeamOutlined className="text-3xl sm:text-4xl mb-2" />
                                    <p className="text-sm sm:text-base">Chưa có người dùng nhắn tin</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col order-1 lg:order-2">
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <UserOutlined className="text-gray-600 text-sm sm:text-base" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-800 text-base sm:text-lg">
                                            {selectedUser ? selectedUser.name : 'Chọn người dùng để hỗ trợ'}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {selectedUser ? selectedUser.email : 'Chọn một người dùng từ danh sách bên trái'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                                        <PhoneOutlined className="text-gray-600 text-sm sm:text-base" />
                                    </button>
                                    <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                                        <VideoCameraOutlined className="text-gray-600 text-sm sm:text-base" />
                                    </button>
                                    <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                                        <InfoCircleOutlined className="text-gray-600 text-sm sm:text-base" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="overflow-y-auto p-3 sm:p-6 bg-gray-50 h-[500px]">
                            {isLoadingMessages ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-3"></div>
                                    <p className="text-sm">Đang tải tin nhắn...</p>
                                </div>
                            ) : selectedUser ? (
                                <div className="space-y-3 sm:space-y-4">
                                    {selectedUserMessages.length > 0 ? (
                                        selectedUserMessages.map((msg, index) => (
                                            <div key={index} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`rounded-lg px-3 sm:px-4 py-2 max-w-[280px] sm:max-w-xs lg:max-w-md xl:max-w-lg break-words ${msg.role === 'admin'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.message}</p>
                                                    <p className={`text-xs mt-1 ${msg.role === 'admin'
                                                        ? 'text-blue-200'
                                                        : 'text-gray-500'
                                                        }`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 sm:py-8 text-gray-500">
                                            <MessageOutlined className="text-4xl sm:text-6xl mb-2" />
                                            <p className="text-sm sm:text-base">Chưa có tin nhắn từ {selectedUser.name}</p>
                                        </div>
                                    )}

                                    {/* Typing Indicator for Admin */}
                                    {typingUsers.has(selectedUser?.userId) && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 text-gray-800 rounded-lg px-3 sm:px-4 py-2">
                                                <div className="flex items-center space-x-1">
                                                    <div className="flex space-x-1">
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                                <div className="text-center py-8 sm:py-12">
                                    <MessageOutlined className="text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4" />
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                                        Chọn cuộc trò chuyện để bắt đầu
                                    </h3>
                                    <p className="text-gray-500 text-sm sm:text-base">
                                        Chọn một người dùng từ danh sách bên trái để hỗ trợ
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
                            <form onSubmit={handleAdminSendMessage} className="flex items-center space-x-2 sm:space-x-4">
                                <input
                                    type="text"
                                    placeholder={selectedUser ? (isConnected ? "Nhập tin nhắn..." : "Đang kết nối...") : "Vui lòng chọn người dùng để nhắn tin"}
                                    value={message}
                                    onChange={handleTyping}
                                    className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                    disabled={!isConnected || !selectedUser}
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() || !isConnected || !selectedUser}
                                    className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SendOutlined className="text-sm sm:text-base" />
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
        <div className="bg-white h-full flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <UserOutlined className="text-white text-sm sm:text-lg" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                                💬 Chat Support
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Xin chào! Chúng tôi sẽ hỗ trợ bạn ngay
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Connection Status */}
                        <div
                            className={`flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm ${isConnected
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                                }`}
                        >
                            {isConnected ? (
                                <CheckCircleOutlined className="text-green-600 text-sm sm:text-base" />
                            ) : (
                                <CloseCircleOutlined className="text-red-600 text-sm sm:text-base" />
                            )}
                            <span className="font-medium">
                                {isConnected ? "Đã kết nối" : "Đang kết nối..."}
                            </span>
                        </div>

                        {/* User Info */}
                        {user && (
                            <div className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 rounded-lg">
                                <span className="text-xs sm:text-sm text-gray-600">
                                    {user.name || user.email || "User"}
                                </span>
                                <span className="px-1 sm:px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                    User
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                className="overflow-y-auto p-3 sm:p-6 bg-gray-50 h-[500px]" // 👈 Chiều cao cố định + scroll
            >
                {messages.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === "admin" ? "justify-start" : "justify-end"
                                    }`}
                            >
                                <div
                                    className={`rounded-lg px-3 sm:px-4 py-2 max-w-[280px] sm:max-w-xs lg:max-w-md xl:max-w-lg break-words ${msg.role === "admin"
                                        ? "bg-white text-gray-800 shadow-sm border border-gray-200"
                                        : "bg-blue-600 text-white"
                                        }`}
                                >
                                    <p className="text-xs sm:text-sm whitespace-pre-wrap">
                                        {msg.message}
                                    </p>
                                    <p
                                        className={`text-xs mt-1 ${msg.role === "admin"
                                            ? "text-gray-500"
                                            : "text-blue-200"
                                            }`}
                                    >
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {(() => {
                            const adminTyping = Array.from(typingUsers).some((userId) => {
                                const currentUser = getDecodedProfileUser();
                                return userId !== currentUser?.id;
                            });

                            return adminTyping ? (
                                <div className="flex justify-start">
                                    <div className="bg-white text-gray-800 rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-200">
                                        <div className="flex items-center space-x-1">
                                            <div className="flex space-x-1">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div
                                                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0.1s" }}
                                                ></div>
                                                <div
                                                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0.2s" }}
                                                ></div>
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
                    <div className="text-center py-8 sm:py-12">
                        <MessageOutlined className="text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                            Chào mừng đến với Support Chat
                        </h3>
                        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                            Chúng tôi sẽ kết nối bạn với nhân viên hỗ trợ ngay
                        </p>
                        <div
                            className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${isConnected
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {isConnected ? (
                                <CheckCircleOutlined className="text-green-600 text-sm sm:text-base" />
                            ) : (
                                <CloseCircleOutlined className="text-yellow-600 text-sm sm:text-base" />
                            )}
                            <span className="font-medium">
                                {isConnected
                                    ? "Đã sẵn sàng nhận hỗ trợ"
                                    : "Đang kết nối với server..."}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
                <form
                    onSubmit={handleSendMessage}
                    className="flex space-x-2 sm:space-x-4"
                >
                    <input
                        type="text"
                        placeholder={
                            isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."
                        }
                        value={message}
                        onChange={handleTyping}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        disabled={!isConnected}
                    />
                    <button
                        type="submit"
                        disabled={!message.trim() || !isConnected}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2"
                    >
                        <SendOutlined className="text-sm sm:text-base" />
                        <span className="text-sm sm:text-base">Gửi</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Support;