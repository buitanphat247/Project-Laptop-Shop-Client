import React from 'react';
import { Card, Tag, Switch } from 'antd';

const methodColor = (method) => {
    switch (method) {
        case 'GET': return 'green';
        case 'POST': return 'blue';
        case 'PUT': return 'orange';
        case 'DELETE': return 'red';
        default: return 'default';
    }
};

const CardPermission = ({ perm, checked, onSwitchChange }) => {
    return (
        <Card
            size="default"
            hoverable
            style={{
                minHeight: 120,
                borderRadius: 12,
                fontSize: 14,
                boxShadow: '0 2px 8px #f0f1f2',
                cursor: 'pointer',
                border: '1.5px solid #e5e7eb'
            }}
            bodyStyle={{ padding: 16 }}
            title={
                <div className="flex items-center justify-between" style={{ fontSize: 14 }}>
                    <span className="truncate" style={{ maxWidth: 150 }}>{perm.name}</span>
                    <Tag color={methodColor(perm.method)} style={{ fontWeight: 600, minWidth: 48, textAlign: 'center', fontSize: 13 }}>
                        {perm.method}
                    </Tag>
                </div>
            }
        >
            <div className="mb-2">
                <span className="font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">{perm.route}</span>
            </div>
            <div className="mb-2">
                <span className="text-gray-500 text-xs">Slug: </span>
                <span className="font-mono text-xs">{perm.slug}</span>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
                <Switch
                    checked={checked}
                    size="small"
                    onChange={onSwitchChange}
                />
                <span
                    className="text-xs font-semibold"
                    style={{ color: checked ? '#22c55e' : '#6b7280' }}
                >
                    {checked ? 'Bật' : 'Tắt'}
                </span>
            </div>
        </Card>
    );
};

export default CardPermission;