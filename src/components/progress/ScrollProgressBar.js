import React, { useState, useEffect } from 'react';

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    // cập nhật ngay lần đầu
    updateScrollProgress();

    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  const barStyle = {
    width: `${scrollProgress}%`,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    transition: 'width 150ms ease-out'
  };

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-[99999]">
      <div className="h-full shadow-sm" style={barStyle} />
    </div>
  );
};

export default ScrollProgressBar;
