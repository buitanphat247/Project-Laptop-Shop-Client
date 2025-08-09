import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthSplashManager from '../components/splash/AuthSplashManager';
import ScrollProgressController from '../components/progress/ScrollProgressController';

const SplashWrapper = ({ children }) => {
  const location = useLocation();
  
  // Danh sách các route KHÔNG cần splash screen
  const excludeRoutes = [
    '/vnpay-return',
    '/signin',
    '/signup', 
    '/reset-password',
    '/forgot-password'
  ];

  // Kiểm tra xem route hiện tại có cần splash screen không
  const shouldShowSplash = !excludeRoutes.some(route => {
    if (route === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(route);
  });

  // Emit event splash complete - luôn được gọi
  React.useEffect(() => {
    if (!shouldShowSplash) {
      // Nếu không cần splash, emit event ngay lập tức
      window.dispatchEvent(new Event('splashComplete'));
    }
  }, [shouldShowSplash]);

  const handleSplashComplete = () => {
    // Emit event khi splash kết thúc
    window.dispatchEvent(new Event('splashComplete'));
  };

  if (shouldShowSplash) {
    return (
      <AuthSplashManager
        showSplash={true}
        duration={2000}
        onSplashComplete={handleSplashComplete}
      >
        <ScrollProgressController />
        {children}
      </AuthSplashManager>
    );
  }

  // Nếu không cần splash, render children trực tiếp
  return (
    <>
      <ScrollProgressController />
      {children}
    </>
  );
};

export default SplashWrapper;
