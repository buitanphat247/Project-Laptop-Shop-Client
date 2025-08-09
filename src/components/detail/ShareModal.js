import React from 'react';
import { Modal, Button, Divider, Typography } from 'antd';
import { ShareAltOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ShareModal = ({
    open,
    onClose,
    copiedLink,
    copyProductLink,
    shareToSocial
}) => (
    <Modal
        title={
            <div className="flex items-center gap-2">
                <ShareAltOutlined className="text-blue-500" />
                <span>Chia sẻ sản phẩm</span>
            </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={400}
    >
        <div className="text-center">
            <Text className="block mb-4 text-gray-600">
                Chia sẻ sản phẩm này với bạn bè
            </Text>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                    { name: 'facebook', label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
                    { name: 'whatsapp', label: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
                    { name: 'twitter', label: 'Twitter', color: 'bg-blue-400 hover:bg-blue-500' },
                    { name: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' }
                ].map((platform) => (
                    <Button
                        key={platform.name}
                        block
                        size="large"
                        onClick={() => shareToSocial(platform.name)}
                        className={`${platform.color} text-white border-0`}
                    >
                        {platform.label}
                    </Button>
                ))}
            </div>

            <Divider>hoặc</Divider>

            <Button
                block
                size="large"
                icon={copiedLink ? <CheckOutlined /> : <CopyOutlined />}
                onClick={copyProductLink}
                className={copiedLink ? 'bg-green-50 border-green-200 text-green-600' : ''}
            >
                {copiedLink ? 'Đã sao chép!' : 'Sao chép liên kết'}
            </Button>
        </div>
    </Modal>
);

export default ShareModal;