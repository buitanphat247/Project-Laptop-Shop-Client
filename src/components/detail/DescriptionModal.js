import React from 'react';
import { Modal, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DescriptionModal = ({ open, onClose, content }) => (
    <Modal
        title={
            <div className="flex items-center gap-2">
                <FileTextOutlined className="text-blue-500" />
                <span>Mô tả chi tiết sản phẩm</span>
            </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
    >
        <div className="max-h-[600px] overflow-y-auto">
            {content ? (
                <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{ lineHeight: '1.8', fontSize: '15px' }}
                />
            ) : (
                <div className="text-center py-12">
                    <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
                    <Text className="text-gray-500 block text-lg mb-3">
                        Chưa có mô tả chi tiết cho sản phẩm này
                    </Text>
                    <Text className="text-gray-400">
                        Vui lòng liên hệ với chúng tôi để biết thêm thông tin
                    </Text>
                </div>
            )}
        </div>
    </Modal>
);

export default DescriptionModal;