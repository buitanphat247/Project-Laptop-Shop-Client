import React from 'react';
import { Card, Progress, Badge, Avatar } from 'antd';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Star,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import AnimatedCounter, { AnimatedPercentage, AnimatedCurrency } from './AnimatedCounter';

// Top Products Table
const TopProductsTable = ({ data = [] }) => {

  return (
    <Card 
      title={
        <div className="flex items-center">
          <Package className="text-blue-500 mr-2" size={20} />
          <span>Sản phẩm bán chạy</span>
        </div>
      } 
      className="dashboard-card"
    >
      <div className="space-y-4">
        {data.map((product, index) => (
          <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0">
              <Badge count={index + 1} className="bg-blue-500">
                <Avatar size="small" src={product.image} className="bg-gray-100">
                  {product.name.charAt(0)}
                </Avatar>
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-sm font-semibold text-gray-900">
                <AnimatedCounter end={product.sales} delay={index * 200} />
              </p>
              <p className="text-xs text-gray-500">đã bán</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Revenue Stats Table
const RevenueStatsTable = ({ data = {} }) => {

  return (
    <Card 
      title={
        <div className="flex items-center">
          <DollarSign className="text-green-500 mr-2" size={20} />
          <span>Thống kê doanh thu</span>
        </div>
      } 
      className="dashboard-card"
    >
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Doanh thu hôm nay</span>
            <span className="text-sm font-medium text-gray-900">
              <AnimatedCurrency end={data.today || 0} delay={100} />
            </span>
          </div>
          <Progress percent={75} strokeColor="#10B981" showInfo={false} />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Doanh thu tuần này</span>
            <span className="text-sm font-medium text-gray-900">
              <AnimatedCurrency end={data.week || 0} delay={200} />
            </span>
          </div>
          <Progress percent={68} strokeColor="#3B82F6" showInfo={false} />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Doanh thu tháng này</span>
            <span className="text-sm font-medium text-gray-900">
              <AnimatedCurrency end={data.month || 0} delay={300} />
            </span>
          </div>
          <Progress percent={82} strokeColor="#8B5CF6" showInfo={false} />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Tổng doanh thu năm</span>
            <span className="text-sm font-medium text-gray-900">
              <AnimatedCurrency end={data.year || 0} delay={400} />
            </span>
          </div>
          <Progress percent={65} strokeColor="#F59E0B" showInfo={false} />
        </div>
      </div>
    </Card>
  );
};

// Customer Stats Table
const CustomerStatsTable = ({ data = {} }) => {

  return (
    <Card 
      title={
        <div className="flex items-center">
          <Users className="text-purple-500 mr-2" size={20} />
          <span>Thống kê khách hàng</span>
        </div>
      } 
      className="dashboard-card"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              <AnimatedCounter end={data.total || 0} delay={100} />
            </div>
            <div className="text-sm text-gray-600">Tổng khách hàng</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              <AnimatedCounter end={data.new || 0} delay={200} />
            </div>
            <div className="text-sm text-gray-600">Khách hàng mới</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tỷ lệ tăng trưởng</span>
            <span className="text-sm font-medium text-green-600">
              <AnimatedPercentage end={data.growth || 0} delay={300} showPlus />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Khách hàng VIP</span>
            <span className="text-sm font-medium text-purple-600">
              <AnimatedCounter end={data.vip || 0} delay={400} />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Đánh giá trung bình</span>
            <div className="flex items-center">
              <Star className="text-yellow-400 fill-current" size={16} />
              <span className="text-sm font-medium text-gray-900 ml-1">
                <AnimatedCounter end={data.rating || 0} delay={500} decimals={1} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Order Status Table
const OrderStatusTable = ({ data = {} }) => {

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    processing: { icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
    completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    cancelled: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' }
  };

  return (
    <Card 
      title={
        <div className="flex items-center">
          <ShoppingCart className="text-orange-500 mr-2" size={20} />
          <span>Trạng thái đơn hàng</span>
        </div>
      } 
      className="dashboard-card"
    >
      <div className="space-y-4">
        {Object.entries(data).map(([status, count], index) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          
          return (
            <div key={status} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-full ${config.bg}`}>
                <Icon className={config.color} size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {status === 'pending' && 'Chờ xử lý'}
                  {status === 'processing' && 'Đang xử lý'}
                  {status === 'completed' && 'Hoàn thành'}
                  {status === 'cancelled' && 'Đã hủy'}
                </p>
                <p className="text-xs text-gray-500">
                  {count} đơn hàng
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  <AnimatedCounter end={count} delay={index * 150} />
                </p>
                <p className="text-xs text-gray-500">
                  <AnimatedPercentage end={Math.round((count / Object.values(data).reduce((a, b) => a + b, 0)) * 100)} delay={index * 150 + 100} />
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Performance Metrics Table
const PerformanceMetricsTable = ({ data = {} }) => {

  return (
    <Card 
      title={
        <div className="flex items-center">
          <TrendingUp className="text-indigo-500 mr-2" size={20} />
          <span>Chỉ số hiệu suất</span>
        </div>
      } 
      className="dashboard-card"
    >
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Tỷ lệ chuyển đổi</span>
            <span className="text-sm font-medium text-gray-900">
              <AnimatedPercentage end={data.conversion || 0} delay={100} />
            </span>
          </div>
          <Progress percent={data.conversion || 0} strokeColor="#6366F1" showInfo={false} />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Tốc độ tải trang</span>
            <span className="text-sm font-medium text-gray-900">
              <AnimatedCounter end={data.pageSpeed || 0} delay={200} suffix="ms" />
            </span>
          </div>
          <Progress percent={100 - ((data.pageSpeed || 0) / 3000 * 100)} strokeColor="#10B981" showInfo={false} />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Tỷ lệ bounce</span>
            <span className="text-sm font-medium text-gray-900">
              <AnimatedPercentage end={data.bounceRate || 0} delay={300} />
            </span>
          </div>
          <Progress percent={data.bounceRate || 0} strokeColor="#F59E0B" showInfo={false} />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Thời gian trung bình</span>
            <span className="text-sm font-medium text-gray-900">
              <AnimatedCounter end={data.avgTime || 0} delay={400} suffix="phút" />
            </span>
          </div>
          <Progress percent={(data.avgTime || 0) / 10 * 100} strokeColor="#8B5CF6" showInfo={false} />
        </div>
      </div>
    </Card>
  );
};

export {
  TopProductsTable,
  RevenueStatsTable,
  CustomerStatsTable,
  OrderStatusTable,
  PerformanceMetricsTable
}; 