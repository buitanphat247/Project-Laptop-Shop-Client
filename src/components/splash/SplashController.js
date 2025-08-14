import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthSplashManager from '../AuthSplashManager';

const SplashController = ({ 
  children, 
  showSplash = true, 
  duration = 2000,
  skipPaths = ['/vnpay-return', '/payment-success', '/webhook'],
  onSplashComplete,
  onSplashStart
}) => {
  const location = useLocation();
  
  // Kiểm tra xem có nên bỏ qua splash screen không
  const shouldSkipSplash = skipPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );

  // Debug logs
  console.log('SplashController Debug:', {
    currentPath: location.pathname,
    skipPaths,
    shouldSkipSplash
  });

  // Nếu nên bỏ qua splash screen, hiển thị children trực tiếp KHÔNG CÓ AuthSplashManager
  if (shouldSkipSplash) {
    console.log('🚀 SKIPPING SPLASH SCREEN for path:', location.pathname);
    return <>{children}</>;
  }

  console.log('📱 SHOWING SPLASH SCREEN for path:', location.pathname);
  // Nếu không bỏ qua, hiển thị AuthSplashManager
  return (
    <AuthSplashManager
      showSplash={showSplash}
      duration={duration}
      onSplashComplete={onSplashComplete}
      onSplashStart={onSplashStart}
    >
      {children}
    </AuthSplashManager>
  );
};

export default SplashController;
