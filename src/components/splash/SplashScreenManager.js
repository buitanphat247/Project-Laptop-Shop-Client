import React, { useState, useEffect } from 'react';
import SplashScreen from '../SplashScreen';

const SplashScreenManager = ({ 
  children, 
  showSplash = true, 
  duration = 3000,
  autoHide = true,
  autoHideDelay = 4000,
  onSplashComplete,
  onSplashStart
}) => {
  const [isVisible, setIsVisible] = useState(showSplash);

  useEffect(() => {
    if (onSplashStart) {
      onSplashStart();
    }
  }, [onSplashStart]);

  const handleSplashComplete = () => {
    setIsVisible(false);
    if (onSplashComplete) {
      onSplashComplete();
    }
  };

  // Auto-hide fallback
  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onSplashComplete) {
          onSplashComplete();
        }
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, isVisible, onSplashComplete]);

  // Don't show splash if disabled
  if (!showSplash) {
    return children;
  }

  // Show splash screen
  if (isVisible) {
    return (
      <SplashScreen 
        onComplete={handleSplashComplete}
        duration={duration}
      />
    );
  }

  // Show main app
  return children;
};

export default SplashScreenManager;

