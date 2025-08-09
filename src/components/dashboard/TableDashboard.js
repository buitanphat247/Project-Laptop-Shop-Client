import React from 'react';
import { Table, Spin } from 'antd';

/* ==== MAIN COMPONENT ==== */

const TableDashboard = ({
    type = 'product',
    data = [],
    loading = false,
    pagination = false,
    onChange,
    columns, // Nhận columns từ props
}) => {

    const tableData = Array.isArray(data)
        ? data.map((item, idx) => ({
            ...item,
            key: item.id || item.key || `dashboard-${type}-${idx}`,
        }))
        : [];

    return (
        <div className="dashboard-table-container bg-white rounded-lg shadow-sm">
            <Spin spinning={loading} tip="Đang tải dữ liệu dashboard...">
                <Table
                    columns={columns} // Sử dụng columns từ props
                    dataSource={tableData}
                    pagination={pagination}
                    onChange={onChange}
                    size="middle"
                    bordered
                    rowKey="key"
                    className="dashboard-table"
                />
            </Spin>
        </div>
    );
};

export default TableDashboard;