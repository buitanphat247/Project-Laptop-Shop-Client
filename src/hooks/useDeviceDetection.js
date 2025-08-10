import { useState, useEffect } from 'react';

/**
 * Custom hook để detect device type và screen size
 * @returns {Object} deviceType, screenSize, isDesktop, isTablet, isMobile
 */
export const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      // Định nghĩa breakpoints
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = deviceType === 'desktop';
  const isTablet = deviceType === 'tablet';
  const isMobile = deviceType === 'mobile';

  return {
    deviceType,
    screenSize,
    isDesktop,
    isTablet,
    isMobile
  };
};

export default useDeviceDetection;



