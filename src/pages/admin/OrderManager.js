import React, { useState, useEffect } from 'react';
import { Plus, EyeOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined, DollarOutlined, CalendarOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import TableDashboard from '../../components/dashboard/TableDashboard';
import { DashboardCards } from '../../components/dashboard/DashboardCard';
import { Button, Tag, Modal, Descriptions, Space, message, Spin, Empty, Form, Select } from 'antd';
import axiosClient from '../../config/axios';
import StatsCards from '../../components/permission/StatsCards';
import { statsData } from '../../config/constant';

const { Option } = Select;

const statusConfig = {
    paid: {
        color: 'green',
        text: 'Đã thanh toán',
        bg: '#f6ffed',
        border: '#b7eb8f',
        textColor: '#52c41a',
        icon: <CheckCircleOutlined />
    },
    pending: {
        color: 'gold',
        text: 'Chờ xử lý',
        bg: '#fffbe6',
        border: '#ffe58f',
        textColor: '#faad14',
        icon: <ClockCircleOutlined />
    },
    cancelled: {
        color: 'red',
        text: 'Đã hủy',
        bg: '#fff2f0',
        border: '#ffccc7',
        textColor: '#ff4d4f',
        icon: <CloseCircleOutlined />
    },
    shipped: {
        color: 'blue',
        text: 'Đã giao hàng',
        bg: '#e6f7ff',
        border: '#91d5ff',
        textColor: '#1890ff',
        icon: <CheckCircleOutlined />
    }
};

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editForm] = Form.useForm();
    const [updateLoading, setUpdateLoading] = useState(false);


    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} đơn hàng`,
    });
   

    const showModalInfo = (order) => {
        console.log('order: ', order);
        modal.info({
            title: (
                <div className="flex items-center">
                    <ShoppingCartOutlined className="mr-2 text-blue-500" />
                    <span className="text-lg font-semibold">Chi tiết đơn hàng #{order.id}</span>
                </div>
            ),
            width: 900,
            icon: null,
            okText: "Đóng",
            maskClosable: true,
            content: (
                <div className="space-y-6 mt-4">
                    {/* Status Badge */}
                    <div className="flex justify-center mb-6">
                        <Tag
                            style={{
                                backgroundColor: statusConfig[order.status].bg,
                                borderColor: statusConfig[order.status].border,
                                color: statusConfig[order.status].textColor,
                                fontWeight: 600,
                                borderRadius: '8px',
                                padding: '12px 20px',
                                fontSize: '16px'
                            }}
                        >
                            {statusConfig[order.status].icon} {statusConfig[order.status].text}
                        </Tag>
                    </div>
                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shipping Information */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <UserOutlined className="mr-2 text-blue-500" />
                                Thông tin giao hàng
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <UserOutlined className="mr-3 text-gray-500 w-4" />
                                    <span className="font-medium text-gray-700">Tên:</span>
                                    <span className="ml-2 text-gray-900">{order.shipName}</span>
                                </div>
                                <div className="flex items-center">
                                    <PhoneOutlined className="mr-3 text-gray-500 w-4" />
                                    <span className="font-medium text-gray-700">SĐT:</span>
                                    <span className="ml-2 text-gray-900">{order.shipPhone}</span>
                                </div>
                                <div className="flex items-start">
                                    <EnvironmentOutlined className="mr-3 text-gray-500 w-4 mt-1" />
                                    <span className="font-medium text-gray-700">Địa chỉ:</span>
                                    <span className="ml-2 text-gray-900 text-sm">{order.shipAddress}</span>
                                </div>
                            </div>
                        </div>
                        {/* Order Information */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <CalendarOutlined className="mr-2 text-green-500" />
                                Thông tin đơn hàng
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <CalendarOutlined className="mr-3 text-gray-500 w-4" />
                                    <span className="font-medium text-gray-700">Ngày đặt:</span>
                                    <span className="ml-2 text-gray-900">{new Date(order.orderDate).toLocaleString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center">
                                    <CalendarOutlined className="mr-3 text-gray-500 w-4" />
                                    <span className="font-medium text-gray-700">Ngày giao:</span>
                                    <span className="ml-2 text-gray-900">
                                        {order.shippedDate
                                            ? new Date(order.shippedDate).toLocaleString('vi-VN')
                                            : 'Chưa giao hàng'
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <DollarOutlined className="mr-3 text-gray-500 w-4" />
                                    <span className="font-medium text-gray-700">Tổng tiền:</span>
                                    <span className="ml-2 font-bold text-green-600 text-lg">{order.totalPrice.toLocaleString()}₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Order Items */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <ShoppingCartOutlined className="mr-2 text-purple-500" />
                            Sản phẩm đã đặt
                        </h3>
                        <div className="space-y-3">
                            {order.orderItems?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-900">{item.product?.name}</span>
                                        <span className="ml-2 text-gray-500">x{item.quantity}</span>
                                    </div>
                                    <span className="font-bold text-green-600">{Number(item.price).toLocaleString()}₫</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Notes */}
                    {order.note && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                                <span className="mr-2">📝</span>
                                Ghi chú
                            </h3>
                            <p className="text-yellow-700 leading-relaxed">{order.note}</p>
                        </div>
                    )}
                </div>
            ),
        });
    };

    const showEditModal = (order) => {
        setEditingOrder(order);
        editForm.setFieldsValue({
            status: order.status
        });
        setEditModalVisible(true);
    };

    const handleUpdateStatus = async (values) => {
        if (!editingOrder) return;
        setUpdateLoading(true);
        try {
            await axiosClient.put(`/update-order/${editingOrder.id}`, {
                status: values.status
            });
            message.success('Cập nhật trạng thái đơn hàng thành công!');
            setEditModalVisible(false);
            setEditingOrder(null);
            editForm.resetFields();
            fetchOrders(pagination.current, pagination.pageSize); // reload list
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật trạng thái!');
        } finally {
            setUpdateLoading(false);
        }
    };

    // Đặt orderColumns ở đây, sau khi khai báo pagination
    const orderColumns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 80,
            align: 'center',
            render: (_, __, index) => {
                const currentPage = pagination.current || 1;
                const pageSize = pagination.pageSize || 10;
                return (
                    <div className="flex items-center justify-center">
                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            #{(currentPage - 1) * pageSize + index + 1}
                        </span>
                    </div>
                );
            }
        },
        {
            title: 'Tên người nhận',
            dataIndex: 'shipName',
            key: 'shipName',
            width: 180,
            ellipsis: true,
            render: (name) => (
                <div className="flex items-center">
                    <UserOutlined className="mr-2 text-blue-500" />
                    <span className="font-medium truncate">{name}</span>
                </div>
            )
        },
        {
            title: 'SĐT',
            dataIndex: 'shipPhone',
            key: 'shipPhone',
            width: 140,
            render: (phone) => (
                <div className="flex items-center">
                    <PhoneOutlined className="mr-2 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">{phone}</span>
                </div>
            )
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'shipAddress',
            key: 'shipAddress',
            width: 220,
            ellipsis: true,
            render: (address) => (
                <div className="flex items-start">
                    <EnvironmentOutlined className="mr-2 text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-sm truncate">{address}</span>
                </div>
            )
        },

        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 130,
            render: (total) => (
                <div className="flex items-center">
                    <DollarOutlined className="mr-1 text-green-600" />
                    <span className="font-bold text-green-600 text-sm">{total.toLocaleString()}₫</span>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status) => {
                const config = statusConfig[status];
                return (
                    <Tag
                        style={{
                            backgroundColor: config.bg,
                            borderColor: config.border,
                            color: config.textColor,
                            fontWeight: 600,
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '12px'
                        }}
                    >
                        {config.icon} {config.text}
                    </Tag>
                );
            }
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 130,
            render: (date) => (
                <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">
                        {date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}
                    </span>
                </div>
            )
        },
        {
            title: 'Chi tiết',
            key: 'detail',
            width: 90,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => showModalInfo(record)}
                    className="text-blue-600 hover:text-blue-800 p-0"
                    size="small"
                >
                    Chi tiết
                </Button>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        className="text-orange-600 hover:text-orange-800 p-0"
                        size="small"
                    >
                        Sửa
                    </Button>
                    {/* <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => alert(`Xóa đơn hàng ${record.id}`)}
                        className="text-red-600 hover:text-red-800 p-0"
                        size="small"
                    >
                        Xóa
                    </Button> */}
                </Space>
            )
        }
    ];



    // Fetch orders data từ API /orders
    const fetchOrders = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/orders', {
                params: {
                    page,
                    limit,
                }
            });

            // Đảm bảo dữ liệu là mảng và có key cho mỗi item
            const data = Array.isArray(res.data.data)
                ? res.data.data.map((item, idx) => ({
                    ...item,
                    key: item.id || idx,
                }))
                : [];

            // Thêm delay 500ms trước khi set state
            setTimeout(() => {
                setOrders(data);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: limit,
                    total: res.data.total || res.data.pagination?.total || 0,
                }));
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Có lỗi xảy ra khi tải dữ liệu đơn hàng!');
            setLoading(false);
        }
    };

    const handleTableChange = (paginationData) => {
        fetchOrders(paginationData.current, paginationData.pageSize);
    };

    useEffect(() => {
        fetchOrders(pagination.current, pagination.pageSize);
    }, []);

    return (
        <div className='space-y-5'>
            {/* Dashboard Cards */}
            {/* Statistics Cards */}
            <StatsCards statsData={statsData} />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                    <p className="text-gray-600">Quản lý các đơn hàng trong hệ thống</p>
                </div>
            </div>


            {/* Table Dashboard */}
            <TableDashboard
                columns={orderColumns}
                data={orders}
                type="order"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
            />
            {contextHolder}

            {/* Edit Status Modal */}
            <Modal
                title="Chỉnh sửa trạng thái đơn hàng"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setEditingOrder(null);
                    editForm.resetFields();
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setEditModalVisible(false);
                        setEditingOrder(null);
                        editForm.resetFields();
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={updateLoading}
                        onClick={() => editForm.submit()}
                    >
                        Cập nhật
                    </Button>
                ]}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleUpdateStatus}
                >
                    <Form.Item
                        label="Trạng thái đơn hàng"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái mới">
                            <Option value="pending">Chờ xử lý</Option>
                            <Option value="paid">Đã thanh toán</Option>
                            <Option value="shipped">Đã giao hàng</Option>
                            <Option value="cancelled">Đã hủy</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrderManager;