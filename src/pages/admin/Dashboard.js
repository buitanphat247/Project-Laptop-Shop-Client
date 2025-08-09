import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  DollarSign, 
  Clock, 
  Users, 
  Package, 
  ShoppingCart, 
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  RefreshCw
} from "lucide-react";
import { Card, Progress, Avatar, Badge, Button, Divider, Row, Col, Statistic, Spin } from 'antd';

import {
  TopProductsTable,
  RevenueStatsTable,
  CustomerStatsTable,
  OrderStatusTable,
  PerformanceMetricsTable
} from '../../components/StatsTable';
import { BarChart, LineChart, DonutChart, AreaChart } from '../../components/Charts';
import AnimatedCounter, { AnimatedPercentage, AnimatedCurrency } from '../../components/AnimatedCounter';

// Mock data cho recent activities
const recentActivities = [
  {
    id: 1,
    type: 'order',
    title: 'Đơn hàng mới #ORD-2024-001',
    description: 'Khách hàng Nguyễn Văn A đã đặt hàng',
    time: '2 phút trước',
    status: 'pending',
    icon: <ShoppingCart className="text-blue-500" />
  },
  {
    id: 2,
    type: 'user',
    title: 'Người dùng mới đăng ký',
    description: 'Email: user@example.com',
    time: '15 phút trước',
    status: 'success',
    icon: <Users className="text-green-500" />
  },
  {
    id: 3,
    type: 'product',
    title: 'Sản phẩm được cập nhật',
    description: 'Laptop Dell XPS 13 đã được cập nhật giá',
    time: '1 giờ trước',
    status: 'info',
    icon: <Package className="text-orange-500" />
  },
  {
    id: 4,
    type: 'news',
    title: 'Bài viết mới được đăng',
    description: 'Tin tức công nghệ mới nhất',
    time: '2 giờ trước',
    status: 'success',
    icon: <FileText className="text-purple-500" />
  },
  {
    id: 5,
    type: 'order',
    title: 'Đơn hàng đã hoàn thành',
    description: 'Đơn hàng #ORD-2023-999 đã giao thành công',
    time: '3 giờ trước',
    status: 'success',
    icon: <CheckCircle className="text-green-500" />
  },
  {
    id: 6,
    type: 'product',
    title: 'Sản phẩm hết hàng',
    description: 'Laptop MacBook Pro M2 đã hết hàng',
    time: '4 giờ trước',
    status: 'error',
    icon: <AlertCircle className="text-red-500" />
  }
];

// Mock data cho biểu đồ theo từng period
const periodChartData = {
  day: {
    sales: [
      { month: 'T1', value: 1250000, target: 1500000 },
      { month: 'T2', value: 1890000, target: 1800000 },
      { month: 'T3', value: 1520000, target: 1600000 },
      { month: 'T4', value: 2240000, target: 2000000 },
      { month: 'T5', value: 2870000, target: 2500000 },
      { month: 'T6', value: 2510000, target: 2400000 },
      { month: 'T7', value: 3240000, target: 3000000 },
      { month: 'T8', value: 3580000, target: 3500000 },
      { month: 'T9', value: 3010000, target: 3200000 },
      { month: 'T10', value: 3840000, target: 3800000 },
      { month: 'T11', value: 4250000, target: 4000000 },
      { month: 'T12', value: 4520000, target: 4500000 }
    ],
    categories: [
      { name: 'Laptop Gaming', value: 30, color: '#3B82F6', sales: 45, revenue: 4500000 },
      { name: 'Laptop Văn phòng', value: 35, color: '#10B981', sales: 32, revenue: 3200000 },
      { name: 'Laptop Đồ họa', value: 20, color: '#F59E0B', sales: 28, revenue: 2800000 },
      { name: 'Phụ kiện', value: 10, color: '#8B5CF6', sales: 25, revenue: 1500000 },
      { name: 'Màn hình', value: 5, color: '#EF4444', sales: 22, revenue: 800000 }
    ],
    dailySales: [
      { day: 'T2', value: 125000 },
      { day: 'T3', value: 189000 },
      { day: 'T4', value: 152000 },
      { day: 'T5', value: 224000 },
      { day: 'T6', value: 287000 },
      { day: 'T7', value: 251000 },
      { day: 'CN', value: 324000 }
    ],
    multiSeriesData: [
      { month: 'T1', hotLead: 12, warmLead: 8, coldLead: 5 },
      { month: 'T2', hotLead: 18, warmLead: 12, coldLead: 7 },
      { month: 'T3', hotLead: 15, warmLead: 9, coldLead: 6 },
      { month: 'T4', hotLead: 22, warmLead: 15, coldLead: 9 },
      { month: 'T5', hotLead: 28, warmLead: 19, coldLead: 11 },
      { month: 'T6', hotLead: 25, warmLead: 17, coldLead: 10 },
      { month: 'T7', hotLead: 32, warmLead: 22, coldLead: 13 },
      { month: 'T8', hotLead: 35, warmLead: 25, coldLead: 15 },
      { month: 'T9', hotLead: 30, warmLead: 20, coldLead: 12 },
      { month: 'T10', hotLead: 38, warmLead: 26, coldLead: 16 },
      { month: 'T11', hotLead: 42, warmLead: 29, coldLead: 17 },
      { month: 'T12', hotLead: 45, warmLead: 31, coldLead: 19 }
    ],
    donutData: [
      { name: 'Doanh thu chính', value: 40, color: '#F59E0B', amount: 4500000 },
      { name: 'Mở rộng', value: 30, color: '#8B5CF6', amount: 2500000 },
      { name: 'Đặt hàng', value: 20, color: '#E5E7EB', amount: 2000000 },
      { name: 'Khác', value: 10, color: '#D1D5DB', amount: 1000000 }
    ]
  },
  week: {
    sales: [
      { month: 'T1', value: 12500000, target: 15000000 },
      { month: 'T2', value: 18900000, target: 18000000 },
      { month: 'T3', value: 15200000, target: 16000000 },
      { month: 'T4', value: 22400000, target: 20000000 },
      { month: 'T5', value: 28700000, target: 25000000 },
      { month: 'T6', value: 25100000, target: 24000000 },
      { month: 'T7', value: 32400000, target: 30000000 },
      { month: 'T8', value: 35800000, target: 35000000 },
      { month: 'T9', value: 30100000, target: 32000000 },
      { month: 'T10', value: 38400000, target: 38000000 },
      { month: 'T11', value: 42500000, target: 40000000 },
      { month: 'T12', value: 45200000, target: 45000000 }
    ],
    categories: [
      { name: 'Laptop Gaming', value: 35, color: '#3B82F6', sales: 1250, revenue: 45000000 },
      { name: 'Laptop Văn phòng', value: 25, color: '#10B981', sales: 890, revenue: 32000000 },
      { name: 'Laptop Đồ họa', value: 20, color: '#F59E0B', sales: 756, revenue: 28000000 },
      { name: 'Phụ kiện', value: 15, color: '#8B5CF6', sales: 634, revenue: 15000000 },
      { name: 'Màn hình', value: 5, color: '#EF4444', sales: 234, revenue: 8000000 }
    ],
    dailySales: [
      { day: 'T2', value: 1250000 },
      { day: 'T3', value: 1890000 },
      { day: 'T4', value: 1520000 },
      { day: 'T5', value: 2240000 },
      { day: 'T6', value: 2870000 },
      { day: 'T7', value: 2510000 },
      { day: 'CN', value: 3240000 }
    ],
    multiSeriesData: [
      { month: 'T1', hotLead: 125, warmLead: 89, coldLead: 56 },
      { month: 'T2', hotLead: 189, warmLead: 124, coldLead: 78 },
      { month: 'T3', hotLead: 152, warmLead: 98, coldLead: 62 },
      { month: 'T4', hotLead: 224, warmLead: 156, coldLead: 92 },
      { month: 'T5', hotLead: 287, warmLead: 198, coldLead: 118 },
      { month: 'T6', hotLead: 251, warmLead: 172, coldLead: 104 },
      { month: 'T7', hotLead: 324, warmLead: 228, coldLead: 136 },
      { month: 'T8', hotLead: 358, warmLead: 256, coldLead: 152 },
      { month: 'T9', hotLead: 301, warmLead: 208, coldLead: 124 },
      { month: 'T10', hotLead: 384, warmLead: 268, coldLead: 160 },
      { month: 'T11', hotLead: 425, warmLead: 298, coldLead: 178 },
      { month: 'T12', hotLead: 452, warmLead: 318, coldLead: 192 }
    ],
    donutData: [
      { name: 'Doanh thu chính', value: 45, color: '#F59E0B', amount: 45000000 },
      { name: 'Mở rộng', value: 25, color: '#8B5CF6', amount: 25000000 },
      { name: 'Đặt hàng', value: 20, color: '#E5E7EB', amount: 20000000 },
      { name: 'Khác', value: 10, color: '#D1D5DB', amount: 10000000 }
    ]
  },
  month: {
    sales: [
      { month: 'T1', value: 25000000, target: 30000000 },
      { month: 'T2', value: 35000000, target: 35000000 },
      { month: 'T3', value: 28000000, target: 32000000 },
      { month: 'T4', value: 42000000, target: 40000000 },
      { month: 'T5', value: 55000000, target: 50000000 },
      { month: 'T6', value: 48000000, target: 48000000 },
      { month: 'T7', value: 62000000, target: 60000000 },
      { month: 'T8', value: 68000000, target: 70000000 },
      { month: 'T9', value: 58000000, target: 64000000 },
      { month: 'T10', value: 75000000, target: 76000000 },
      { month: 'T11', value: 82000000, target: 80000000 },
      { month: 'T12', value: 88000000, target: 90000000 }
    ],
    categories: [
      { name: 'Laptop Gaming', value: 40, color: '#3B82F6', sales: 4520, revenue: 180000000 },
      { name: 'Laptop Văn phòng', value: 30, color: '#10B981', sales: 3890, revenue: 128000000 },
      { name: 'Laptop Đồ họa', value: 20, color: '#F59E0B', sales: 3256, revenue: 112000000 },
      { name: 'Phụ kiện', value: 8, color: '#8B5CF6', sales: 2834, revenue: 60000000 },
      { name: 'Màn hình', value: 2, color: '#EF4444', sales: 2421, revenue: 32000000 }
    ],
    dailySales: [
      { day: 'T2', value: 2500000 },
      { day: 'T3', value: 3500000 },
      { day: 'T4', value: 2800000 },
      { day: 'T5', value: 4200000 },
      { day: 'T6', value: 5500000 },
      { day: 'T7', value: 4800000 },
      { day: 'CN', value: 6200000 }
    ],
    multiSeriesData: [
      { month: 'T1', hotLead: 250, warmLead: 180, coldLead: 120 },
      { month: 'T2', hotLead: 350, warmLead: 250, coldLead: 150 },
      { month: 'T3', hotLead: 280, warmLead: 200, coldLead: 130 },
      { month: 'T4', hotLead: 420, warmLead: 300, coldLead: 180 },
      { month: 'T5', hotLead: 550, warmLead: 400, coldLead: 250 },
      { month: 'T6', hotLead: 480, warmLead: 350, coldLead: 220 },
      { month: 'T7', hotLead: 620, warmLead: 450, coldLead: 280 },
      { month: 'T8', hotLead: 680, warmLead: 500, coldLead: 320 },
      { month: 'T9', hotLead: 580, warmLead: 420, coldLead: 260 },
      { month: 'T10', hotLead: 750, warmLead: 550, coldLead: 350 },
      { month: 'T11', hotLead: 820, warmLead: 600, coldLead: 380 },
      { month: 'T12', hotLead: 880, warmLead: 650, coldLead: 420 }
    ],
    donutData: [
      { name: 'Doanh thu chính', value: 50, color: '#F59E0B', amount: 180000000 },
      { name: 'Mở rộng', value: 30, color: '#8B5CF6', amount: 128000000 },
      { name: 'Đặt hàng', value: 15, color: '#E5E7EB', amount: 112000000 },
      { name: 'Khác', value: 5, color: '#D1D5DB', amount: 60000000 }
    ]
  },
  year: {
    sales: [
      { month: 'T1', value: 125000000, target: 150000000 },
      { month: 'T2', value: 189000000, target: 180000000 },
      { month: 'T3', value: 152000000, target: 160000000 },
      { month: 'T4', value: 224000000, target: 200000000 },
      { month: 'T5', value: 287000000, target: 250000000 },
      { month: 'T6', value: 251000000, target: 240000000 },
      { month: 'T7', value: 324000000, target: 300000000 },
      { month: 'T8', value: 358000000, target: 350000000 },
      { month: 'T9', value: 301000000, target: 320000000 },
      { month: 'T10', value: 384000000, target: 380000000 },
      { month: 'T11', value: 425000000, target: 400000000 },
      { month: 'T12', value: 452000000, target: 450000000 }
    ],
    categories: [
      { name: 'Laptop Gaming', value: 45, color: '#3B82F6', sales: 45200, revenue: 1800000000 },
      { name: 'Laptop Văn phòng', value: 25, color: '#10B981', sales: 38900, revenue: 1280000000 },
      { name: 'Laptop Đồ họa', value: 20, color: '#F59E0B', sales: 32560, revenue: 1120000000 },
      { name: 'Phụ kiện', value: 8, color: '#8B5CF6', sales: 28340, revenue: 600000000 },
      { name: 'Màn hình', value: 2, color: '#EF4444', sales: 24210, revenue: 320000000 }
    ],
    dailySales: [
      { day: 'T2', value: 12500000 },
      { day: 'T3', value: 18900000 },
      { day: 'T4', value: 15200000 },
      { day: 'T5', value: 22400000 },
      { day: 'T6', value: 28700000 },
      { day: 'T7', value: 25100000 },
      { day: 'CN', value: 32400000 }
    ],
    multiSeriesData: [
      { month: 'T1', hotLead: 1250, warmLead: 890, coldLead: 560 },
      { month: 'T2', hotLead: 1890, warmLead: 1240, coldLead: 780 },
      { month: 'T3', hotLead: 1520, warmLead: 980, coldLead: 620 },
      { month: 'T4', hotLead: 2240, warmLead: 1560, coldLead: 920 },
      { month: 'T5', hotLead: 2870, warmLead: 1980, coldLead: 1180 },
      { month: 'T6', hotLead: 2510, warmLead: 1720, coldLead: 1040 },
      { month: 'T7', hotLead: 3240, warmLead: 2280, coldLead: 1360 },
      { month: 'T8', hotLead: 3580, warmLead: 2560, coldLead: 1520 },
      { month: 'T9', hotLead: 3010, warmLead: 2080, coldLead: 1240 },
      { month: 'T10', hotLead: 3840, warmLead: 2680, coldLead: 1600 },
      { month: 'T11', hotLead: 4250, warmLead: 2980, coldLead: 1780 },
      { month: 'T12', hotLead: 4520, warmLead: 3180, coldLead: 1920 }
    ],
    donutData: [
      { name: 'Doanh thu chính', value: 55, color: '#F59E0B', amount: 1800000000 },
      { name: 'Mở rộng', value: 25, color: '#8B5CF6', amount: 1280000000 },
      { name: 'Đặt hàng', value: 15, color: '#E5E7EB', amount: 1120000000 },
      { name: 'Khác', value: 5, color: '#D1D5DB', amount: 600000000 }
    ]
  }
};

// Mock data cho biểu đồ (giữ lại để tương thích)
const chartData = periodChartData.week;

// Mock data cho các bảng thống kê theo từng period
const periodData = {
  day: {
    topProducts: [
      { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop Văn phòng', sales: 45, image: null },
      { id: 2, name: 'MacBook Pro M2', category: 'Laptop Đồ họa', sales: 32, image: null },
      { id: 3, name: 'Laptop Gaming ASUS ROG', category: 'Laptop Gaming', sales: 28, image: null },
      { id: 4, name: 'Laptop HP Pavilion', category: 'Laptop Văn phòng', sales: 25, image: null },
      { id: 5, name: 'Laptop Lenovo ThinkPad', category: 'Laptop Văn phòng', sales: 22, image: null }
    ],
    revenue: {
      today: 125430,
      week: 856720,
      month: 3245670,
      year: 12543000
    },
    customers: {
      total: 15420,
      new: 12,
      growth: 8.5,
      vip: 1250,
      rating: 4.8
    },
    orders: {
      pending: 8,
      processing: 5,
      completed: 23,
      cancelled: 2
    },
    performance: {
      conversion: 72.5,
      pageSpeed: 980,
      bounceRate: 28.3,
      avgTime: 3.8
    }
  },
  week: {
    topProducts: [
      { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop Văn phòng', sales: 1250, image: null },
      { id: 2, name: 'MacBook Pro M2', category: 'Laptop Đồ họa', sales: 980, image: null },
      { id: 3, name: 'Laptop Gaming ASUS ROG', category: 'Laptop Gaming', sales: 756, image: null },
      { id: 4, name: 'Laptop HP Pavilion', category: 'Laptop Văn phòng', sales: 634, image: null },
      { id: 5, name: 'Laptop Lenovo ThinkPad', category: 'Laptop Văn phòng', sales: 521, image: null }
    ],
    revenue: {
      today: 125430,
      week: 856720,
      month: 3245670,
      year: 12543000
    },
    customers: {
      total: 15420,
      new: 234,
      growth: 15.8,
      vip: 1250,
      rating: 4.8
    },
    orders: {
      pending: 45,
      processing: 23,
      completed: 156,
      cancelled: 8
    },
    performance: {
      conversion: 68.2,
      pageSpeed: 1250,
      bounceRate: 32.5,
      avgTime: 4.2
    }
  },
  month: {
    topProducts: [
      { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop Văn phòng', sales: 4520, image: null },
      { id: 2, name: 'MacBook Pro M2', category: 'Laptop Đồ họa', sales: 3890, image: null },
      { id: 3, name: 'Laptop Gaming ASUS ROG', category: 'Laptop Gaming', sales: 3256, image: null },
      { id: 4, name: 'Laptop HP Pavilion', category: 'Laptop Văn phòng', sales: 2834, image: null },
      { id: 5, name: 'Laptop Lenovo ThinkPad', category: 'Laptop Văn phòng', sales: 2421, image: null }
    ],
    revenue: {
      today: 125430,
      week: 856720,
      month: 3245670,
      year: 12543000
    },
    customers: {
      total: 15420,
      new: 892,
      growth: 22.3,
      vip: 1250,
      rating: 4.8
    },
    orders: {
      pending: 156,
      processing: 89,
      completed: 1245,
      cancelled: 34
    },
    performance: {
      conversion: 75.8,
      pageSpeed: 890,
      bounceRate: 25.7,
      avgTime: 5.1
    }
  },
  year: {
    topProducts: [
      { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop Văn phòng', sales: 45200, image: null },
      { id: 2, name: 'MacBook Pro M2', category: 'Laptop Đồ họa', sales: 38900, image: null },
      { id: 3, name: 'Laptop Gaming ASUS ROG', category: 'Laptop Gaming', sales: 32560, image: null },
      { id: 4, name: 'Laptop HP Pavilion', category: 'Laptop Văn phòng', sales: 28340, image: null },
      { id: 5, name: 'Laptop Lenovo ThinkPad', category: 'Laptop Văn phòng', sales: 24210, image: null }
    ],
    revenue: {
      today: 125430,
      week: 856720,
      month: 3245670,
      year: 12543000
    },
    customers: {
      total: 15420,
      new: 8920,
      growth: 35.7,
      vip: 1250,
      rating: 4.8
    },
    orders: {
      pending: 1560,
      processing: 890,
      completed: 12450,
      cancelled: 340
    },
    performance: {
      conversion: 82.3,
      pageSpeed: 650,
      bounceRate: 18.9,
      avgTime: 6.8
    }
  }
};

// Mock data cho các bảng thống kê (giữ lại để tương thích)
const statsData = periodData.week;

// Enhanced Dashboard Card Component
const EnhancedDashboardCard = ({ title, icon, value, change, color, gradient }) => {
  const isPositive = change >= 0;
  
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dashboard-card`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color} bg-white/20 backdrop-blur-sm`}>
            {icon}
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        </div>
        
        <h3 className="text-white/80 text-sm font-medium mb-2">{title}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
    </div>
  );
};



// Activity Item Component
const ActivityItem = ({ activity }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors activity-item">
      <div className="flex-shrink-0">
        <Avatar size="small" className="bg-gray-100">
          {activity.icon}
        </Avatar>
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
        <p className="text-sm text-gray-500 truncate">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
      </div>
      <div className={`flex-shrink-0 ${getStatusColor(activity.status)}`}>
        {activity.status === 'success' && <CheckCircle size={16} />}
        {activity.status === 'pending' && <Clock size={16} />}
        {activity.status === 'error' && <AlertCircle size={16} />}
        {activity.status === 'info' && <Activity size={16} />}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [refreshing, setRefreshing] = useState(false);
  const [currentData, setCurrentData] = useState(periodData.week);
  const [currentChartData, setCurrentChartData] = useState(periodChartData.week);

  // Update data when period changes
  useEffect(() => {
    setCurrentData(periodData[selectedPeriod]);
    setCurrentChartData(periodChartData[selectedPeriod]);
  }, [selectedPeriod]);

  

  return (
    <div className="min-h-screen bg-gray-50 dashboard-container">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 text-sm sm:text-base">Chào mừng trở lại! Đây là tổng quan về hệ thống của bạn.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-4">
              
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['day', 'week', 'month', 'year'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        selectedPeriod === period
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {period === 'day' && 'Hôm nay'}
                      {period === 'week' && 'Tuần này'}
                      {period === 'month' && 'Tháng này'}
                      {period === 'year' && 'Năm nay'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="p-4 sm:p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stats-grid">
          <EnhancedDashboardCard
            title="Tổng doanh thu"
            icon={<DollarSign size={24} className="text-white" />}
            value={`$${(currentData.revenue[selectedPeriod] || 0).toLocaleString('vi-VN')}`}
            change={selectedPeriod === 'day' ? 8.5 : selectedPeriod === 'week' ? 12.5 : selectedPeriod === 'month' ? 18.2 : 25.7}
            color="bg-green-500"
            gradient="gradient-green"
          />
          <EnhancedDashboardCard
            title="Đơn hàng mới"
            icon={<ShoppingCart size={24} className="text-white" />}
            value={`${(currentData.orders.pending + currentData.orders.processing + currentData.orders.completed).toLocaleString('vi-VN')}`}
            change={selectedPeriod === 'day' ? -1.2 : selectedPeriod === 'week' ? -2.3 : selectedPeriod === 'month' ? 5.8 : 12.4}
            color="bg-blue-500"
            gradient="gradient-blue"
          />
          <EnhancedDashboardCard
            title="Người dùng mới"
            icon={<Users size={24} className="text-white" />}
            value={currentData.customers.new.toLocaleString('vi-VN')}
            change={selectedPeriod === 'day' ? 3.2 : selectedPeriod === 'week' ? 8.7 : selectedPeriod === 'month' ? 15.3 : 22.8}
            color="bg-purple-500"
            gradient="gradient-purple"
          />
          <EnhancedDashboardCard
            title="Sản phẩm bán ra"
            icon={<Package size={24} className="text-white" />}
            value={currentData.topProducts.reduce((sum, product) => sum + product.sales, 0).toLocaleString('vi-VN')}
            change={selectedPeriod === 'day' ? 6.8 : selectedPeriod === 'week' ? 15.2 : selectedPeriod === 'month' ? 28.5 : 45.2}
            color="bg-orange-500"
            gradient="gradient-orange"
          />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* CRM Traffic Chart - Large */}
          <div className="xl:col-span-2">
            <Card className="dashboard-card h-full">
              <div className="overflow-x-auto">
                <BarChart 
                  data={currentChartData.multiSeriesData} 
                  title="CRM Traffic" 
                  subtitle="Doanh thu theo loại khách hàng" 
                />
              </div>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="xl:col-span-1">
            <PerformanceMetricsTable data={currentData.performance} />
          </div>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <Card className="dashboard-card">
            <div className="overflow-x-auto">
              <DonutChart 
                data={currentChartData.donutData} 
                title="CRM Traffic" 
                subtitle="Phân bố doanh thu theo khoản mục" 
              />
            </div>
          </Card>

          {/* Line Chart */}
          <Card className="dashboard-card">
            <div className="overflow-x-auto">
              <LineChart 
                data={currentChartData.dailySales} 
                title="Xu hướng doanh thu" 
                subtitle="Biểu đồ doanh thu theo thời gian" 
              />
            </div>
          </Card>
        </div>

        {/* Area Chart - Full Width */}
        <Card className="dashboard-card">
          <div className="overflow-x-auto">
            <AreaChart 
              data={currentChartData.sales} 
              title="Doanh thu vs Mục tiêu" 
              subtitle="So sánh doanh thu thực tế với mục tiêu" 
            />
          </div>
        </Card>

        {/* Top Row - 3 Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Sản phẩm bán chạy */}
          <Card className="dashboard-card">
            <div className="flex items-center mb-4">
              <Package className="text-red-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
            </div>
            <div className="space-y-4">
              {currentData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      <AnimatedCounter 
                        end={product.sales} 
                        duration={1500} 
                        delay={index * 200}
                      />
                    </p>
                    <p className="text-xs text-gray-500">đã bán</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 2. Thống kê doanh thu */}
          <Card className="dashboard-card">
            <div className="flex items-center mb-4">
              <DollarSign className="text-green-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Thống kê doanh thu</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Doanh thu hôm nay</span>
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedCurrency 
                        end={currentData.revenue.today} 
                        currency="$" 
                        duration={1500}
                      />
                    </span>
                  </div>
                  <Progress percent={85} strokeColor="#10B981" showInfo={false} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Doanh thu tuần này</span>
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedCurrency 
                        end={currentData.revenue.week} 
                        currency="$" 
                        duration={1500}
                      />
                    </span>
                  </div>
                  <Progress percent={72} strokeColor="#3B82F6" showInfo={false} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Doanh thu tháng này</span>
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedCurrency 
                        end={currentData.revenue.month} 
                        currency="$" 
                        duration={1500}
                      />
                    </span>
                  </div>
                  <Progress percent={68} strokeColor="#8B5CF6" showInfo={false} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Tổng doanh thu năm</span>
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedCurrency 
                        end={currentData.revenue.year} 
                        currency="$" 
                        duration={1500}
                      />
                    </span>
                  </div>
                  <Progress percent={92} strokeColor="#F59E0B" showInfo={false} />
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Thống kê khách hàng */}
          <Card className="dashboard-card">
            <div className="flex items-center mb-4">
              <Users className="text-blue-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Thống kê khách hàng</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter 
                      end={currentData.customers.total} 
                      duration={2000}
                    />
                  </div>
                  <div className="text-sm text-blue-700">Tổng khách hàng</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    <AnimatedCounter 
                      end={currentData.customers.new} 
                      duration={2000}
                    />
                  </div>
                  <div className="text-sm text-green-700">Khách hàng mới</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tỷ lệ tăng trưởng</span>
                  <span className="text-sm font-semibold text-green-600">
                    <AnimatedPercentage 
                      end={currentData.customers.growth} 
                      showPlus={true}
                      duration={2000}
                    />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Khách hàng VIP</span>
                  <span className="text-sm font-semibold text-purple-600">
                    <AnimatedCounter 
                      end={currentData.customers.vip} 
                      duration={2000}
                    />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đánh giá trung bình</span>
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedCounter 
                        end={currentData.customers.rating} 
                        decimals={1}
                        duration={2000}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Row - 3 Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 4. Trạng thái đơn hàng */}
          <Card className="dashboard-card">
            <div className="flex items-center mb-4">
              <ShoppingCart className="text-orange-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="text-yellow-600 mr-2" size={16} />
                    <span className="text-sm font-medium text-gray-700">Chờ Xử Lý</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      <AnimatedCounter 
                        end={currentData.orders.pending} 
                        duration={1500}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{((currentData.orders.pending / (currentData.orders.pending + currentData.orders.processing + currentData.orders.completed + currentData.orders.cancelled)) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="text-blue-600 mr-2" size={16} />
                    <span className="text-sm font-medium text-gray-700">Đang Xử Lý</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      <AnimatedCounter 
                        end={currentData.orders.processing} 
                        duration={1500}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{((currentData.orders.processing / (currentData.orders.pending + currentData.orders.processing + currentData.orders.completed + currentData.orders.cancelled)) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2" size={16} />
                    <span className="text-sm font-medium text-gray-700">Hoàn Thành</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      <AnimatedCounter 
                        end={currentData.orders.completed} 
                        duration={1500}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{((currentData.orders.completed / (currentData.orders.pending + currentData.orders.processing + currentData.orders.completed + currentData.orders.cancelled)) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-600 mr-2" size={16} />
                    <span className="text-sm font-medium text-gray-700">Đã Hủy</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      <AnimatedCounter 
                        end={currentData.orders.cancelled} 
                        duration={1500}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{((currentData.orders.cancelled / (currentData.orders.pending + currentData.orders.processing + currentData.orders.completed + currentData.orders.cancelled)) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 5. Doanh thu theo khu vực */}
          <Card className="dashboard-card">
            <div className="flex items-center mb-4">
              <TrendingUp className="text-indigo-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo khu vực</h3>
            </div>
            <div className="space-y-4">
              {[
                { region: 'Miền Bắc', value: 45, color: '#3B82F6', revenue: currentData.revenue[selectedPeriod] * 0.45 },
                { region: 'Miền Trung', value: 25, color: '#10B981', revenue: currentData.revenue[selectedPeriod] * 0.25 },
                { region: 'Miền Nam', value: 30, color: '#F59E0B', revenue: currentData.revenue[selectedPeriod] * 0.30 }
              ].map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: region.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{region.region}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      <AnimatedPercentage 
                        end={region.value} 
                        duration={1500}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      <AnimatedCounter 
                        end={region.revenue} 
                        suffix=" VNĐ"
                        duration={1500}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 6. Performance Metrics */}
          <Card className="dashboard-card">
            <div className="flex items-center mb-4">
              <BarChart3 className="text-purple-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Hiệu suất hệ thống</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Tỷ lệ chuyển đổi</span>
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedPercentage 
                        end={currentData.performance.conversion} 
                        duration={2000}
                      />
                    </span>
                  </div>
                  <Progress percent={currentData.performance.conversion} strokeColor="#10B981" showInfo={false} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Tốc độ trang</span>
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedCounter 
                        end={currentData.performance.pageSpeed} 
                        suffix="ms"
                        duration={2000}
                      />
                    </span>
                  </div>
                  <Progress percent={85} strokeColor="#3B82F6" showInfo={false} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Tỷ lệ thoát</span>
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedPercentage 
                        end={currentData.performance.bounceRate} 
                        duration={2000}
                      />
                    </span>
                  </div>
                  <Progress percent={currentData.performance.bounceRate} strokeColor="#EF4444" showInfo={false} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Thời gian trung bình</span>
                    <span className="text-sm font-semibold text-gray-900">
                      <AnimatedCounter 
                        end={currentData.performance.avgTime} 
                        suffix=" phút"
                        decimals={1}
                        duration={2000}
                      />
                    </span>
                  </div>
                  <Progress percent={70} strokeColor="#F59E0B" showInfo={false} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Distribution */}
          <div className="lg:col-span-1">
            <Card className="dashboard-card h-full">
              <div className="overflow-x-auto">
                <DonutChart 
                  data={currentChartData.categories} 
                  title="Phân bố danh mục" 
                  subtitle="Tổng doanh thu theo từng danh mục" 
                />
              </div>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="dashboard-card h-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div className="flex items-center">
                  <Activity className="text-green-500 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                </div>
                <Button type="text" className="text-blue-600 self-start sm:self-auto">
                  Xem tất cả <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
              <div className="space-y-2 custom-scrollbar overflow-hidden" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <button className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </button>
        <button className="w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;