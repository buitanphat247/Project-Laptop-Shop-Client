import React, { useState, useEffect } from 'react';
import { Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import {
    SecurityScanOutlined, PlusOutlined, CalendarOutlined,
    EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined
} from '@ant-design/icons';
import TableDashboard from '../components/dashboard/TableDashboard';
import slugify from 'slugify';
import axiosClient from '../config/axios';

const { Option } = Select;

const RoutesSection = ({ loading = false }) => {
   

    return (
        <div>
        
        </div>
    );
};

export default RoutesSection;