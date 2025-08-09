import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Skeleton, Switch, Typography, Divider, Select } from 'antd';
import axiosClient from '../../config/axios';
import StatsCards from '../../components/permission/StatsCards';

const { Title } = Typography;
const { Option } = Select;

const methodColor = (method) => {
    switch (method) {
        case 'GET': return 'green';
        case 'POST': return 'blue';
        case 'PUT': return 'orange';
        case 'DELETE': return 'red';
        default: return 'default';
    }
};

const groupByMethod = (permissions) => {
    const groups = { GET: [], POST: [], PUT: [], DELETE: [] };
    permissions.forEach(perm => {
        if (groups[perm.method]) {
            groups[perm.method].push(perm);
        }
    });
    return groups;
};

const RolePermission = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [switchStates, setSwitchStates] = useState({});
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [rolesRes, permsRes, rolePermsRes] = await Promise.all([
                    axiosClient.get('/roles'),
                    axiosClient.get('/permissions', { params: { limit: 10000 } }),
                    axiosClient.get('/role-permissions')
                ]);
                setRoles(rolesRes.data.data || []);
                setPermissions(permsRes.data.data || []);
                setRolePermissions(rolePermsRes.data.data || []);
                if (rolesRes.data.data && rolesRes.data.data.length > 0) {
                    setSelectedRole(rolesRes.data.data[0].id);
                }
                const initialSwitch = {};
                (rolesRes.data.data || []).forEach(role => {
                    (permsRes.data.data || []).forEach(perm => {
                        const hasPerm = (rolePermsRes.data.data || []).some(
                            rp => rp.roleId === role.id && rp.permissionId === perm.id
                        );
                        initialSwitch[`${role.id}_${perm.id}`] = hasPerm;
                    });
                });
                setSwitchStates(initialSwitch);
            } catch {
                setRoles([]);
                setPermissions([]);
                setRolePermissions([]);
            } finally {
                setTimeout(() => setLoading(false), 500); // Hiệu ứng loading 500ms
            }
        };
        fetchData();
    }, []);

    const handleSwitchChange = async (roleId, permId, checked) => {
        setSwitchStates(prev => ({
            ...prev,
            [`${roleId}_${permId}`]: checked,
        }));
        try {
            // Kiểm tra đã có record chưa
            const res = await axiosClient.get(`/check-role-permissions/${roleId}/${permId}`);
            const exists = res.data.data;
            if (!exists) {
                // Nếu chưa có, tạo mới
                await axiosClient.post('/create-role-permissions', {
                    roleId,
                    permissionId: permId,
                    active: checked
                });
            } else {
                // Nếu đã có, update
                await axiosClient.put('/update-role-permissions', {
                    roleId,
                    permissionId: permId,
                    active: checked
                });
            }
        } catch (error) {
            // Xử lý lỗi, rollback lại trạng thái switch nếu cần
            setSwitchStates(prev => ({
                ...prev,
                [`${roleId}_${permId}`]: !checked,
            }));
        }
    };

    const skeletonCount = 15;
    const currentRole = roles.find(r => r.id === selectedRole);
    const grouped = groupByMethod(permissions);
    const statsData = {
        totalRoutes: 30,
        activeRoutes: 45,
        totalPermissions: 25,
        adminUsers: 3,
        regularUsers: 105
    }
    return (
        <div className='space-y-5'>
            {/* Statistics Cards */}
            <StatsCards statsData={statsData} />
            <div className="flex items-center justify-between ">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Phần quyền</h1>
                    <p className="text-gray-600">Quản lý các phân quyền trong hệ thống</p>
                </div>
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ marginRight: 8, whiteSpace: 'nowrap' }}>Chọn vai trò:</span>
                    <Select
                        style={{ minWidth: 180 }}
                        value={selectedRole}
                        onChange={setSelectedRole}
                        loading={loading}
                    >
                        {roles.map(role => (
                            <Option key={role.id} value={role.id} >
                                <span className='capitalize'>
                                    {role.name}
                                </span>
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
            {loading || !currentRole ? (
                <div>
                    {/* <Skeleton.Input style={{ width: 200, marginBottom: 16 }} active /> */}
                    {['GET', 'POST', 'PUT', 'DELETE'].map(method => (
                        <div key={method} style={{ marginBottom: 16 }}>
                            <Tag color={methodColor(method)} style={{ fontSize: 14, padding: '2px 16px', marginBottom: 8 }}>{method}</Tag>
                            <Row gutter={[16, 16]}>
                                {Array.from({ length: skeletonCount }).map((__, i) => (
                                    <Col xs={24} sm={12} md={8} key={i}>
                                        <Card style={{ minHeight: 120, borderRadius: 12 }}>
                                            <Skeleton active paragraph={{ rows: 2 }} title />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {['GET', 'POST', 'PUT', 'DELETE'].map(method => (
                        <div key={method} style={{ marginBottom: 16 }}>
                            <Tag color={methodColor(method)} style={{ fontSize: 14, padding: '2px 16px', marginBottom: 8 }}>{method}</Tag>
                            <Row gutter={[16, 16]}>
                                {grouped[method].length === 0 ? (
                                    <Col>
                                        <span className="text-gray-400">Không có route nào</span>
                                    </Col>
                                ) : (
                                    grouped[method].map(perm => (
                                        <Col xs={24} sm={12} md={8} key={perm.id}>
                                            <Card
                                                size="small"
                                                hoverable
                                                style={{
                                                    minHeight: 120,
                                                    borderRadius: 12,
                                                    fontSize: 14,
                                                    boxShadow: '0 2px 8px #f0f1f2',
                                                    cursor: 'pointer'
                                                }}
                                                bodyStyle={{ padding: 16 }}
                                                title={
                                                    <div className="flex items-center justify-between" style={{ fontSize: 14 }}>
                                                        <span className="truncate">{perm.name}</span>
                                                        <Tag color={methodColor(perm.method)} style={{ fontWeight: 600, minWidth: 48, textAlign: 'center', fontSize: 13 }}>
                                                            {perm.method}
                                                        </Tag>
                                                    </div>
                                                }
                                                onClick={() => {
                                                    // Đảo trạng thái switch khi click card
                                                    const key = `${currentRole.id}_${perm.id}`;
                                                    handleSwitchChange(currentRole.id, perm.id, !switchStates[key]);
                                                }}
                                            >
                                                <div className="mb-2">
                                                    <span className="font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">{perm.route}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="text-gray-500 text-xs">Slug: </span>
                                                    <span className="font-mono text-xs">{perm.slug}</span>
                                                </div>
                                                <div className="flex items-center justify-end gap-2 mt-2" onClick={e => e.stopPropagation()}>
                                                    <Switch
                                                        checked={switchStates[`${currentRole.id}_${perm.id}`] || false}
                                                        size="small"
                                                        onChange={checked => handleSwitchChange(currentRole.id, perm.id, checked)}
                                                    />
                                                    <span className="text-xs">{switchStates[`${currentRole.id}_${perm.id}`] ? 'Bật' : 'Tắt'}</span>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RolePermission;