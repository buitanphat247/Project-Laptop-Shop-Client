import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TableDashboard from '../../components/dashboard/TableDashboard';
import { DashboardCards } from '../../components/dashboard/DashboardCard';
import { Button, Tag, Space, Modal, Form, Input } from 'antd';
import { FileTextOutlined, TagOutlined, UserOutlined, CalendarOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import CKEditorComponent from '../../components/editor/CKEditorComponent';
import axiosClient from '../../config/axios';
import { getUserProfile } from '../../utils/auth';
import { Modal as AntdModal, message } from 'antd';
import StatsCards from '../../components/permission/StatsCards';
import { statsData } from '../../config/constant';

const NewsManager = () => {
    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} bài viết`,
    });

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editorData, setEditorData] = useState('');
    const [form] = Form.useForm();
   
    // Giả lập userId (hoặc lấy từ context, localStorage, ...)

    const userId = 1; // Thay bằng userId thực tế nếu có

    // Thêm state loading
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [modal, contextHolder] = AntdModal.useModal(); // Ant Design modal hook

    // State cho modal chỉnh sửa
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [editEditorData, setEditEditorData] = useState('');
    const [editForm] = Form.useForm();

    // Fetch news data
    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true); // Bắt đầu loading
            try {
                const res = await axiosClient.get(`/news?page=${pagination.current}&limit=${pagination.pageSize}`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Hiệu ứng loading 500ms
                setNews(res.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.pagination?.total || 0,
                    current: res.data.pagination?.page || prev.current,
                    pageSize: res.data.pagination?.limit || prev.pageSize
                }));
            } catch (error) {
                setNews([]);
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };
        fetchNews();
    }, [pagination.current, pagination.pageSize]);

    const handleTableChange = (pagination) => {
        setPagination(prev => ({
            ...prev,
            current: pagination.current,
            pageSize: pagination.pageSize
        }));
    };


    // Hàm hiển thị modal chi tiết bài viết
    const showDetailModal = (record) => {
        modal.info({
            title: (
                <div className="flex items-center">
                    <FileTextOutlined className="mr-2 text-blue-500" />
                    <span className="text-lg font-semibold">Chi tiết bài viết</span>
                    {record.status === 'published' ? (
                        <Tag color="green" className="ml-3">Đã xuất bản</Tag>
                    ) : (
                        <Tag color="green" className="ml-3">Đã xuất bản</Tag>

                    )}
                </div>
            ),
            width: 800,
            content: (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded px-2 py-1 font-semibold text-sm">#{record.id}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <TagOutlined className="text-purple-500" />
                            <span className="font-medium">Tiêu đề:</span>
                            <span>{record.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs font-mono">{record.slug}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileTextOutlined className="text-pink-400" />
                            <span className="font-medium">Mô tả ngắn:</span>
                            <span>{record.desc || record.description}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <UserOutlined className="text-blue-400" />
                            <span className="font-medium">Tác giả:</span>
                            <span>{record.author?.fullName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarOutlined className="text-purple-500" />
                            <span className="font-medium">Ngày tạo:</span>
                            <span>{record.createdAt ? new Date(record.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                        </div>
                    </div>
                    {record.thumbnail && (
                        <div className="flex flex-col gap-2">
                            <span className="font-medium">Thumbnail:</span>
                            <img src={record.thumbnail} alt="thumbnail" loading="lazy" style={{ maxWidth: 220, borderRadius: 10, boxShadow: '0 2px 8px #0001' }} />
                        </div>
                    )}
                    <div>
                        <span className="font-medium">Nội dung:</span>
                        <div
                            style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, marginTop: 8, maxHeight: 350, overflow: 'auto', background: '#fafcff' }}
                            dangerouslySetInnerHTML={{ __html: record.content }}
                        />
                    </div>
                </div>
            ),
            okText: 'Đóng',
            icon: null,
            maskClosable: true,
        });
    };

    // Table columns cấu hình các cột cho bảng tin tức
    const newsColumns = [
        // STT: Số thứ tự hiển thị theo trang
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
        // Tiêu đề bài viết
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: 220,
            ellipsis: true,
            render: (title) => (
                <div className="flex items-center">
                    <FileTextOutlined className="mr-2 text-blue-500" />
                    <span className="font-medium truncate">{title}</span>
                </div>
            )
        },
        // Slug bài viết
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
        // Trạng thái bài viết: đã xuất bản/nháp
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status) => {
                const config = {
                    published: {
                        color: 'green',
                        bg: '#f0fdf4',
                        border: '#bbf7d0',
                        text: 'Đã xuất bản',
                        icon: <TagOutlined className="mr-1" />
                    },
                    draft: {
                        color: 'green',
                        bg: '#f0fdf4',
                        border: '#bbf7d0',
                        text: 'Đã xuất bản',
                        icon: <TagOutlined className="mr-1" />
                    }
                };
                const st = config[status] || config.draft;
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
        // Tác giả bài viết
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            width: 160,
            render: (author) => (
                <div className="flex items-center">
                    <UserOutlined className="mr-2 text-purple-500" />
                    <span className="truncate">{author?.fullName || 'N/A'}</span>
                </div>
            ),
        },
        // Ngày tạo bài viết
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
            ),
        },
        {
            title: 'Chi tiết',
            key: 'detail',
            width: 90,
            align: 'center',
            render: (text, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    className="text-blue-600 hover:text-blue-800 p-0"
                    onClick={() => showDetailModal(record)}
                >
                    Chi tiết
                </Button>
            )
        },
        // Thao tác: Sửa/Xóa (hiện tại đang disable)
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (text, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        className="text-orange-600 hover:text-orange-800 p-0"
                        size="small"
                        onClick={() => showEditModal(record)}
                        disabled={deletingId === record.id}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        className="text-red-600 hover:text-red-800 p-0"
                        size="small"
                        loading={deletingId === record.id}
                        disabled={deletingId === record.id}
                        onClick={() => showDeleteConfirm(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];

    // Modal handlers: mở/đóng modal tạo bài viết
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditorData('');
    };

    // Hàm mở modal chỉnh sửa và load dữ liệu bài viết vào form
    const showEditModal = (record) => {
        setEditingNews(record);
        setEditEditorData(record.content || '');
        setIsEditModalOpen(true);
        // Đặt giá trị cho form
        setTimeout(() => {
            editForm.setFieldsValue({
                title: record.title || '',
                description: record.desc || record.description || '',
                thumbnail: record.thumbnail || ''
            });
        }, 0);
    };

    // Hàm đóng modal chỉnh sửa
    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setEditingNews(null);
        setEditEditorData('');
        editForm.resetFields();
    };

    // Xử lý submit form tạo bài viết mới
    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            // Gửi dữ liệu lên API tạo bài viết mới
            await axiosClient.post('/create-news', {
                title: values.title,
                desc: values.description,
                thumbnail: values.thumbnail,
                content: editorData,
                userId: getUserProfile()?.id || userId,
            });
            // Sau khi tạo thành công, load lại danh sách bài viết
            const res = await axiosClient.get(`/news?page=${pagination.current}&limit=${pagination.pageSize}`);
            setNews(res.data.data || []);
            setPagination(prev => ({
                ...prev,
                total: res.data.pagination?.total || 0,
                current: res.data.pagination?.page || prev.current,
                pageSize: res.data.pagination?.limit || prev.pageSize
            }));
            // Đợi 500ms trước khi đóng modal và reset form (hiệu ứng loading)
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsModalOpen(false);
            form.resetFields();
            setEditorData('');
        } catch (error) {
            // Xử lý lỗi nếu cần
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm xóa bài viết
    const deleteNews = async (id, title) => {
        setDeletingId(id);
        setLoading(true); // Bắt đầu hiệu ứng loading cho table
        // Đóng modal xác nhận trước khi loading table
        if (Modal && typeof Modal.destroyAll === 'function') {
            Modal.destroyAll();
        }
        setTimeout(async () => {
            try {
                await axiosClient.delete(`/delete-news/${id}`);
                message.success(`Đã xóa bài viết "${title}" thành công!`);
                // Lấy lại danh sách bài viết sau khi xóa
                let page = pagination.current;
                // Nếu chỉ còn 1 bản ghi trên trang hiện tại thì sau khi xóa sẽ về trang trước
                if (news.length === 1 && page > 1) {
                    page = page - 1;
                }
                // Chờ 500ms để hiển thị hiệu ứng loading dashboard
                await new Promise(resolve => setTimeout(resolve, 500));
                const res = await axiosClient.get(`/news?page=${page}&limit=${pagination.pageSize}`);
                setNews(res.data.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.pagination?.total || 0,
                    current: res.data.pagination?.page || page,
                    pageSize: res.data.pagination?.limit || prev.pageSize
                }));
            } catch (error) {
                message.error('Xóa bài viết thất bại!');
            } finally {
                setDeletingId(null);
                setLoading(false); // Kết thúc hiệu ứng loading
            }
        }, 200); // Đợi một chút để modal đóng hẳn rồi mới loading (tránh giật)
    };

    // Hàm hiển thị modal xác nhận xóa
    const showDeleteConfirm = (record) => {
        modal.confirm({
            title: 'Xác nhận xóa bài viết',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Bạn có chắc chắn muốn xóa bài viết <strong>"{record.title}"</strong> không?</p>
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
                return deleteNews(record.id, record.title);
            },
        });
    };

    // Hàm submit cập nhật bài viết
    const handleEditSubmit = async (values) => {
        setIsEditSubmitting(true);
        try {
            await axiosClient.put(`/update-news/${editingNews.id}`, {
                title: values.title,
                desc: values.description,
                thumbnail: values.thumbnail,
                content: editEditorData,
                userId: editingNews.userId,
            });
            // Sau khi cập nhật, load lại danh sách bài viết
            const res = await axiosClient.get(`/news?page=${pagination.current}&limit=${pagination.pageSize}`);
            setNews(res.data.data || []);
            setPagination(prev => ({
                ...prev,
                total: res.data.pagination?.total || 0,
                current: res.data.pagination?.page || prev.current,
                pageSize: res.data.pagination?.limit || prev.pageSize
            }));
            // Đợi 500ms trước khi đóng modal và reset form (hiệu ứng loading)
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsEditModalOpen(false);
            setEditingNews(null);
            setEditEditorData('');
            editForm.resetFields();
            message.success('Cập nhật bài viết thành công!');
        } catch (error) {
            message.error('Cập nhật bài viết thất bại!');
        } finally {
            setIsEditSubmitting(false);
        }
    };

    return (
        <>
            <div className='space-y-5'>
                {/* Statistics Cards */}
                <StatsCards statsData={statsData} />

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
                        <p className="text-gray-600">Quản lý các bài viết tin tức trong hệ thống</p>
                    </div>
                    <Button
                        type="primary"
                        className="flex items-center gap-2"
                        onClick={showModal}
                    >
                        <Plus size={16} />
                        Tạo bài viết
                    </Button>
                </div>

                <TableDashboard
                    type="news"
                    data={news}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    columns={newsColumns}
                />

                {/* Modal tạo bài viết với CKEditor */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <span className="text-lg font-semibold">Tạo bài viết mới</span>
                            {isSubmitting && (
                                <div className="ml-2 text-blue-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={handleCancel}
                    width={1000}
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
                            form="newsForm"
                            loading={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo bài viết'}
                        </Button>
                    ]}
                    destroyOnClose={true}
                >
                    <Form
                        form={form}
                        id="newsForm"
                        layout="vertical"
                        onFinish={handleSubmit}
                        preserve={false}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tiêu đề' },
                                { min: 5, message: 'Tối thiểu 5 ký tự' },
                                { max: 200, message: 'Tối đa 200 ký tự' },
                            ]}
                        >
                            <Input placeholder="Nhập tiêu đề bài viết" disabled={isSubmitting} />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả ngắn"
                            name="description"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả ngắn' },
                                { min: 10, message: 'Tối thiểu 10 ký tự' },
                                { max: 500, message: 'Tối đa 500 ký tự' },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Nhập mô tả ngắn cho bài viết"
                                rows={3}
                                disabled={isSubmitting}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Link hình ảnh thumbnail"
                            name="thumbnail"
                            rules={[
                                { required: true, message: 'Vui lòng nhập link hình ảnh' },
                                {
                                    type: 'url',
                                    message: 'Đường dẫn không hợp lệ (phải bắt đầu bằng http:// hoặc https://)',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập đường dẫn ảnh thumbnail (https://...)" disabled={isSubmitting} />
                        </Form.Item>

                        <Form.Item
                            label="Nội dung bài viết"
                            required
                        >
                            <CKEditorComponent
                                data={editorData}
                                onChange={(data) => setEditorData(data)}
                                placeholder="Nhập nội dung bài viết..."
                                height="400px"
                                disabled={isSubmitting}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Modal chỉnh sửa bài viết */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <span className="text-lg font-semibold">Chỉnh sửa bài viết</span>
                            {isEditSubmitting && (
                                <div className="ml-2 text-blue-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    }
                    open={isEditModalOpen}
                    onCancel={handleEditCancel}
                    width={1000}
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
                            form="editNewsForm"
                            loading={isEditSubmitting}
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500"
                        >
                            {isEditSubmitting ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
                        </Button>
                    ]}
                    destroyOnClose={true}
                >
                    <Form
                        form={editForm}
                        id="editNewsForm"
                        layout="vertical"
                        onFinish={handleEditSubmit}
                        preserve={false}
                        autoComplete="off"
                        initialValues={{
                            title: editingNews?.title || '',
                            description: editingNews?.desc || editingNews?.description || '',
                            thumbnail: editingNews?.thumbnail || ''
                        }}
                    >
                        <Form.Item
                            label="Tiêu đề"
                            name="title"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tiêu đề' },
                                { min: 5, message: 'Tối thiểu 5 ký tự' },
                                { max: 200, message: 'Tối đa 200 ký tự' },
                            ]}
                        >
                            <Input placeholder="Nhập tiêu đề bài viết" disabled={isEditSubmitting} />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả ngắn"
                            name="description"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mô tả ngắn' },
                                { min: 10, message: 'Tối thiểu 10 ký tự' },
                                { max: 500, message: 'Tối đa 500 ký tự' },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Nhập mô tả ngắn cho bài viết"
                                rows={3}
                                disabled={isEditSubmitting}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Link hình ảnh thumbnail"
                            name="thumbnail"
                            rules={[
                                { required: true, message: 'Vui lòng nhập link hình ảnh' },
                                {
                                    type: 'url',
                                    message: 'Đường dẫn không hợp lệ (phải bắt đầu bằng http:// hoặc https://)',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập đường dẫn ảnh thumbnail (https://...)" disabled={isEditSubmitting} />
                        </Form.Item>

                        <Form.Item
                            label="Nội dung bài viết"
                            required
                        >
                            <CKEditorComponent
                                data={editEditorData}
                                onChange={(data) => setEditEditorData(data)}
                                placeholder="Nhập nội dung bài viết..."
                                height="400px"
                                disabled={isEditSubmitting}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {contextHolder}
            </div>
            {contextHolder}
        </>
    );
};

export default NewsManager;