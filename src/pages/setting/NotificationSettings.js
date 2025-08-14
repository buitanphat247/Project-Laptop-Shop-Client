import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Switch, Button, message, Divider, Space, Skeleton, Alert } from 'antd';
import {
    BellOutlined,
    MailOutlined,
    MessageOutlined,
    MobileOutlined,
    SoundOutlined,
    DesktopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    SettingOutlined
} from '@ant-design/icons';

/**
 * 🚧 NOTIFICATION SETTINGS PAGE - UNDER DEVELOPMENT 🚧
 * 
 * ⚠️  WARNING: This is a demo UI for development purposes only!
 * ⚠️  DO NOT modify this file unless you're working on notification features
 * ⚠️  This page contains demo data and mock functionality
 * 
 * Features:
 * - Email notification settings
 * - SMS notification settings  
 * - Push notification settings
 * - General notification preferences
 * - Mock API integration with fallback data
 * - Loading states and form validation
 * 
 * @author: Development Team
 * @status: In Development
 * @version: 1.0.0
 */

const NotificationSettings = ({ userInfo, onUpdate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notifications, setNotifications] = useState(null);
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const DEMO_LOCKED = true; // UI demo lock: show-only, disable all interactions

    // Fetch user notification preferences
    const fetchNotificationSettings = useCallback(async () => {
        if (!userInfo?.id) return;

        try {
            setLoading(true);
            setSkeletonLoading(true);
            // Simulate API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock notification settings
            const mockSettings = {
                email: {
                    orderUpdates: true,
                    promotions: false,
                    newsletter: true,
                    security: true,
                },
                sms: {
                    orderUpdates: true,
                    promotions: false,
                    security: true,
                },
                push: {
                    orderUpdates: true,
                    promotions: true,
                    security: true,
                    general: false,
                },
                general: {
                    sound: true,
                    vibration: true,
                    doNotDisturb: false,
                }
            };

            setNotifications(mockSettings);
            form.setFieldsValue({
                // Email notifications
                emailOrderUpdates: mockSettings.email.orderUpdates,
                emailPromotions: mockSettings.email.promotions,
                emailNewsletter: mockSettings.email.newsletter,
                emailSecurity: mockSettings.email.security,

                // SMS notifications
                smsOrderUpdates: mockSettings.sms.orderUpdates,
                smsPromotions: mockSettings.sms.promotions,
                smsSecurity: mockSettings.sms.security,

                // Push notifications
                pushOrderUpdates: mockSettings.push.orderUpdates,
                pushPromotions: mockSettings.push.promotions,
                pushSecurity: mockSettings.push.security,
                pushGeneral: mockSettings.push.general,

                // General settings
                sound: mockSettings.general.sound,
                vibration: mockSettings.general.vibration,
                doNotDisturb: mockSettings.general.doNotDisturb,
            });

        } catch (error) {
            message.warning('Không thể tải cài đặt thông báo, sử dụng cài đặt mặc định');
        } finally {
            setLoading(false);
            setTimeout(() => setSkeletonLoading(false), 250);
        }
    }, [userInfo?.id, form]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setSaving(true);
        try {
            console.log('🚀 Saving notification settings:', values);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 250));

            // Update local state
            const updatedSettings = {
                email: {
                    orderUpdates: values.emailOrderUpdates,
                    promotions: values.emailPromotions,
                    newsletter: values.emailNewsletter,
                    security: values.emailSecurity,
                },
                sms: {
                    orderUpdates: values.smsOrderUpdates,
                    promotions: values.smsPromotions,
                    security: values.smsSecurity,
                },
                push: {
                    orderUpdates: values.pushOrderUpdates,
                    promotions: values.pushPromotions,
                    security: values.pushSecurity,
                    general: values.pushGeneral,
                },
                general: {
                    sound: values.sound,
                    vibration: values.vibration,
                    doNotDisturb: values.doNotDisturb,
                }
            };

            setNotifications(updatedSettings);

            // Update parent component if needed
            if (onUpdate) {
                onUpdate({ notificationSettings: updatedSettings });
            }

            console.log('✅ Notification settings saved successfully:', updatedSettings);
            message.success('Cài đặt thông báo đã được lưu thành công!');
        } catch (error) {
            console.error('❌ Error saving notification settings:', error);
            message.error('Không thể lưu cài đặt. Vui lòng thử lại sau.');
        } finally {
            setSaving(false);
        }
    };

    // Initialize data
    useEffect(() => {
        setSkeletonLoading(true);
        fetchNotificationSettings();
        // eslint-disable-next-line
    }, [userInfo?.id]);

    if (skeletonLoading) {
        return (
            <Card title="Cài đặt thông báo" className="shadow-sm">
                <div className="flex flex-col gap-6">
                    <Skeleton.Input style={{ width: 200, marginBottom: 24 }} active />
                    {[1, 2, 3, 4].map(i => (
                        <Card size="small" className="mb-4" key={i}>
                            <Skeleton active paragraph={{ rows: 3 }} />
                        </Card>
                    ))}
                    <div className="mt-6 flex gap-3">
                        <Skeleton.Button active style={{ width: 140 }} />
                        <Skeleton.Button active style={{ width: 100 }} />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {DEMO_LOCKED && (
                <Alert
                    message="Trang Cài đặt thông báo đang phát triển"
                    description="Đây là UI demo chỉ để trình bày. Vui lòng không thao tác."
                    type="warning"
                    showIcon
                    banner
                />
            )}

            <div className={DEMO_LOCKED ? 'relative' : ''}>
                <div className={DEMO_LOCKED ? 'pointer-events-none opacity-60 select-none' : ''}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <BellOutlined />
                                <span>Cài đặt thông báo</span>
                            </div>
                        }
                        className="shadow-sm"
                    >
                        {/* User Info Display */}
                        {userInfo && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Thông tin tài khoản</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-700">Email:</span>
                                        <div className="font-medium">{userInfo.email || 'Chưa cập nhật'}</div>
                                    </div>
                                    <div>
                                        <span className="text-blue-700">Điện thoại:</span>
                                        <div className="font-medium">{userInfo.phone || 'Chưa cập nhật'}</div>
                                    </div>
                                    <div>
                                        <span className="text-blue-700">Vai trò:</span>
                                        <div className="font-medium">{userInfo.role?.toUpperCase() || 'USER'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Email Notifications */}
                <Card size="small" className="mb-4" title={
                    <div className="flex items-center gap-2 text-base">
                        <MailOutlined className="text-blue-500" />
                        <span>Thông báo Email</span>
                    </div>
                }>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Cập nhật đơn hàng</h4>
                                <p className="text-sm text-gray-500">Nhận thông báo về trạng thái đơn hàng</p>
                            </div>
                            <Form.Item name="emailOrderUpdates" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Khuyến mãi & Ưu đãi</h4>
                                <p className="text-sm text-gray-500">Nhận thông tin về các chương trình khuyến mãi</p>
                            </div>
                            <Form.Item name="emailPromotions" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Newsletter</h4>
                                <p className="text-sm text-gray-500">Nhận bản tin hàng tuần về sản phẩm mới</p>
                            </div>
                            <Form.Item name="emailNewsletter" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Bảo mật</h4>
                                <p className="text-sm text-gray-500">Thông báo về hoạt động bảo mật tài khoản</p>
                            </div>
                            <Form.Item name="emailSecurity" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                {/* SMS Notifications */}
                <Card size="small" className="mb-4" title={
                    <div className="flex items-center gap-2 text-base">
                        <MessageOutlined className="text-green-500" />
                        <span>Thông báo SMS</span>
                    </div>
                }>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Cập nhật đơn hàng</h4>
                                <p className="text-sm text-gray-500">SMS về trạng thái giao hàng</p>
                            </div>
                            <Form.Item name="smsOrderUpdates" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Khuyến mãi</h4>
                                <p className="text-sm text-gray-500">SMS về các ưu đãi đặc biệt</p>
                            </div>
                            <Form.Item name="smsPromotions" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Bảo mật</h4>
                                <p className="text-sm text-gray-500">SMS xác thực và cảnh báo bảo mật</p>
                            </div>
                            <Form.Item name="smsSecurity" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                {/* Push Notifications */}
                <Card size="small" className="mb-4" title={
                    <div className="flex items-center gap-2 text-base">
                        <MobileOutlined className="text-purple-500" />
                        <span>Thông báo Push</span>
                    </div>
                }>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Cập nhật đơn hàng</h4>
                                <p className="text-sm text-gray-500">Thông báo push về đơn hàng</p>
                            </div>
                            <Form.Item name="pushOrderUpdates" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Khuyến mãi</h4>
                                <p className="text-sm text-gray-500">Thông báo về ưu đãi và sale</p>
                            </div>
                            <Form.Item name="pushPromotions" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Bảo mật</h4>
                                <p className="text-sm text-gray-500">Cảnh báo bảo mật quan trọng</p>
                            </div>
                            <Form.Item name="pushSecurity" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Thông báo chung</h4>
                                <p className="text-sm text-gray-500">Tin tức và cập nhật hệ thống</p>
                            </div>
                            <Form.Item name="pushGeneral" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                {/* General Settings */}
                <Card size="small" className="mb-6" title={
                    <div className="flex items-center gap-2 text-base">
                        <SettingOutlined className="text-gray-500" />
                        <span>Cài đặt chung</span>
                    </div>
                }>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Âm thanh thông báo</h4>
                                <p className="text-sm text-gray-500">Phát âm thanh khi có thông báo</p>
                            </div>
                            <Form.Item name="sound" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Rung</h4>
                                <p className="text-sm text-gray-500">Rung thiết bị khi có thông báo</p>
                            </div>
                            <Form.Item name="vibration" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Không làm phiền</h4>
                                <p className="text-sm text-gray-500">Tắt thông báo trong giờ nghỉ (22:00 - 7:00)</p>
                            </div>
                            <Form.Item name="doNotDisturb" valuePropName="checked" className="mb-0">
                                <Switch />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                {/* Current Settings Summary */}
                {notifications && (
                    <Card size="small" className="mb-6 bg-gray-50">
                        <h4 className="font-medium text-gray-700 mb-3">Tóm tắt cài đặt hiện tại:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Email:</span>
                                <div className="font-medium">
                                    {Object.values(notifications.email).filter(Boolean).length}/4 loại được bật
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-600">SMS:</span>
                                <div className="font-medium">
                                    {Object.values(notifications.sms).filter(Boolean).length}/3 loại được bật
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-600">Push:</span>
                                <div className="font-medium">
                                    {Object.values(notifications.push).filter(Boolean).length}/4 loại được bật
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-600">Chung:</span>
                                <div className="font-medium">
                                    {Object.values(notifications.general).filter(Boolean).length}/3 tính năng được bật
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Action Buttons */}
                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={saving}
                            size="large"
                            icon={<SettingOutlined />}
                        >
                            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
                        </Button>

                        <Button
                            onClick={() => {
                                form.resetFields();
                                fetchNotificationSettings();
                            }}
                            size="large"
                        >
                            Khôi phục
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
                </div>
                {/* {DEMO_LOCKED && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md shadow">
                            UI demo đang phát triển — Chỉ để trình bày, vui lòng không thao tác
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default NotificationSettings;