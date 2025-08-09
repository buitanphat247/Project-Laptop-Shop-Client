import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Select, Button, message, Skeleton, Alert } from 'antd';
import { GlobalOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axiosClient from '../../config/axios';
// import axiosClient from '../configs/axios';

/**
 * 🚧 LANGUAGE & REGION PAGE - UNDER DEVELOPMENT 🚧
 * 
 * ⚠️  WARNING: This is a demo UI for development purposes only!
 * ⚠️  DO NOT modify this file unless you're working on language/region features
 * ⚠️  This page contains demo data and mock functionality
 * 
 * Features:
 * - Language selection with flags
 * - Region selection with timezone/currency auto-detect
 * - User preferences management
 * - Mock API integration with fallback data
 * - Loading states and form validation
 * 
 * @author: Development Team
 * @status: In Development
 * @version: 1.0.0
 */

const LanguageRegion = ({ userInfo, onUpdate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [regions, setRegions] = useState([]);
    const [userPreferences, setUserPreferences] = useState(null);
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const DEMO_LOCKED = true; // UI demo lock: show-only, disable all interactions

    // Fetch available languages from API
    const fetchLanguages = useCallback(async () => {
        try {
            console.log('🚀 Fetching available languages...');

            const response = await axiosClient.get('/settings/languages');

            console.log('✅ Languages fetched successfully:', response.data);

            setLanguages(response.data.data || response.data);
        } catch (error) {
            console.error('❌ Error fetching languages:', error);

            // Mock data fallback
            const mockLanguages = [
                { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'fr', name: 'Français', flag: '🇫🇷' },
                { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
                { code: 'ja', name: '日本語', flag: '🇯🇵' },
                { code: 'ko', name: '한국어', flag: '🇰🇷' },
                { code: 'zh', name: '中文', flag: '🇨🇳' },
            ];

            setLanguages(mockLanguages);
            message.warning('Không thể tải danh sách ngôn ngữ từ server, sử dụng dữ liệu mặc định');
        }
    }, []); // No dependencies

    // Fetch available regions from API
    const fetchRegions = useCallback(async () => {
        try {
            console.log('🚀 Fetching available regions...');

            const response = await axiosClient.get('/settings/regions');

            console.log('✅ Regions fetched successfully:', response.data);

            setRegions(response.data.data || response.data);
        } catch (error) {
            console.error('❌ Error fetching regions:', error);

            // Mock data fallback
            const mockRegions = [
                { code: 'vn', name: 'Việt Nam', timezone: 'Asia/Ho_Chi_Minh', currency: 'VND', flag: '🇻🇳' },
                { code: 'us', name: 'United States', timezone: 'America/New_York', currency: 'USD', flag: '🇺🇸' },
                { code: 'fr', name: 'France', timezone: 'Europe/Paris', currency: 'EUR', flag: '🇫🇷' },
                { code: 'de', name: 'Germany', timezone: 'Europe/Berlin', currency: 'EUR', flag: '🇩🇪' },
                { code: 'jp', name: 'Japan', timezone: 'Asia/Tokyo', currency: 'JPY', flag: '🇯🇵' },
                { code: 'kr', name: 'South Korea', timezone: 'Asia/Seoul', currency: 'KRW', flag: '🇰🇷' },
                { code: 'cn', name: 'China', timezone: 'Asia/Shanghai', currency: 'CNY', flag: '🇨🇳' },
            ];

            setRegions(mockRegions);
            message.warning('Không thể tải danh sách khu vực từ server, sử dụng dữ liệu mặc định');
        }
    }, []); // No dependencies

    // Fetch user preferences from API
    const fetchUserPreferences = useCallback(async () => {
        if (!userInfo?.id) return;

        try {
            console.log('🚀 Fetching user preferences for ID:', userInfo.id);

            const response = await axiosClient.get(`/users/${userInfo.id}/preferences`);

            console.log('✅ User preferences fetched successfully:', response.data);

            const preferences = response.data.data || response.data;
            setUserPreferences(preferences);

            // Set form values
            form.setFieldsValue({
                language: preferences.language || 'vi',
                region: preferences.region || 'vn',
                timezone: preferences.timezone || 'Asia/Ho_Chi_Minh',
                currency: preferences.currency || 'VND',
            });
        } catch (error) {
            console.error('❌ Error fetching user preferences:', error);

            // Mock data fallback
            const mockPreferences = {
                language: 'vi',
                region: 'vn',
                timezone: 'Asia/Ho_Chi_Minh',
                currency: 'VND',
            };

            setUserPreferences(mockPreferences);
            form.setFieldsValue(mockPreferences);

            message.warning('Không thể tải cài đặt người dùng từ server, sử dụng cài đặt mặc định');
        }
    }, [userInfo?.id, form]); // Dependencies: userInfo.id và form

    // Initialize data
    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            setSkeletonLoading(true);
            await Promise.all([
                fetchLanguages(),
                fetchRegions(),
                fetchUserPreferences(),
            ]);
            setLoading(false);
            setTimeout(() => setSkeletonLoading(false), 250);
        };

        initializeData();
    }, [fetchLanguages, fetchRegions, fetchUserPreferences]);

    // Handle form submission
    const handleSubmit = async (values) => {
        if (!userInfo?.id) {
            message.error('Không tìm thấy thông tin người dùng');
            return;
        }

        setSaving(true);
        try {
            console.log('🚀 Saving user preferences:', values);

            const response = await axiosClient.put(`/users/${userInfo.id}/preferences`, values);

            console.log('✅ User preferences saved successfully:', response.data);

            const updatedPreferences = response.data.data || response.data;
            setUserPreferences(updatedPreferences);

            // Update parent component if needed
            if (onUpdate) {
                onUpdate({ preferences: updatedPreferences });
            }

            message.success('Cài đặt ngôn ngữ và khu vực đã được lưu thành công!');
        } catch (error) {
            console.error('❌ Error saving user preferences:', error);
            message.error('Không thể lưu cài đặt. Vui lòng thử lại sau.');
        } finally {
            setSaving(false);
        }
    };

    // Get region info by code
    const getRegionInfo = useCallback((regionCode) => {
        return regions.find(region => region.code === regionCode);
    }, [regions]);

    // Rest of the component remains the same...
    if (skeletonLoading) {
        return (
            <Card title="Ngôn ngữ & Khu vực" className="shadow-sm">
                <div className="flex flex-col gap-6">
                    <Skeleton.Input style={{ width: 200, marginBottom: 24 }} active />
                    <Skeleton active paragraph={{ rows: 4 }} />
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
                    message="Trang Ngôn ngữ & Khu vực đang phát triển"
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
                                <GlobalOutlined />
                                <span>Ngôn ngữ & Khu vực</span>
                            </div>
                        }
                        className="shadow-sm"
                    >
                        {/* Form content remains the same... */}
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                language: userPreferences?.language || 'vi',
                                region: userPreferences?.region || 'vn',
                            }}
                        >
                            {/* Form items remain the same... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item
                                    label={
                                        <span className="font-medium">
                                            <GlobalOutlined className="mr-2" />
                                            Ngôn ngữ hiển thị
                                        </span>
                                    }
                                    name="language"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ' }]}
                                >
                                    <Select
                                        placeholder="Chọn ngôn ngữ"
                                        size="large"
                                        showSearch
                                        optionFilterProp="children"
                                    >
                                        {languages.map(lang => (
                                            <Select.Option key={lang.code} value={lang.code}>
                                                <div className="flex items-center gap-2">
                                                    <span>{lang.flag}</span>
                                                    <span>{lang.name}</span>
                                                </div>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <span className="font-medium">
                                            <EnvironmentOutlined className="mr-2" />
                                            Khu vực
                                        </span>
                                    }
                                    name="region"
                                    rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
                                >
                                    <Select
                                        placeholder="Chọn khu vực"
                                        size="large"
                                        showSearch
                                        optionFilterProp="children"
                                        onChange={(value) => {
                                            const regionInfo = getRegionInfo(value);
                                            if (regionInfo) {
                                                form.setFieldsValue({
                                                    timezone: regionInfo.timezone,
                                                    currency: regionInfo.currency,
                                                });
                                            }
                                        }}
                                    >
                                        {regions.map(region => (
                                            <Select.Option key={region.code} value={region.code}>
                                                <div className="flex items-center gap-2">
                                                    <span>{region.flag}</span>
                                                    <span>{region.name}</span>
                                                </div>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            {/* Additional sections remain the same... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <Form.Item
                                    label={<span className="font-medium">Múi giờ</span>}
                                    name="timezone"
                                >
                                    <Select size="large" disabled>
                                        <Select.Option value={form.getFieldValue('timezone')}>
                                            {form.getFieldValue('timezone') || 'Auto-detect'}
                                        </Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Đơn vị tiền tệ</span>}
                                    name="currency"
                                >
                                    <Select size="large" disabled>
                                        <Select.Option value={form.getFieldValue('currency')}>
                                            {form.getFieldValue('currency') || 'Auto-detect'}
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            {/* Current settings and buttons remain the same... */}
                            {userPreferences && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-700 mb-3">Cài đặt hiện tại:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Ngôn ngữ:</span>
                                            <div className="font-medium">
                                                {languages.find(l => l.code === userPreferences.language)?.name || userPreferences.language}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Khu vực:</span>
                                            <div className="font-medium">
                                                {regions.find(r => r.code === userPreferences.region)?.name || userPreferences.region}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Múi giờ:</span>
                                            <div className="font-medium">{userPreferences.timezone}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Tiền tệ:</span>
                                            <div className="font-medium">{userPreferences.currency}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Form.Item className="mt-6">
                                <div className="flex gap-3">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={saving}
                                        size="large"
                                    >
                                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            form.resetFields();
                                            form.setFieldsValue({
                                                language: userPreferences?.language || 'vi',
                                                region: userPreferences?.region || 'vn',
                                            });
                                        }}
                                        size="large"
                                    >
                                        Khôi phục
                                    </Button>
                                </div>
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

export default LanguageRegion;