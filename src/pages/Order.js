import React, { useState, useEffect } from 'react';
import { Button, Table, Tag, Modal, Descriptions, Spin, Empty, Card, Badge, Avatar, Progress, Input } from 'antd';
import TableDashboard from '../components/dashboard/TableDashboard';
import { useParams, useNavigate } from 'react-router-dom';
import useDeviceDetection from '../hooks/useDeviceDetection';
import {
    ShoppingCartOutlined,
    DollarOutlined,
    CalendarOutlined,
    UserOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CarOutlined,
    FileTextOutlined,
    StarOutlined,
    SearchOutlined
} from '@ant-design/icons';
import axiosClient from '../config/axios';
import { getUserProfile } from '../utils/auth';
import { formatPrice } from '../utils/formatUtils';

const statusConfig = {
    paid: {
        color: "success",
        text: "Đã thanh toán",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        icon: <CheckCircleOutlined className="text-emerald-600" />
    },
    pending: {
        color: "warning",
        text: "Chờ thanh toán",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        icon: <ClockCircleOutlined className="text-amber-600" />
    },
    cancelled: {
        color: "error",
        text: "Đã hủy",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        icon: <CloseCircleOutlined className="text-red-600" />
    },
    shipped: {
        color: "processing",
        text: "Đã giao hàng",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        icon: <CarOutlined className="text-blue-600" />
    }
};



const Order = () => {
    const [userOrders, setUserOrders] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { isMobile, isTablet, isDesktop } = useDeviceDetection();
    const [searchTerm, setSearchTerm] = useState('');
    const [mobilePagination, setMobilePagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [pageInputValue, setPageInputValue] = useState('1');

    // Utility function để delay 250ms
    const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            align: 'center',
            render: (_, __, index) => (
                <div className="flex items-center justify-center">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        #{(pagination.current - 1) * pagination.pageSize + index + 1}
                    </span>
                </div>
            )
        },

        {
            title: 'Thông tin khách hàng',
            dataIndex: 'shipName',
            key: 'shipName',
            render: (name, record) => (
                <div className="flex items-center space-x-3">
                    <Avatar
                        size={40}
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<UserOutlined />}
                    />
                    <div>
                        <div className="font-semibold text-gray-900">{name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <PhoneOutlined className="mr-1" />
                            {record.shipPhone}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Địa chỉ giao hàng',
            dataIndex: 'shipAddress',
            key: 'shipAddress',
            render: (address) => (
                <div className="flex items-start max-w-xs">
                    <EnvironmentOutlined className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600 leading-relaxed">{address}</span>
                </div>
            )
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date) => (
                <div className="flex items-center">
                    <CalendarOutlined className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium">{new Date(date).toLocaleDateString('vi-VN')}</span>
                </div>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            align: 'center',
            render: (total, record) => (
                <div className="flex items-center justify-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600  px-3 py-1 rounded-lg">
                        <span className="font-bold">{formatPrice(total)}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                const config = statusConfig[status] || statusConfig.pending;
                return (
                    <Badge
                        status={config.color}
                        text={
                            <div className={`inline-flex items-center px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border`}>
                                {config.icon}
                                <span className={`text-xs font-medium ${config.textColor} ml-1`}>
                                    {config.text}
                                </span>
                            </div>
                        }
                    />
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleShowDetail(record)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                    Chi tiết
                </Button>
            )
        }
    ];

    // Xử lý show detail cho Table
    const handleShowDetail = (record) => {
        setSelectedOrder(record);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedOrder(null);
    };

    const userId = getUserProfile()?.id;

    const fetchOrders = async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            console.log('Fetching orders for userId:', userId);

            // Delay 250ms trước khi fetch dữ liệu
            await delay();

            const res = await axiosClient.get(`/orders-of-user/${userId}?page=${page}&pageSize=${pageSize}`);
            const orders = res.data.data || [];
            setUserOrders(orders);
            setTotalSpent(orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0));

            // Không tính totalQuantity ở đây vì chỉ là 1 trang
            // totalQuantity sẽ được tính từ fetchTotalQuantity()

            // Sử dụng pagination data từ API response
            const paginationData = res.data.pagination || {};
            setPagination(prev => ({
                ...prev,
                total: res.data.pagination?.total || 0,
                current: res.data.pagination?.page || prev.current,
                pageSize: res.data.pagination?.limit || prev.pageSize
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            setUserOrders([]);
            setTotalSpent(0);
            setTotalQuantity(0);
            setPagination({ current: 1, pageSize: 10, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Function để fetch tổng số lượng sản phẩm đã mua từ TẤT CẢ đơn hàng
    const fetchTotalQuantity = async () => {
        try {
            console.log('🔍 Fetching total quantity from ALL orders...');

            // Delay 250ms trước khi fetch dữ liệu
            await delay();

            // Fetch tất cả đơn hàng với pageSize lớn để đảm bảo lấy hết
            const allOrdersRes = await axiosClient.get(`/orders-of-user/${userId}?page=1&pageSize=10000`);
            const allOrders = allOrdersRes.data.data || [];

            console.log('📦 Total orders found:', allOrders.length);

            // Tính tổng số lượng từ TẤT CẢ orderItems của TẤT CẢ đơn hàng
            const totalItems = allOrders.reduce((sum, order) => {
                const orderQuantity = order.orderItems?.reduce((itemSum, item) => {
                    console.log(`  - Item: ${item.productId}, Quantity: ${item.quantity}`);
                    return itemSum + (item.quantity || 0);
                }, 0) || 0;
                console.log(`📋 Order ${order.id}: ${orderQuantity} items`);
                return sum + orderQuantity;
            }, 0);

            setTotalQuantity(totalItems);
            console.log('🎯 TOTAL QUANTITY FROM ALL ORDERS:', totalItems);
        } catch (error) {
            console.error('❌ Error fetching total quantity:', error);
            setTotalQuantity(0);
        }
    };

    useEffect(() => {
        fetchOrders(pagination.current, pagination.pageSize);
        fetchTotalQuantity(); // Fetch tổng số lượng từ tất cả đơn hàng
        // Cập nhật mobile pagination
        setMobilePagination(prev => ({
            ...prev,
            total: pagination.total
        }));
        // eslint-disable-next-line
    }, [userId, pagination.total]);

    // Cập nhật pageInputValue khi mobilePagination.current thay đổi
    useEffect(() => {
        setPageInputValue(mobilePagination.current.toString());
    }, [mobilePagination.current]);

    // Xử lý chuyển trang
    const handleTableChange = async (paginationData) => {
        console.log('🔄 Changing to page:', paginationData.current, 'with pageSize:', paginationData.pageSize);

        // Cập nhật pagination state trước khi fetch
        setPagination(prev => ({
            ...prev,
            current: paginationData.current,
            pageSize: paginationData.pageSize
        }));

        // Chỉ fetch orders cho trang mới, KHÔNG fetch lại totalQuantity
        await fetchOrders(paginationData.current, paginationData.pageSize);
        console.log('📊 Total quantity remains:', totalQuantity, '(không thay đổi khi chuyển trang)');
    };

    const columnsWithAction = columns.map(col =>
        col.key === 'action'
            ? {
                ...col, render: (_, record) => (
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleShowDetail(record)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        Chi tiết
                    </Button>
                )
            }
            : col
    );



    // Mobile/Tablet Layout
    if (isMobile || isTablet) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                {/* Mobile Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-gray-600 text-sm">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <Input
                        placeholder="Tìm kiếm đơn hàng..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            // Reset pagination khi search
                            setMobilePagination(prev => ({ ...prev, current: 1 }));
                        }}
                        className="rounded-lg shadow-sm"
                        size="large"
                    />
                </div>

                {/* Mobile Stats Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Card className="bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border-0 p-2" bodyStyle={{ padding: '8px' }}>
                        <div className="text-center">
                            <div className="p-1.5 bg-orange-100 rounded-lg mx-auto mb-1.5 w-10 h-10 flex items-center justify-center">
                                <ShoppingCartOutlined className="text-lg text-orange-600" />
                            </div>
                            <p className="text-xs text-gray-600 mb-1">Tổng sản phẩm</p>
                            <p className="text-base font-bold text-orange-600">{totalQuantity}</p>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm border-0 p-2" bodyStyle={{ padding: '8px' }}>
                        <div className="text-center">
                            <div className="p-1.5 bg-green-100 rounded-lg mx-auto mb-1.5 w-10 h-10 flex items-center justify-center">
                                <DollarOutlined className="text-lg text-green-600" />
                            </div>
                            <p className="text-xs text-gray-600 mb-1">Tổng chi tiêu</p>
                            <p className="text-base font-bold text-green-600">{totalSpent.toLocaleString()}₫</p>
                        </div>
                    </Card>
                </div>

                {/* Mobile Order Cards */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-4 text-gray-600 text-sm">Đang tải đơn hàng...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userOrders
                            .filter(order => 
                                order.shipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.id?.toString().includes(searchTerm) ||
                                order.shipPhone?.includes(searchTerm)
                            )
                            .slice(
                                (mobilePagination.current - 1) * mobilePagination.pageSize,
                                mobilePagination.current * mobilePagination.pageSize
                            )
                            .map((order, index) => {
                            const config = statusConfig[order.status] || statusConfig.pending;
                            return (
                                                                <Card 
                                    key={order.id} 
                                    className="shadow-md border-0 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                    onClick={() => handleShowDetail(order)}
                                    bodyStyle={{ padding: '12px' }}
                                >
                                    <div className="space-y-2">
                                        {/* Header Row */}
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                #{order.id}, {new Date(order.orderDate).toLocaleDateString('vi-VN', { 
                                                    month: 'short', 
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }).toUpperCase()}
                                            </div>
                                            <div className={`inline-flex items-center px-1.5 py-0.5 rounded-full ${config.bgColor} ${config.borderColor} border`}>
                                                {config.icon}
                                                <span className={`text-xs font-medium ${config.textColor} ml-1`}>
                                                    {config.text}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-xl font-bold text-gray-900">
                                            {formatPrice(order.totalPrice)}
                                        </div>

                                        {/* Customer Name */}
                                        <div className="text-sm font-medium text-gray-700">
                                            {order.shipName}
                                        </div>

                                        {/* View Detail Button */}
                                        <div className="flex justify-end">
                                            <Button
                                                type="primary"
                                                size="small"
                                                className="bg-blue-500 hover:bg-blue-600 border-0 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 text-xs"
                                            >
                                                XEM CHI TIẾT
                                                <ArrowRightOutlined className="ml-1 text-xs" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                             );
                         })}
                    </div>
                )}

                                {/* Mobile Pagination */}
                {!loading && userOrders.length > 0 && (() => {
                    const filteredOrders = userOrders.filter(order => 
                        order.shipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.id?.toString().includes(searchTerm) ||
                        order.shipPhone?.includes(searchTerm)
                    );
                    const totalPages = Math.ceil(filteredOrders.length / mobilePagination.pageSize);
                    const startIndex = (mobilePagination.current - 1) * mobilePagination.pageSize;
                    const endIndex = Math.min(mobilePagination.current * mobilePagination.pageSize, filteredOrders.length);
                    
                    return (
                        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {filteredOrders.length > 0 ? `${startIndex + 1}-${endIndex}` : '0-0'} của {filteredOrders.length} đơn hàng
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        size="small"
                                        disabled={mobilePagination.current === 1}
                                        onClick={() => setMobilePagination(prev => ({ ...prev, current: prev.current - 1 }))}
                                        className="flex items-center justify-center w-8 h-8 border border-gray-300 bg-white hover:bg-gray-50"
                                    >
                                        <span className="text-gray-600 font-medium">&lt;</span>
                                    </Button>
                                    <div className="flex items-center space-x-1">
                                        <Input
                                            size="small"
                                            value={pageInputValue}
                                            onChange={(e) => {
                                                setPageInputValue(e.target.value);
                                            }}
                                            onPressEnter={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (value && value > 0 && value <= totalPages) {
                                                    setMobilePagination(prev => ({ ...prev, current: value }));
                                                } else {
                                                    setPageInputValue(mobilePagination.current.toString());
                                                }
                                            }}
                                            onBlur={() => {
                                                setPageInputValue(mobilePagination.current.toString());
                                            }}
                                            className="w-12 h-8 text-center border border-gray-300 rounded"
                                            style={{ padding: '4px 8px' }}
                                        />
                                        <span className="text-gray-600">/</span>
                                        <span className="text-gray-700 font-medium">{totalPages}</span>
                                    </div>
                                    <Button
                                        size="small"
                                        disabled={mobilePagination.current >= totalPages}
                                        onClick={() => setMobilePagination(prev => ({ ...prev, current: prev.current + 1 }))}
                                        className="flex items-center justify-center w-8 h-8 border border-gray-300 bg-white hover:bg-gray-50"
                                    >
                                        <span className="text-gray-600 font-medium">&gt;</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Empty State */}
                {!loading && userOrders.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCartOutlined className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                        <p className="text-gray-600 text-sm">Bạn chưa có đơn hàng nào trong hệ thống.</p>
                    </div>
                )}

                {/* Modal chi tiết đơn hàng */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                                <ShoppingCartOutlined className="text-white text-sm" />
                            </div>
                            <div>
                                <div className="text-base font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrder?.id}</div>
                                <div className="text-xs text-gray-600">Thông tin chi tiết về đơn hàng</div>
                            </div>
                        </div>
                    }
                    open={modalVisible}
                    onCancel={handleCloseModal}
                    footer={[
                        <Button key="close" onClick={handleCloseModal} className="bg-gray-500 hover:bg-gray-600 border-gray-500 text-white">
                            Đóng
                        </Button>
                    ]}
                    width="95%"
                    className="custom-modal"
                >
                    {selectedOrder && (
                        <div className="space-y-4">
                            {/* Status Badge */}
                            <div className="text-center mb-4">
                                {(() => {
                                    const config = statusConfig[selectedOrder.status] || statusConfig.pending;
                                    return (
                                        <div className={`inline-flex items-center px-4 py-2 rounded-full ${config.bgColor} ${config.borderColor} border shadow-md`}>
                                            {config.icon}
                                            <span className={`font-semibold ${config.textColor} ml-2 text-base`}>
                                                {config.text}
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Order Details */}
                            <div className="space-y-4">
                                {/* Shipping Information */}
                                <Card className="shadow-sm border-0 bg-gray-50">
                                    <div className="space-y-3">
                                        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                            <UserOutlined className="text-gray-400 mr-3 w-4" />
                                            <div>
                                                <p className="text-xs text-gray-500">Người nhận</p>
                                                <p className="font-semibold text-gray-900 text-sm">{selectedOrder.shipName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                            <PhoneOutlined className="text-gray-400 mr-3 w-4" />
                                            <div>
                                                <p className="text-xs text-gray-500">Số điện thoại</p>
                                                <p className="font-semibold text-gray-900 text-sm">{selectedOrder.shipPhone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start p-2 bg-gray-50 rounded-lg">
                                            <EnvironmentOutlined className="text-gray-400 mr-3 w-4 mt-1" />
                                            <div>
                                                <p className="text-xs text-gray-500">Địa chỉ</p>
                                                <p className="font-semibold text-gray-900 text-sm">{selectedOrder.shipAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Order Information */}
                                <Card className="shadow-sm border-0 bg-gray-50">
                                    <div className="space-y-3">
                                        <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                            <CalendarOutlined className="text-gray-400 mr-3 w-4" />
                                            <div>
                                                <p className="text-xs text-gray-500">Ngày đặt</p>
                                                <p className="font-semibold text-gray-900 text-sm">{new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.shippedDate && (
                                            <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                                <CarOutlined className="text-gray-400 mr-3 w-4" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Ngày giao</p>
                                                    <p className="font-semibold text-gray-900 text-sm">{new Date(selectedOrder.shippedDate).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                            <DollarOutlined className="text-green-600 mr-3 w-4" />
                                            <div>
                                                <p className="text-xs text-green-600 font-medium">Tổng tiền</p>
                                                <p className="font-bold text-lg text-green-700">{selectedOrder.totalPrice?.toLocaleString()}₫</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Note Section */}
                            {selectedOrder.note && (
                                <Card className="shadow-sm border-0 bg-gray-50">
                                    <div className="flex items-center mb-2">
                                        <StarOutlined className="text-gray-600 mr-2 w-4" />
                                        <span className="font-semibold text-gray-800 text-sm">Ghi chú</span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{selectedOrder.note}</p>
                                </Card>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        );
    }

    // Desktop Layout (unchanged)
    return (
        <div className="rounded-2xl overflow-hidden bg-white">
            <div className="container mx-auto px-4 ">
                {/* Header */}
                <div className=" mb-6 pt-5 ">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {/* Tổng số lượng sản phẩm đã mua */}
                    <Card className="bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0  cursor-pointer">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-xl mr-4">
                                <ShoppingCartOutlined className="text-2xl text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                                <p className="text-2xl font-bold text-orange-600">{totalQuantity}</p>
                                <p className="text-xs text-gray-500">Đã mua (tất cả đơn hàng)</p>
                            </div>
                        </div>
                    </Card>

                    {/* Pagination Info Card */}
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0  cursor-pointer">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                <FileTextOutlined className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Trang hiện tại</p>
                                <p className="text-2xl font-bold text-blue-600">{pagination.current}</p>
                                <p className="text-xs text-gray-500">
                                    Tổng {Math.ceil(pagination.total / pagination.pageSize)} trang
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0  cursor-pointer">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                <ShoppingCartOutlined className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs font-medium">Tổng đơn hàng</p>
                                <p className="text-2xl font-bold text-blue-600">{pagination.total}</p>
                                <p className="text-gray-500 text-xs">{userOrders.filter(o => o.status === 'paid').length} đã thanh toán</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0  cursor-pointer">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-xl mr-4">
                                <DollarOutlined className="text-2xl text-green-600" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs font-medium">Tổng chi tiêu</p>
                                <p className="text-2xl font-bold text-green-600">{totalSpent.toLocaleString()}₫</p>
                                <p className="text-gray-500 text-xs">Đã thanh toán</p>
                            </div>
                        </div>
                    </Card>

                </div>

                {/* Orders Table */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Quản lý đơn hàng</h2>
                            <p className="text-gray-600 mt-1 text-sm">Quản lý các đơn hàng trong hệ thống</p>
                        </div>
                    </div>


                    <div className="overflow-x-auto">
                        <TableDashboard
                            type="order"
                            data={userOrders}
                            loading={loading}
                            columns={columnsWithAction}
                            pagination={pagination}

                            onChange={handleTableChange}
                        />
                    </div>
                </div>

                {/* Modal chi tiết đơn hàng */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                                <ShoppingCartOutlined className="text-white" />
                            </div>
                            <div>
                                <div className="text-base font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrder?.id}</div>
                                <div className="text-xs text-gray-600">Thông tin chi tiết về đơn hàng</div>
                            </div>
                        </div>
                    }
                    open={modalVisible}
                    onCancel={handleCloseModal}
                    footer={[
                        <Button key="close" onClick={handleCloseModal} className="bg-gray-500 hover:bg-gray-600 border-gray-500 text-white">
                            Đóng
                        </Button>
                    ]}
                    width={800}
                    className="custom-modal"
                    bodyStyle={{ padding: '24px' }}
                >
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div className="text-center mb-6">
                                {(() => {
                                    const config = statusConfig[selectedOrder.status] || statusConfig.pending;
                                    return (
                                        <div className={`inline-flex items-center px-6 py-3 rounded-full ${config.bgColor} ${config.borderColor} border shadow-lg`}>
                                            {config.icon}
                                            <span className={`font-semibold ${config.textColor} ml-2 text-lg`}>
                                                {config.text}
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Shipping Information */}
                                <Card
                                    title={
                                        <div className="flex items-center">
                                            <UserOutlined className="text-gray-600 mr-2" />
                                            <span className="font-semibold text-gray-800 text-sm">Thông tin giao hàng</span>
                                        </div>
                                    }
                                    className="shadow-lg border-0 bg-gray-50 cursor-pointer"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <UserOutlined className="text-gray-400 mr-3 w-5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Người nhận</p>
                                                <p className="font-semibold text-gray-900">{selectedOrder.shipName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <PhoneOutlined className="text-gray-400 mr-3 w-5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                                <p className="font-semibold text-gray-900">{selectedOrder.shipPhone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                                            <EnvironmentOutlined className="text-gray-400 mr-3 w-5 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                                <p className="font-semibold text-gray-900">{selectedOrder.shipAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Order Information */}
                                <Card
                                    title={
                                        <div className="flex items-center">
                                            <FileTextOutlined className="text-gray-600 mr-2" />
                                            <span className="font-semibold text-gray-800 text-sm">Thông tin đơn hàng</span>
                                        </div>
                                    }
                                    className="shadow-lg border-0 bg-gray-50 cursor-pointer"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <CalendarOutlined className="text-gray-400 mr-3 w-5" />
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày đặt</p>
                                                <p className="font-semibold text-gray-900">{new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.shippedDate && (
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <CarOutlined className="text-gray-400 mr-3 w-5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Ngày giao</p>
                                                    <p className="font-semibold text-gray-900">{new Date(selectedOrder.shippedDate).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                            <DollarOutlined className="text-green-600 mr-3 w-5" />
                                            <div>
                                                <p className="text-sm text-green-600 font-medium">Tổng tiền</p>
                                                <p className="font-bold text-2xl text-green-700">{selectedOrder.totalPrice?.toLocaleString()}₫</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Note Section */}
                            {selectedOrder.note && (
                                <Card
                                    title={
                                        <div className="flex items-center">
                                            <StarOutlined className="text-gray-600 mr-2" />
                                            <span className="font-semibold text-gray-800 text-sm">Ghi chú</span>
                                        </div>
                                    }
                                    className="shadow-lg border-0 bg-gray-50"
                                >
                                    <p className="text-gray-700 leading-relaxed">{selectedOrder.note}</p>
                                </Card>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default Order;