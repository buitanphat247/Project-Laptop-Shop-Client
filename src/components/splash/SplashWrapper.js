import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthSplashManager from './AuthSplashManager';
import ScrollProgressController from './../progress/ScrollProgressController';

const SplashWrapper = ({ children }) => {
  const location = useLocation();

  // Kiểm tra xem đã hiển thị splash trong session này chưa
  const [hasShownSplash, setHasShownSplash] = React.useState(() => {
    return sessionStorage.getItem('splashShown') === 'true';
  });

  // Danh sách các route CẦN splash screen (chỉ trang chủ và admin)
  const includeRoutes = ['/', '/admin'];

  // Kiểm tra có cần splash không - chỉ lần đầu tiên và trên các route được chỉ định
  const shouldShowSplash = includeRoutes.includes(location.pathname) && !hasShownSplash;

  // Emit event splash complete - luôn được gọi
  React.useEffect(() => {
    if (!shouldShowSplash) {
      // Nếu không cần splash, emit event ngay lập tức
      window.dispatchEvent(new Event('splashComplete'));
    }
  }, [shouldShowSplash]);

  const handleSplashComplete = () => {
    // Đánh dấu đã hiển thị splash trong session này
    setHasShownSplash(true);
    sessionStorage.setItem('splashShown', 'true');

    // Emit event khi splash kết thúc
    window.dispatchEvent(new Event('splashComplete'));
  };

  if (shouldShowSplash) {
    return (
      <AuthSplashManager
        showSplash={true}
        duration={3000}
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
