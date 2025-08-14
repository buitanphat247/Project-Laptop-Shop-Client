import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Plus } from 'lucide-react';
import TableDashboard from '../../components/dashboard/TableDashboard';
import { DashboardCards } from '../../components/dashboard/DashboardCard';
import { Button, Modal, Form, Input, message, Tag, Space } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { ExclamationCircleOutlined, TagOutlined, CalendarOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FolderOpenOutlined } from '@ant-design/icons';
import axiosClient from '../../config/axios';
import { getUserProfile } from '../../utils/auth';
import StatsCards from '../../components/permission/StatsCards';
import { statsData } from '../../config/constant';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [deletingId, setDeletingId] = useState(null);

    // Edit modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [editForm] = Form.useForm();
   
    // Ref để lưu trữ fetchCategories function
    const fetchCategoriesRef = useRef();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} danh mục`,
    });

    // Ant Design Form instance
    const [form] = Form.useForm();

    // useEffect để reset/set form values khi editingCategory hoặc isEditModalOpen thay đổi
    useEffect(() => {
        if (isEditModalOpen && editingCategory) {
            editForm.setFieldsValue({
                name: editingCategory.name || '',
            });
        } else if (!isEditModalOpen) {
            editForm.resetFields();
        }
    }, [editingCategory, isEditModalOpen, editForm]);

    // React Hook Form
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: ''
        }
    });

    // Hàm xóa danh mục
    const deleteCategory = useCallback(async (categoryId, categoryName) => {
        setDeletingId(categoryId);
        try {
            console.log(`🗑️ Deleting category with ID: ${categoryId}`);

            const res = await axiosClient.delete(`/delete-category/${categoryId}`);
            console.log('Delete response:', res);

            if (res.status === 200 || res.status === 204) {
                message.success(`Xóa danh mục "${categoryName}" thành công!`);
                // Refresh danh sách categories
                if (fetchCategoriesRef.current) {
                    fetchCategoriesRef.current(pagination.current, pagination.pageSize);
                }
            } else {
                message.error('Xóa danh mục thất bại!');
            }
        } catch (error) {
            console.error('❌ Error deleting category:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục!';
            message.error(errorMessage);
        } finally {
            setDeletingId(null);
        }
    }, [pagination]);

    // Hàm hiển thị modal xác nhận xóa
    const showDeleteConfirm = useCallback((record) => {
        modal.confirm({
            title: 'Xác nhận xóa danh mục',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Bạn có chắc chắn muốn xóa danh mục <strong>"{record.name}"</strong> không?</p>
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
                console.log('✅ Xác nhận xóa danh mục ID:', record.id);
                console.log('✅ Thông tin danh mục:', record);
                // Gọi API xóa danh mục
                deleteCategory(record.id, record.name);
            },
            onCancel() {
                console.log('❌ Hủy xóa danh mục');
            },
        });
    }, [modal, deletingId, deleteCategory]);

    // Hiển thị modal chỉnh sửa danh mục
    const showEditModal = useCallback((record) => {
        console.log('Opening edit modal for category:', record);
        setEditingCategory(record);
        setIsEditModalOpen(true);

        // Sử dụng setTimeout để đảm bảo form đã được mount
        setTimeout(() => {
            editForm.setFieldsValue({
                name: record.name || '',
            });
        }, 100);
    }, [editForm]);

    // Đóng modal chỉnh sửa và reset form
    const handleEditCancel = useCallback(() => {
        setIsEditModalOpen(false);
        setEditingCategory(null);
        editForm.resetFields();
    }, [editForm]);

    // Xử lý submit form chỉnh sửa
    const handleEditSubmit = useCallback(async (values) => {
        setIsEditSubmitting(true);

        try {
            const categoryData = {
                name: capitalizeFirstLetter(values.name.trim()),
            };

            // Thêm delay để tạo hiệu ứng loading đẹp
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Gọi API cập nhật danh mục
            const res = await axiosClient.put(`/update-category/${editingCategory.id}`, categoryData);

            if (res.status === 200 || res.status === 201) {
                message.success('Cập nhật danh mục thành công! 🎉');

                // Thêm delay nhỏ trước khi đóng modal
                setTimeout(() => {
                    handleEditCancel();
                    // Refresh danh sách categories
                    if (fetchCategoriesRef.current) {
                        fetchCategoriesRef.current(pagination.current, pagination.pageSize);
                    }
                }, 500);
            } else {
                message.error('Cập nhật danh mục thất bại!');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục!';
            message.error(errorMessage);
        } finally {
            setIsEditSubmitting(false);
        }
    }, [editingCategory, handleEditCancel, pagination]);


    // Category Table Columns - Định nghĩa tại đây

    const [productCounts, setProductCounts] = useState({});

    // Hàm lấy số lượng sản phẩm cho từng category
    const fetchProductCount = useCallback(async (categoryId) => {
        try {
            // Lấy hết sản phẩm, không phân trang
            const res = await axiosClient.get(`/get-list-product-by-category-id/${categoryId}`, {
                params: { limit: 1000000, page: 1 }
            });
            if (Array.isArray(res.data)) {
                setProductCounts(prev => ({ ...prev, [categoryId]: res.data.length }));
            } else if (Array.isArray(res.data.data)) {
                setProductCounts(prev => ({ ...prev, [categoryId]: res.data.data.length }));
            } else {
                setProductCounts(prev => ({ ...prev, [categoryId]: 0 }));
            }
        } catch {
            setProductCounts(prev => ({ ...prev, [categoryId]: 0 }));
        }
    }, []);

    // Khi categories thay đổi, fetch số lượng sản phẩm cho từng category
    useEffect(() => {
        categories.forEach(cat => {
            if (cat.id && productCounts[cat.id] === undefined) {
                fetchProductCount(cat.id);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    const categoryColumns = [

        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            align: 'center',
            render: (id) => (
                <div className="flex items-center justify-center">
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">#{id}</span>
                </div>
            )
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ellipsis: true,
            render: (name) => (
                <div className="flex items-center">
                    <FolderOpenOutlined className="mr-2 text-blue-500" />
                    <span className="font-medium truncate">{name}</span>
                </div>
            )
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: 160,
            ellipsis: true,
            render: (slug) => (
                <span >{slug || 'N/A'}</span>
            )
        },
        {
            title: 'Số lượng sản phẩm',
            key: 'productCount',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <span className="font-semibold text-blue-700">
                    {productCounts[record.id] !== undefined ? productCounts[record.id] : '...'}
                </span>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status) => {
                const config = {
                    active: {
                        color: 'green',
                        bg: '#f0fdf4',
                        border: '#bbf7d0',
                        text: 'Hoạt động',
                        icon: <TagOutlined className="mr-1" />
                    },
                    inactive: {
                        color: 'orange',
                        bg: '#fff7ed',
                        border: '#fed7aa',
                        text: 'Hoạt Động',
                        icon: <TagOutlined className="mr-1" />
                    }
                };
                const st = config[status] || config.active;
                return (
                    <Tag
                        style={{
                            backgroundColor: st.bg,
                            borderColor: st.border,
                            color: st.color,
                            fontWeight: 600,
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '12px'
                        }}
                    >
                        {st.icon} {st.text}
                    </Tag>
                );
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
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
                    onClick={() => {
                        modal.info({
                            title: (
                                <div className="flex items-center">
                                    <FolderOpenOutlined className="mr-2 text-blue-500" />
                                    <span className="text-lg font-semibold">Chi tiết danh mục</span>
                                </div>
                            ),
                            width: 600,
                            icon: null,
                            okText: 'Đóng',
                            okButtonProps: { className: 'bg-blue-500 hover:bg-blue-600 border-blue-500' },
                            content: (
                                <div className="space-y-6">
                                    {/* Header với ID và Status */}
                                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-md">
                                                #{record.id}
                                            </span>
                                        </div>
                                        <div>
                                            {record.status === 'active' ? (
                                                <Tag color="green" className="font-semibold">Hoạt động</Tag>
                                            ) : (
                                                <Tag color="orange" className="font-semibold">Tạm khóa</Tag>
                                            )}
                                        </div>
                                    </div>
                                    {/* Thông tin chi tiết */}
                                    <div className="space-y-4">
                                        {/* Tên danh mục */}
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <FolderOpenOutlined className="text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-500 mb-1">Tên danh mục</div>
                                                <div className="text-lg font-semibold text-gray-900">{record.name}</div>
                                            </div>
                                        </div>
                                        {/* Slug */}
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <TagOutlined className="text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-500 mb-1">Slug</div>
                                                <div className="text-lg font-mono text-gray-900 bg-gray-50 rounded-md">{record.slug || 'N/A'}</div>
                                            </div>
                                        </div>
                                        {/* Ngày tạo */}
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <CalendarOutlined className="text-green-600" />
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
            render: (_, record) => {
                const isDeleting = deletingId === record.id;
                return (
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
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => showDeleteConfirm(record)}
                            className="text-red-600 hover:text-red-800 p-0"
                            size="small"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Đang xóa...' : 'Xóa'}
                        </Button>
                    </Space>
                );
            }
        }
    ];

    const fetchCategories = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            console.log(`🚀 Fetching categories for page ${page}...`);

            const res = await axiosClient.get('/category', {
                params: {
                    page,
                    limit,
                }
            });

            console.log('Categories response:', res);

            // Đảm bảo dữ liệu là mảng và có key cho mỗi item
            const data = Array.isArray(res.data.data)
                ? res.data.data.map((item, idx) => ({
                    ...item,
                    key: item.id || idx,
                }))
                : [];

            // Giả lập loading 1 giây
            setTimeout(() => {
                setCategories(data);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: limit,
                    total: res.data.total || res.data.pagination?.total || 0,
                }));
                setLoading(false);
                console.log('✅ Categories loaded successfully');
            }, 1000);

        } catch (error) {
            console.error('❌ Error fetching categories:', error);
            setLoading(false);
        }
    }, []);

    // Lưu fetchCategories vào ref
    useEffect(() => {
        fetchCategoriesRef.current = fetchCategories;
    }, [fetchCategories]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchCategories(pagination.current, pagination.pageSize);
    }, []); // Chỉ chạy một lần khi component mount

    const handleTableChange = useCallback((paginationData) => {
        fetchCategories(paginationData.current, paginationData.pageSize);
    }, [fetchCategories]);

    // Hiển thị modal
    const showModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    // Đóng modal và reset form
    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
        form.resetFields(); // Reset Ant Design form
        reset(); // Reset React Hook Form
    }, [form, reset]);

    // Utility function để viết hoa chữ cái đầu
    const capitalizeFirstLetter = (str) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const handleSubmitAntd = useCallback(async (values) => {
        setIsSubmitting(true);
        try {
            const categoryName = capitalizeFirstLetter(values.name.trim());
            console.log('categoryName: ', categoryName);
            console.log('getUserProfile()?.id: ', getUserProfile()?.id);

            // Thêm delay để tạo hiệu ứng loading đẹp
            await new Promise(resolve => setTimeout(resolve, 1500));

            const res = await axiosClient.post('/create-category', {
                userId: getUserProfile()?.id, // Lấy userId từ profile
                name: categoryName,
            });
            console.log('res: ', res);

            if (res.status === 201 || res.status === 200) {
                message.success('Tạo danh mục thành công! 🎉');

                // Thêm delay nhỏ trước khi đóng modal
                setTimeout(() => {
                    // Reset forms sau khi thành công
                    form.resetFields(); // Reset Ant Design form
                    reset(); // Reset React Hook Form

                    setIsModalOpen(false);
                    if (fetchCategoriesRef.current) {
                        fetchCategoriesRef.current(pagination.current, pagination.pageSize);
                    }
                }, 500);
            } else {
                message.error('Tạo thất bại!');
            }
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
        } finally {
            setIsSubmitting(false);
        }
    }, [pagination, form, reset]);

    return (
        <>
            <div className='space-y-5'>
                {/* Dashboard Cards */}
                {/* Statistics Cards */}
                <StatsCards statsData={statsData} />
                {/* Create Category Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
                        <p className="text-gray-600">Quản lý các danh mục sản phẩm trong hệ thống</p>
                    </div>
                    <Button
                        type="primary"
                        className="flex items-center gap-2"
                        onClick={showModal}
                    >
                        <Plus size={16} />
                        Tạo danh mục
                    </Button>
                </div>

                {/* Table Dashboard dùng chung */}
                <TableDashboard
                    type="category"
                    data={categories}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    columns={categoryColumns}
                />

                {/* Modal tạo danh mục */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <span className="text-lg font-semibold">Tạo danh mục mới</span>
                            {isSubmitting && (
                                <div className="ml-2 text-blue-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={handleCancel}
                    confirmLoading={isSubmitting}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            htmlType="submit"
                            form="myForm"
                            loading={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo danh mục'}
                        </Button>
                    ]}
                    destroyOnClose={true}
                >
                    <Form
                        form={form}
                        id="myForm"
                        layout="vertical"
                        onFinish={handleSubmitAntd}
                        preserve={false}
                    >
                        <Form.Item
                            label="Tên danh mục"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên danh mục' },
                                { min: 2, message: 'Tối thiểu 2 ký tự' },
                                { max: 100, message: 'Tối đa 100 ký tự' }
                            ]}
                        >
                            <Input placeholder="Nhập tên danh mục" />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Modal chỉnh sửa danh mục */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <span className="text-lg font-semibold">Chỉnh sửa danh mục</span>
                            {isEditSubmitting && (
                                <div className="ml-2 text-blue-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    }
                    open={isEditModalOpen}
                    onCancel={handleEditCancel}
                    confirmLoading={isEditSubmitting}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={handleEditCancel}
                            disabled={isEditSubmitting}
                        >
                            Hủy
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            htmlType="submit"
                            form="editCategoryForm"
                            loading={isEditSubmitting}
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                        >
                            {isEditSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    ]}
                    destroyOnClose={true}
                >
                    <Form
                        form={editForm}
                        id="editCategoryForm"
                        layout="vertical"
                        onFinish={handleEditSubmit}
                        preserve={false}
                        autoComplete="off"
                        initialValues={{
                            name: editingCategory?.name || '',
                        }}
                    >
                        <Form.Item
                            label="Tên danh mục"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên danh mục' },
                                { min: 2, message: 'Tối thiểu 2 ký tự' },
                                { max: 100, message: 'Tối đa 100 ký tự' }
                            ]}
                        >
                            <Input placeholder="Nhập tên danh mục" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            {contextHolder}
        </>
    );
};

export default CategoryManager;