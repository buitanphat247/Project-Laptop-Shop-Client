import React, { useState, useEffect } from 'react';
import { Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import {
  SecurityScanOutlined, PlusOutlined, CalendarOutlined,
  EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined
} from '@ant-design/icons';
import TableDashboard from '../../components/dashboard/TableDashboard';
import StatsCards from '../../components/permission/StatsCards';
import slugify from 'slugify'; // Thêm dòng này
import axiosClient from '../../config/axios';

const { Option } = Select; // Sửa lại import Option từ antd

const PermissionManager = () => {

  // Mock data cho thống kê
  const statsData = {
    totalRoutes: 24,
    activeRoutes: 22,
    inactiveRoutes: 2,
    totalPermissions: 156,
    adminUsers: 3,
    managerUsers: 8,
    regularUsers: 145
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
  });
  const [modal, contextHolder] = Modal.useModal();

  // Hàm hiển thị modal chi tiết
  const showDetailModal = (record) => {
    modal.info({
      title: `Chi tiết Route: ${record.name}`,
      width: 600,
      icon: null,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50  rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Tên Route</div>
              <div className="font-medium text-gray-900">{record.name}</div>
            </div>
            <div className="bg-gray-50  rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Slug</div>
              <div className="font-mono text-blue-600">{record.slug}</div>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Đường dẫn</div>
              <div className="font-mono text-green-600">{record.route}</div>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Phương thức</div>
              <div className="font-medium">
                <Tag color="blue">{record.method}</Tag>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Tác giả</div>
              <div className="flex items-center gap-2">
                <UserOutlined className="text-gray-400" />
                <span>{record.author || 'admin'}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Trạng thái</div>
              <div>
                <Tag color="green">Hoạt động</Tag>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Ngày tạo</div>
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-purple-500" />
              <span className="font-medium text-gray-700">
                {record.createdAt ? new Date(record.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Chưa có thông tin'}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Mô tả</div>
            <div className="text-gray-700">
              Route này được sử dụng để {record.name.toLowerCase()} trong hệ thống.
              Phương thức {record.method} được áp dụng cho đường dẫn {record.route}.
            </div>
          </div>
        </div>
      ),
      okText: 'Đóng',
      centered: true,
    });
  };

  // Fetch data from /permissions with pagination
  const fetchData = async (params = {}) => {
    setTableLoading(true);
    try {
      const page = params.current || pagination.current;
      const limit = params.pageSize || pagination.pageSize;
      const skip = (page - 1) * limit;
      const res = await axiosClient.get('/permissions', {
        params: { page, limit, skip }
      });
      // Hiệu ứng loading 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(res.data.data || []);
      console.log('res.data.data: ', res.data.data);
      setPagination((prev) => ({
        ...prev,
        current: res.data.pagination?.page || page,
        pageSize: res.data.pagination?.limit || limit,
        total: res.data.pagination?.total || 0,
      }));
    } catch (error) {
      message.error('Không thể tải dữ liệu routes!');
    } finally {
      setTableLoading(false);
    }
  };

  const handleTableChange = (pag) => {
    fetchData({
      current: pag.current,
      pageSize: pag.pageSize,
    });
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (id, record, index) => (
        <span className="font-mono text-blue-500">{`#${(pagination.current - 1) * pagination.pageSize + index + 1}`}</span>
      ),
    },
    {
      title: 'Tên Route',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="flex items-center gap-2">
          <SecurityScanOutlined className="text-blue-500" />
          <span className="font-medium">{text}</span>
        </span>
      ),
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'path',
      key: 'path',
      render: (_, record) => (
        <span className="font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">{record.route}</span>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      render: (author) => (
        <span className="flex items-center gap-1">
          <UserOutlined className="text-gray-500" />
          <span>{author || 'admin'}</span>
        </span>
      ),
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (<Tag color="green">Hoạt động</Tag>)
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <span className="flex items-center gap-1">
          <CalendarOutlined className="text-purple-500" />
          <span className="text-sm font-medium text-gray-700">
            {date ? new Date(date).toLocaleDateString('vi-VN') : ''}
          </span>
        </span>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'detail',
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          className="text-blue-600 p-0"
          onClick={() => showDetailModal(record)}
        >
          Chi tiết
        </Button>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            className="text-blue-600 p-0"
          >
            Sửa
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            className="p-0"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleAddRoute = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        name: capitalizeFirst(values.name.trim()),
        method: values.method,
        route: values.route.trim(),
        slug: slugify(values.name.trim(), { lower: true, strict: true }),
      };
      await axiosClient.post('/create-permissions', payload);
      message.success('Thêm route mới thành công!');
      setModalVisible(false);
      form.resetFields();
      fetchData({ current: 1, pageSize: pagination.pageSize }); // Reload lại bảng về trang 1
    } catch (error) {
      message.error('Thêm route mới thất bại!');
    } finally {
      setSubmitting(false);
    }
  };


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);


  return (
    <>

      <StatsCards statsData={statsData} />
      {contextHolder}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý điều hướng</h1>
          <p className="text-gray-600">Quản lý các điều hướng trong hệ thống</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          className="bg-blue-500 hover:bg-blue-600 border-blue-500"
        >
          Thêm Route mới
        </Button>
      </div>
      <TableDashboard
        type="route"
        data={data}
        loading={tableLoading}
        pagination={pagination}
        onChange={handleTableChange}
        columns={columns}
      />
      <Modal
        title="Thêm Route mới"
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddRoute}
        >
          <Form.Item
            label="Tên Route"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên route!' }]}
          >
            <Input placeholder="Tên route" />
          </Form.Item>
          <Form.Item
            label="Phương thức"
            name="method"
            rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
          >
            <Select placeholder="Chọn method">
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Đường dẫn"
            name="route"
            rules={[{ required: true, message: 'Vui lòng nhập đường dẫn!' }]}
          >
            <Input placeholder="/api/example" />
          </Form.Item>
        </Form>
      </Modal>

    </>
  );
};

export default PermissionManager;