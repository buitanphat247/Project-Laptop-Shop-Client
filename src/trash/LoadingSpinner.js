import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Đang tải...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        
        {/* Animated ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        
        {/* Inner dot */}
        <div className="absolute inset-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      
      {text && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Skeleton loading component
const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg animate-pulse ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-32 h-8 bg-gray-200 rounded"></div>
    </div>
  );
};

// Dashboard skeleton
const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-48 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-64 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-32 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg animate-pulse">
            <div className="w-48 h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
            <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activities Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
            <div className="w-40 h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
export { SkeletonCard, DashboardSkeleton }; 