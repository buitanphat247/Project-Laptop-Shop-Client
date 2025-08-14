import React, { useEffect, useState, useCallback } from 'react';
import { Button, Tag, Space, Modal, Form, Input, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, EyeOutlined, EnvironmentOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DashboardCards } from '../../components/dashboard/DashboardCard';
import TableDashboard from '../../components/dashboard/TableDashboard';
import axiosClient from '../../config/axios';
import StatsCards from '../../components/permission/StatsCards';
import { statsData } from '../../config/constant';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
    });
    const [deletingId, setDeletingId] = useState(null);
    const [modal, contextHolder] = Modal.useModal();
   
    // 1. Thêm state roles
    const [roles, setRoles] = useState([]);
    // Chỉnh sửa user
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm] = Form.useForm();


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userRes, rolesRes] = await Promise.all([
                    axiosClient.get(`/user?page=${pagination.current}&limit=${pagination.pageSize}`),
                    axiosClient.get('/roles')
                ]);
                await new Promise(resolve => setTimeout(resolve, 500)); // hiệu ứng loading 500ms
                setUsers(userRes.data.data || []);
                setRoles(rolesRes.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: userRes.data.pagination?.total || 0,
                    current: userRes.data.pagination?.page || prev.current,
                    pageSize: userRes.data.pagination?.limit || prev.pageSize
                }));
            } catch {
                setUsers([]);
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [pagination.current, pagination.pageSize]);

    const handleTableChange = (pagination) => {
        setPagination(prev => ({
            ...prev,
            current: pagination.current,
            pageSize: pagination.pageSize
        }));
    };

    // Hàm xóa user
    const deleteUser = useCallback(async (userId, userName) => {
        setDeletingId(userId);
        setLoading(true);   // Hiện loading cho table
        if (Modal && typeof Modal.destroyAll === 'function') {
            Modal.destroyAll();
        }
        try {
            await axiosClient.delete(`/delete-user/${userId}`);
            await new Promise(resolve => setTimeout(resolve, 500)); // hiệu ứng loading 500ms
            // Load lại data sau khi xóa
            const res = await axiosClient.get(`/user?page=${pagination.current}&limit=${pagination.pageSize}`);
            setUsers(res.data.data || []);
            setPagination(prev => ({
                ...prev,
                total: res.data.pagination?.total || 0,
                current: res.data.pagination?.page || prev.current,
                pageSize: res.data.pagination?.limit || prev.pageSize
            }));
        } catch (error) {
            console.error('❌ Error deleting user:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng!';
            modal.error({
                title: 'Xóa thất bại',
                content: errorMessage,
            });
        } finally {
            setDeletingId(null);
            setLoading(false); // Tắt loading cho table
        }
    }, [pagination.current, pagination.pageSize, modal]);


    // Hàm hiển thị modal xác nhận xóa
    const showDeleteConfirm = useCallback((record) => {
        modal.confirm({
            title: 'Xác nhận xóa người dùng',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Bạn có chắc chắn muốn xóa người dùng <strong>"{record.fullName || record.username}"</strong> không?</p>
                    <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
                        ⚠️ Hành động này không thể hoàn tác!
                    </p>
                </div>
            ),
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            confirmLoading: deletingId === record.id,
            maskClosable: true,
            onOk() {
                return deleteUser(record.id, record.fullName || record.username);
            },
        });
    }, [deletingId, deleteUser]);

    // Hàm mở modal chỉnh sửa
    const showEditModal = useCallback((record) => {
        setEditingUser(record);
        editForm.setFieldsValue({
            fullName: record.fullName,
            email: record.email,
            phone: record.phone,
            roleId: record.role.name,
            status: record.status,
            address: record.address,
        });
        setIsEditModalOpen(true);
    }, [editingUser]);

    // Hàm xử lý chỉnh sửa người dùng
    const handleEditSubmit = useCallback(async (values) => {
        setIsEditSubmitting(true);
        try {
            await axiosClient.put(`/update-user/${editingUser.id}`, values);
            await new Promise(resolve => setTimeout(resolve, 500)); // hiệu ứng loading 500ms
            // Load lại data sau khi cập nhật
            const res = await axiosClient.get(`/user?page=${pagination.current}&limit=${pagination.pageSize}`);
            setUsers(res.data.data || []);
            setPagination(prev => ({
                ...prev,
                total: res.data.pagination?.total || 0,
                current: res.data.pagination?.page || prev.current,
                pageSize: res.data.pagination?.limit || prev.pageSize
            }));
            setIsEditModalOpen(false); // Đóng modal sau khi table đã cập nhật
        } catch {
            modal.error({
                title: 'Cập nhật thất bại',
                content: `Không thể cập nhật người dùng "${editingUser.fullName}".`,
            });
        } finally {
            setIsEditSubmitting(false);
        }
    }, [editingUser, pagination.current, pagination.pageSize, modal]);

    const userColumns = [
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
            title: 'Tên người dùng',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            ellipsis: true,
            render: (name, record) => (
                <div className="flex items-center">
                    <UserOutlined className="mr-2 text-blue-500" />
                    <span className="font-medium truncate">{name || record.username || 'N/A'}</span>
                </div>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true,
            render: (email) => (
                <div className="flex items-center">
                    <MailOutlined className="mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 truncate">{email || 'N/A'}</span>
                </div>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 140,
            render: (phone) => (
                <div className="flex items-center">
                    <PhoneOutlined className="mr-2 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">{phone || 'N/A'}</span>
                </div>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Tag color={record.role.name === 'admin' ? 'red' : 'blue'}>
                    {record.role.name === 'admin' ? 'Quản trị' : 'Khách hàng'}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'orange'}>
                    Hoạt động
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
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
                    onClick={() => {
                        modal.info({
                            title: (
                                <div className="flex items-center">
                                    <UserOutlined className="mr-2 text-blue-500" />
                                    <span className="text-lg font-semibold">Chi tiết người dùng</span>
                                </div>
                            ),
                            width: 700,
                            icon: null,
                            okText: 'Đóng',
                            okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600 border-blue-500' },
                            content: (
                                <div className="space-y-6">
                                    {/* Header với ID, vai trò, trạng thái */}
                                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
                                                #{record.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Tag color={record.role === 'admin' ? 'red' : record.role === 'manager' ? 'orange' : 'blue'}>
                                                {record.role === 'admin' ? 'Quản trị' : record.role === 'manager' ? 'Quản lý' : 'Khách hàng'}
                                            </Tag>
                                            <Tag color={record.status === 'active' ? 'green' : 'orange'}>
                                                Hoạt động
                                            </Tag>
                                        </div>
                                    </div>
                                    {/* Thông tin chi tiết */}
                                    <div className="space-y-4">
                                        {/* Họ và tên */}
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <UserOutlined className="text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-500 mb-1">Họ và tên</div>
                                                <div className="text-lg font-semibold text-gray-900">{record.fullName || record.username || 'N/A'}</div>
                                            </div>
                                        </div>
                                        {/* Email */}
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <MailOutlined className="text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
                                                <div className="text-lg font-medium text-gray-900">{record.email || 'N/A'}</div>
                                            </div>
                                        </div>
                                        {/* Số điện thoại */}
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <PhoneOutlined className="text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</div>
                                                <div className="text-lg font-medium text-gray-900">{record.phone || 'N/A'}</div>
                                            </div>
                                        </div>
                                        {/* Địa chỉ */}
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <EnvironmentOutlined className="text-orange-600 text-sm" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</div>
                                                <div className="text-lg font-medium text-gray-900 bg-gray-50 rounded-md">{record.address || 'N/A'}</div>
                                            </div>
                                        </div>
                                        {/* Ngày tạo */}
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <CalendarOutlined className="text-indigo-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-500 mb-1">Ngày tạo</div>
                                                <div className="text-lg font-medium text-gray-900">
                                                    {record.createdAt
                                                        ? new Date(record.createdAt).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })
                                                        : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ),
                            centered: true,
                            maskClosable: true,

                        });
                    }}
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
                        className="text-orange-600 hover:text-orange-800 p-0"
                        size="small"
                        disabled={deletingId === record.id}
                        onClick={() => showEditModal(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => showDeleteConfirm(record)}
                        disabled={deletingId === record.id}
                        loading={deletingId === record.id}
                        className="text-red-600 hover:text-red-800 p-0"
                        size="small"
                    >
                        Xóa
                    </Button>
                </Space>
            )
        }

    ];

    return (
        <>
            <div className='space-y-5'>

                {/* Statistics Cards */}
                <StatsCards statsData={statsData} />

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                        <p className="text-gray-600">Quản lý các người dùng trong hệ thống</p>
                    </div>
                </div>

                <TableDashboard
                    type="user"
                    data={users}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    columns={userColumns}
                />

                {/* Modal chỉnh sửa người dùng */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <span className="text-lg font-semibold">Chỉnh sửa người dùng</span>
                            {isEditSubmitting && (
                                <div className="ml-2 text-blue-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    }
                    open={isEditModalOpen}
                    onCancel={() => setIsEditModalOpen(false)}
                    footer={null}
                    centered
                    width={600}
                >
                    <Form
                        form={editForm}
                        layout="vertical"
                        onFinish={handleEditSubmit}
                        initialValues={editingUser}
                    >
                        <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" disabled={isEditSubmitting} />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Nhập email" disabled={isEditSubmitting} />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" disabled={isEditSubmitting} />
                        </Form.Item>
                        <Form.Item
                            name="roleId"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                        >
                            <Select
                                placeholder="Chọn vai trò"
                                options={roles.map(role => ({
                                    label: role.name,
                                    value: role.id
                                }))}
                                disabled={isEditSubmitting}
                            />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                        >
                            <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ" disabled={isEditSubmitting} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isEditSubmitting}
                                className="w-full"
                                disabled={isEditSubmitting}
                            >
                                {isEditSubmitting ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            {contextHolder}
        </>
    );
};

export default UserManager;