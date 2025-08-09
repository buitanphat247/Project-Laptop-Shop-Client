import React, { useState, useEffect } from 'react';

const AdvancedScrollProgressBar = ({ 
  height = 3,
  showPercentage = false,
  showOnTop = true,
  gradient = true,
  smooth = true,
  color = 'default' // 'default', 'blue', 'purple', 'pink', 'green', 'custom'
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      
      // Luôn hiển thị progress bar
      setIsVisible(true);
    };

    // Throttle scroll event để tối ưu performance
    let ticking = false;
    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledUpdate);
    
    return () => window.removeEventListener('scroll', throttledUpdate);
  }, []);

  // Color schemes
  const getColorScheme = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600';
      case 'purple':
        return 'from-purple-500 to-purple-600';
      case 'pink':
        return 'from-pink-500 to-pink-600';
      case 'green':
        return 'from-green-500 to-green-600';
      case 'custom':
        return 'from-indigo-500 via-purple-500 to-pink-500';
      default:
        return 'from-blue-500 via-purple-500 to-pink-500';
    }
  };

  const getBgColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'purple':
        return 'bg-purple-500';
      case 'pink':
        return 'bg-pink-500';
      case 'green':
        return 'bg-green-500';
      case 'custom':
        return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500';
    }
  };

  return (
    <>
      {/* Main Progress Bar */}
      <div 
        className={`fixed ${showOnTop ? 'top-0' : 'bottom-0'} left-0 w-full bg-transparent z-[9999]`}
        style={{ height: `${height}px` }}
      >
        <div 
          className={`h-full ${gradient ? `bg-gradient-to-r ${getColorScheme()}` : getBgColor()} transition-all duration-150 ease-out shadow-lg ${
            smooth ? 'transform-gpu' : ''
          }`}
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Shimmer effect */}
          {gradient && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          )}
        </div>
      </div>

      {/* Percentage Display */}
      {showPercentage && (
        <div className={`fixed ${showOnTop ? 'top-4' : 'bottom-4'} right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium z-[9999] transition-opacity duration-300`}>
          {Math.round(scrollProgress)}%
        </div>
      )}
    </>
  );
};

export default AdvancedScrollProgressBar;
