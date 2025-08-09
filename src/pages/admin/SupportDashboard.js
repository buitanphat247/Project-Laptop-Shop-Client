import React, { useState, useEffect, useRef } from 'react';
import { SendOutlined, UserOutlined, SmileOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';
import io from 'socket.io-client';

const SupportDashboard = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Kết nối Socket.IO
    useEffect(() => {
        const newSocket = io('http://localhost:8080');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            setUsername(`Admin_${newSocket.id.slice(0, 6)}`);
            console.log('Connected to server');
            
            // Join as admin
            newSocket.emit('admin-join');
            
            // Lấy danh sách users
            newSocket.emit('get-users');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from server');
        });

        newSocket.on('admin-joined', (data) => {
            console.log('Admin joined:', data);
        });

        newSocket.on('chat-history', (history) => {
            setMessages(history);
        });

        newSocket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        newSocket.on('users-list', (usersList) => {
            setConnectedUsers(usersList);
        });

        newSocket.on('user-connected', (data) => {
            setConnectedUsers(prev => [...prev, { id: data.userId, name: data.username }]);
        });

        newSocket.on('user-disconnected', (data) => {
            setConnectedUsers(prev => prev.filter(user => user.id !== data.userId));
        });

        newSocket.on('user-typing', (data) => {
            if (data.isTyping) {
                setTypingUsers(prev => {
                    if (!prev.includes(data.senderName)) {
                        return [...prev, data.senderName];
                    }
                    return prev;
                });
            } else {
                setTypingUsers(prev => prev.filter(user => user !== data.senderName));
            }
        });

        return () => {
            newSocket.close();
        };
    }, []);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Xử lý gửi tin nhắn
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.emit('send-message', {
                message: message.trim()
            });
            setMessage('');
            
            // Thông báo ngừng typing
            socket.emit('typing', { isTyping: false });
            setIsTyping(false);
        }
    };

    // Xử lý typing indicator
    const handleTyping = (e) => {
        setMessage(e.target.value);
        
        if (!isTyping && socket) {
            setIsTyping(true);
            socket.emit('typing', { isTyping: true });
        }

        // Clear timeout cũ
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout mới
        typingTimeoutRef.current = setTimeout(() => {
            if (socket) {
                socket.emit('typing', { isTyping: false });
                setIsTyping(false);
            }
        }, 1000);
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="h-screen flex">
                {/* Sidebar - Users List */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <TeamOutlined className="text-white text-lg" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800">
                                    👨‍💼 Admin Dashboard
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Quản lý chat support
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                            <span className="text-sm font-medium">
                                {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
                            </span>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Người dùng đang kết nối ({connectedUsers.length})
                        </h2>
                        <div className="space-y-2">
                            {connectedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <UserOutlined className="text-blue-600 text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.isAdmin ? 'Admin' : 'User'}
                                        </p>
                                    </div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            ))}
                            {connectedUsers.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageOutlined className="text-4xl mb-2" />
                                    <p>Chưa có người dùng nào</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <MessageOutlined className="text-white text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        💬 Chat Support
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Xin chào, {username}!
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {messages.length} tin nhắn
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={msg.id || index}
                                className={`flex ${msg.senderId === socket?.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${msg.senderId === socket?.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    <img
                                        src={msg.avatar}
                                        alt={msg.senderName}
                                        className="w-8 h-8 rounded-full flex-shrink-0"
                                    />
                                    <div className={`rounded-2xl px-4 py-2 ${msg.senderId === socket?.id 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white text-gray-800 shadow-sm'
                                    }`}>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-medium text-sm">
                                                {msg.senderName}
                                            </span>
                                            <span className="text-xs opacity-70">
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-sm break-words">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {typingUsers.length > 0 && (
                            <div className="flex justify-start">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <SmileOutlined className="text-gray-500" />
                                    </div>
                                    <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                                        <p className="text-sm text-gray-600">
                                            {typingUsers.join(', ')} đang nhập tin nhắn...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="bg-white border-t border-gray-200 p-4">
                        <form onSubmit={handleSendMessage} className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="Nhập tin nhắn..."
                                value={message}
                                onChange={handleTyping}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        </div>
    );
};

export default SupportDashboard; 