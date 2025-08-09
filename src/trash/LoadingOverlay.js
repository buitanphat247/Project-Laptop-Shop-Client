import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ 
  visible = false, 
  text = 'Đang tải dữ liệu...', 
  size = 'lg',
  backdrop = true 
}) => {
  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      backdrop ? 'bg-white/90 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="text-center">
        <LoadingSpinner size={size} text={text} />
      </div>
    </div>
  );
};

// Page loading component
const PageLoading = ({ text = 'Đang tải trang...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" text={text} />
      </div>
    </div>
  );
};

// Inline loading component
const InlineLoading = ({ text = 'Đang tải...', size = 'sm' }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner size={size} text={text} />
    </div>
  );
};

// Button loading component
const ButtonLoading = ({ size = 'sm' }) => {
  return (
    <div className={`inline-flex items-center justify-center ${
      size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
    }`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
    </div>
  );
};

export default LoadingOverlay;
export { PageLoading, InlineLoading, ButtonLoading }; 