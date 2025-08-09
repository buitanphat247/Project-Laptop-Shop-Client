import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import TableDashboard from '../../components/dashboard/TableDashboard';
import { DashboardCards } from '../../components/dashboard/DashboardCard';
import { Button, Tag, Space, Modal, message, Image, Form, Input, Select } from 'antd';
import { ExclamationCircleOutlined, TagOutlined, CalendarOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FolderOpenOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import axiosClient from '../../config/axios';
import CKEditorComponent from '../../components/editor/CKEditorComponent';
import { getUserProfile } from '../../utils/auth';
import StatsCards from '../../components/permission/StatsCards';
import { statsData } from '../../config/constant';

const { TextArea } = Input;
const { Option } = Select;

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [deletingId, setDeletingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editorData, setEditorData] = useState('');
    const [categories, setCategories] = useState([]);
    const [imageFields, setImageFields] = useState([{ id: 1 }]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} sản phẩm`,
    });

    // React Hook Form instance
    const [form] = Form.useForm();

    // 1. State cho edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm] = Form.useForm();
    const [editEditorData, setEditEditorData] = useState('');
    const [editImageFields, setEditImageFields] = useState([{ id: 1 }]);

    // Hàm thêm field hình ảnh
    const addImageField = () => {
        const newId = Math.max(...imageFields.map(f => f.id)) + 1;
        setImageFields([...imageFields, { id: newId }]);
    };

    // Hàm xóa field hình ảnh
    const removeImageField = (idToRemove) => {
        if (imageFields.length > 1) {
            setImageFields(imageFields.filter(field => field.id !== idToRemove));
            // Xóa giá trị form tương ứng
            const fieldName = `image_${idToRemove}`;
            form.setFieldsValue({ [fieldName]: undefined });
        }
    };

    // Hàm xóa sản phẩm
    const deleteProduct = async (productId, productName) => {
        setDeletingId(productId);
        try {
            console.log(`🗑️ Deleting product with ID: ${productId}`);

            const res = await axiosClient.delete(`/delete-product/${productId}`);
            console.log('Delete response:', res);

            if (res.status === 200 || res.status === 204) {
                message.success(`Xóa sản phẩm "${productName}" thành công!`);
                fetchProducts(pagination.current, pagination.pageSize);
            } else {
                message.error('Xóa sản phẩm thất bại!');
            }
        } catch (error) {
            console.error('❌ Error deleting product:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm!';
            message.error(errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

    // Hàm hiển thị modal xác nhận xóa
    const showDeleteConfirm = (record) => {
        modal.confirm({
            title: 'Xác nhận xóa sản phẩm',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>"{record.name}"</strong> không?</p>
                    <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
                        ⚠️ Hành động này không thể hoàn tác!
                    </p>
                </div>
            ),
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            confirmLoading: deletingId === record.id,
            onOk() {
                console.log('✅ Xác nhận xóa sản phẩm ID:', record.id);
                console.log('✅ Thông tin sản phẩm:', record);
                deleteProduct(record.id, record.name);
            },
            onCancel() {
                console.log('❌ Hủy xóa sản phẩm');
            },
        });
    };

    // Hiển thị modal tạo sản phẩm
    const showModal = () => {
        setIsModalOpen(true);
        // Fetch categories khi mở modal
        fetchCategories();
    };

    // Đóng modal và reset form
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditorData('');
        // Reset dynamic fields
        setImageFields([{ id: 1 }]);
    };

    // Xử lý submit form
    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            console.log('editorData: ', editorData);

            // Kiểm tra nếu không có mô tả trong editor
            if (!editorData || editorData.trim() === '') {
                message.error('Vui lòng nhập mô tả sản phẩm!');
                setIsSubmitting(false);
                return;
            }
            const images = imageFields
                .map(field => values[`image_${field.id}`])
                .filter(image => image && image.trim() !== '');
            console.log('images: ', images);
            if (images.length === 0) {
                message.error('Vui lòng thêm ít nhất 1 hình ảnh!');
                setIsSubmitting(false);
                return;
            }
            const productData = {
                name: values.name.trim(),
                description: values.desc.trim(),
                imageUrls: images,
                content: editorData,
                categoryId: values.categoryId,
                price: parseInt(values.price),
                stock: parseInt(values.stock),
                userId: getUserProfile()?.id || null
            };
            console.log('🚀 Product Data to send:', productData);

            // Thêm delay để tạo hiệu ứng loading đẹp
            await new Promise(resolve => setTimeout(resolve, 1500));

            const res = await axiosClient.post('/create-product', productData);
            console.log('✅ Create product response:', res);

            if (res.status === 200 || res.status === 201) {
                message.success('Tạo sản phẩm thành công!');
                // Thêm delay nhỏ trước khi đóng modal
                setTimeout(() => {
                    handleCancel();
                    fetchProducts(pagination.current, pagination.pageSize);
                }, 500);
            } else {
                message.error('Tạo sản phẩm thất bại!');
            }
        } catch (error) {
            console.error('❌ Error creating product:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!';
            message.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 2. Hàm mở modal chỉnh sửa và fill dữ liệu
    const showEditModal = (record) => {
        setEditingProduct(record);
        setEditEditorData(record.content || '');
        // Fill hình ảnh
        if (Array.isArray(record.imageUrls) && record.imageUrls.length > 0) {
            const fields = record.imageUrls.map((_, idx) => ({ id: idx + 1 }));
            setEditImageFields(fields);
            setTimeout(() => {
                const imageValues = {};
                record.imageUrls.forEach((url, idx) => {
                    imageValues[`image_${idx + 1}`] = url;
                });
                editForm.setFieldsValue(imageValues);
            }, 0);
        } else {
            setEditImageFields([{ id: 1 }]);
            setTimeout(() => {
                editForm.setFieldsValue({ image_1: '' });
            }, 0);
        }
        // Fill các trường khác
        editForm.setFieldsValue({
            name: record.name || '',
            categoryId: record.category?.id || '',
            price: record.price || '',
            stock: record.stock || '',
            desc: record.description || '',
        });
        setIsEditModalOpen(true);
    };

    // 3. Hàm đóng modal chỉnh sửa
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
        editForm.resetFields();
        setEditEditorData('');
        setEditImageFields([{ id: 1 }]);
    };

    // 4. Hàm thêm/xóa field hình ảnh cho edit
    const addEditImageField = () => {
        const newId = Math.max(...editImageFields.map(f => f.id)) + 1;
        setEditImageFields([...editImageFields, { id: newId }]);
    };

    const removeEditImageField = (idToRemove) => {
        if (editImageFields.length > 1) {
            setEditImageFields(editImageFields.filter(field => field.id !== idToRemove));
            editForm.setFieldsValue({ [`image_${idToRemove}`]: undefined });
        }
    };

    // 5. Hàm submit form chỉnh sửa
    const handleEditSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            console.log('editEditorData: ', editEditorData);

            // Kiểm tra nếu không có mô tả trong editor
            if (!editEditorData || editEditorData.trim() === '') {
                message.error('Vui lòng nhập mô tả sản phẩm!');
                setIsSubmitting(false);
                return;
            }
            const editImages = editImageFields
                .map(field => values[`image_${field.id}`])
                .filter(image => image && image.trim() !== '');
            console.log('editImages: ', editImages);
            if (editImages.length === 0) {
                message.error('Vui lòng thêm ít nhất 1 hình ảnh!');
                setIsSubmitting(false);
                return;
            }
            const productData = {
                id: editingProduct.id, // ID của sản phẩm đang được chỉnh sửa
                name: values.name.trim(),
                description: values.desc.trim(),
                imageUrls: editImages,
                content: editEditorData,
                categoryId: values.categoryId,
                price: parseInt(values.price),
                stock: parseInt(values.stock),
                userId: getUserProfile()?.id || null
            };
            console.log('🚀 Product Data to update:', productData);

            // Thêm delay để tạo hiệu ứng loading đẹp
            await new Promise(resolve => setTimeout(resolve, 1500));

            const res = await axiosClient.put(`/update-product/${editingProduct.id}`, productData);
            console.log('✅ Update product response:', res);

            if (res.status === 200 || res.status === 201) {
                message.success('Cập nhật sản phẩm thành công!');
                // Thêm delay nhỏ trước khi đóng modal
                setTimeout(() => {
                    handleEditCancel();
                    fetchProducts(pagination.current, pagination.pageSize);
                }, 500);
            } else {
                message.error('Cập nhật sản phẩm thất bại!');
            }
        } catch (error) {
            console.error('❌ Error updating product:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm!';
            message.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };


    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await axiosClient.get('/category');
            console.log('Categories response:', res);

            const categoryData = Array.isArray(res.data.data) ? res.data.data : [];
            setCategories(categoryData);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };


    const formatVND = (price) => {
        if (typeof price !== 'number') return 'N/A';
        return price.toLocaleString('vi-VN') + '₫';
    };

    // Product Table Columns
    const productColumns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
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
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 220,
            ellipsis: true,
            render: (name) => (
                <div className="flex items-center">
                    <ShoppingCartOutlined className="mr-2 text-blue-500" />
                    <span className="font-medium truncate">{name || 'N/A'}</span>
                </div>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 160,
            ellipsis: true,
            render: (category) => (
                <div className="flex items-center">
                    <FolderOpenOutlined className="mr-2 text-purple-500" />
                    <span className="truncate">{category?.name || 'N/A'}</span>
                </div>
            )
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            width: 130,
            render: (price) => (
                <>
                    <DollarOutlined className="mr-1 text-green-600" />
                    <span className="font-bold text-green-600 text-sm">
                        {formatVND(parseInt(price))}
                    </span>
                </>
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'stock',
            key: 'stock',
            width: 100,
            align: 'center',
            render: (stock) => (
                <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
                    {stock || 0}
                </Tag>
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
                        text: 'Tạm khóa',
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

    // Fetch products
    const fetchProducts = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            console.log(`🚀 Fetching products for page ${page}...`);

            const res = await axiosClient.get('/product', {
                params: {
                    page,
                    limit,
                }
            });

            console.log('Products response:', res);

            const data = Array.isArray(res.data.data)
                ? res.data.data.map((item, idx) => ({
                    ...item,
                    key: item.id || idx,
                }))
                : [];

            // Giả lập loading 500ms
            setTimeout(() => {
                setProducts(data);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: limit,
                    total: res.data.total || res.data.pagination?.total || 0,
                }));
                setLoading(false);
                console.log('✅ Products loaded successfully');
            }, 500);

        } catch (error) {
            console.error('❌ Error fetching products:', error);
            setTimeout(() => {
                setProducts([]);
                setPagination(prev => ({
                    ...prev,
                    total: 0,
                }));
                setLoading(false);
            }, 500);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchProducts(pagination.current, pagination.pageSize);
    }, []); // Chỉ chạy một lần khi component mount

    const handleTableChange = (paginationData) => {
        fetchProducts(paginationData.current, paginationData.pageSize);
    };
  

    return (
        <>
            <div className='space-y-5'>
                {/* Dashboard Cards */}

                {/* Statistics Cards */}
                <StatsCards statsData={statsData} />

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
                        <p className="text-gray-600">Quản lý các sản phẩm trong hệ thống</p>
                    </div>
                    {/* Create Product Button */}
                    <Button
                        type="primary"
                        className="flex items-center gap-2"
                        onClick={showModal}
                    >
                        <Plus size={16} />
                        Tạo sản phẩm
                    </Button>
                </div>

                {/* Table Dashboard dùng chung */}
                <TableDashboard
                    type="product"
                    data={products}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    columns={productColumns}
                />

                {/* Modal tạo sản phẩm với React Hook Form */}
                <Modal
                    title="Tạo sản phẩm mới"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    width={1200}
                    footer={[
                        <Button key="cancel" onClick={handleCancel} disabled={isSubmitting}>
                            Hủy
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            htmlType="submit"
                            form="productForm"
                            loading={isSubmitting}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
                        </Button>
                    ]}
                    confirmLoading={isSubmitting}
                    destroyOnClose={true}
                >
                    <Form
                        form={form}
                        id="productForm"
                        layout="vertical"
                        onFinish={handleSubmit}
                        preserve={false}
                        autoComplete="off"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tên sản phẩm */}
                            <Form.Item
                                label="Tên sản phẩm"
                                name="name"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên sản phẩm' },
                                    { min: 3, message: 'Tối thiểu 3 ký tự' },
                                    { max: 200, message: 'Tối đa 200 ký tự' }
                                ]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" />
                            </Form.Item>

                            {/* Danh mục */}
                            <Form.Item
                                label="Danh mục"
                                name="categoryId"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                            >
                                <Select
                                    placeholder="Chọn danh mục"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {categories.map(category => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Giá bán */}
                            <Form.Item
                                label="Giá bán (VND)"
                                name="price"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giá bán' },
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Nhập giá bán"
                                    addonAfter="VND"
                                />
                            </Form.Item>

                            {/* Số lượng */}
                            <Form.Item
                                label="Số lượng trong kho"
                                name="stock"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số lượng' },
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Nhập số lượng"
                                    addonAfter="sản phẩm"
                                />
                            </Form.Item>
                        </div>

                        {/* Mô tả ngắn */}
                        <Form.Item
                            label="Mô tả ngắn"
                            name="desc"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả ngắn' },
                                { min: 10, message: 'Tối thiểu 10 ký tự' },
                                { max: 500, message: 'Tối đa 500 ký tự' }
                            ]}
                        >
                            <TextArea
                                placeholder="Nhập mô tả ngắn cho sản phẩm"
                                rows={3}
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>

                        {/* Hình ảnh sản phẩm - Dynamic Fields */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <Button
                                    type="dashed"
                                    icon={<Plus size={16} />}
                                    onClick={addImageField}
                                    size="small"
                                >
                                    Thêm hình ảnh
                                </Button>
                            </div>

                            {imageFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <Form.Item
                                        name={`image_${field.id}`}
                                        className="flex-1 mb-2"
                                        rules={[
                                            index === 0 ? { required: true, message: 'Vui lòng nhập ít nhất 1 hình ảnh' } : {},
                                            { type: 'url', message: 'Đường dẫn không hợp lệ' }
                                        ]}
                                    >
                                        <Input
                                            placeholder={`Nhập đường dẫn hình ảnh ${index + 1} (https://...)`}
                                        />
                                    </Form.Item>

                                    {imageFields.length > 1 && (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<Trash2 size={16} />}
                                            onClick={() => removeImageField(field.id)}
                                            className="mt-1"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mô tả chi tiết với CKEditor */}
                        <Form.Item
                            label="Mô tả chi tiết"
                            required
                        >
                            <CKEditorComponent
                                data={editorData}
                                onChange={(data) => setEditorData(data)}
                                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                height="400px"
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Modal chỉnh sửa sản phẩm */}
                <Modal
                    title={
                        <span className="flex items-center gap-2">
                            {isSubmitting && <span className="animate-spin inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></span>}
                            Chỉnh sửa sản phẩm
                        </span>
                    }
                    open={isEditModalOpen}
                    onCancel={handleEditCancel}
                    onOk={() => editForm.submit()}
                    okText="Cập nhật"
                    cancelText="Hủy"
                    width={1200}
                    confirmLoading={isSubmitting}
                    destroyOnClose
                >
                    <Form
                        form={editForm}
                        layout="vertical"
                        onFinish={handleEditSubmit}
                        initialValues={{}}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tên sản phẩm */}
                            <Form.Item
                                label="Tên sản phẩm"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" disabled={isSubmitting} />
                            </Form.Item>
                            {/* Danh mục */}
                            <Form.Item
                                label="Danh mục"
                                name="categoryId"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                            >
                                <Select placeholder="Chọn danh mục" disabled={isSubmitting}>
                                    {categories.map(cat => (
                                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            {/* Giá bán */}
                            <Form.Item
                                label="Giá bán"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
                            >
                                <Input type="number" placeholder="Nhập giá bán" addonAfter="VND" disabled={isSubmitting} />
                            </Form.Item>
                            {/* Số lượng */}
                            <Form.Item
                                label="Số lượng trong kho"
                                name="stock"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                            >
                                <Input type="number" placeholder="Nhập số lượng" addonAfter="sản phẩm" disabled={isSubmitting} />
                            </Form.Item>
                        </div>
                        {/* Mô tả ngắn */}
                        <Form.Item
                            label="Mô tả ngắn"
                            name="desc"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả ngắn' },
                                { min: 10, message: 'Tối thiểu 10 ký tự' },
                                { max: 500, message: 'Tối đa 500 ký tự' }
                            ]}
                        >
                            <TextArea placeholder="Nhập mô tả ngắn cho sản phẩm" rows={3} showCount maxLength={500} disabled={isSubmitting} />
                        </Form.Item>
                        {/* Hình ảnh sản phẩm - Dynamic Fields */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <Button
                                    type="dashed"
                                    icon={<Plus size={16} />}
                                    onClick={addEditImageField}
                                    size="small"
                                    disabled={isSubmitting}
                                >
                                    Thêm hình ảnh
                                </Button>
                            </div>
                            {editImageFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <Form.Item
                                        name={`image_${field.id}`}
                                        className="flex-1 mb-2"
                                        rules={[
                                            index === 0 ? { required: true, message: 'Vui lòng nhập ít nhất 1 hình ảnh' } : {},
                                            { type: 'url', message: 'Đường dẫn không hợp lệ' }
                                        ]}
                                    >
                                        <Input placeholder={`Nhập đường dẫn hình ảnh ${index + 1} (https://...)`} disabled={isSubmitting} />
                                    </Form.Item>
                                    {editImageFields.length > 1 && (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<Trash2 size={16} />}
                                            onClick={() => removeEditImageField(field.id)}
                                            className="mt-1"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Mô tả chi tiết với CKEditor */}
                        <Form.Item label="Mô tả chi tiết" required>
                            <CKEditorComponent
                                data={editEditorData}
                                onChange={setEditEditorData}
                                placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                height="400px"
                                disabled={isSubmitting}
                            />
                        </Form.Item>
                    </Form>
                </Modal>


            </div>
            {contextHolder}
        </>
    );
};

export default ProductManager;