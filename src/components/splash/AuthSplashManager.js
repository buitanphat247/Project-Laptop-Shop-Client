import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthSplashScreen from './AuthSplashScreen';

const AuthSplashManager = ({ 
  children, 
  showSplash = true, 
  duration = 2000,
  onSplashComplete,
  onSplashStart
}) => {
  const { isAuthLoading } = useAuth();
  const [showAuthSplash, setShowAuthSplash] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Theo dõi trạng thái auth loading
  useEffect(() => {
    if (!isAuthLoading && !isAuthReady) {
      setIsAuthReady(true);
      if (showSplash) {
        setShowAuthSplash(true);
        if (onSplashStart) {
          onSplashStart();
        }
      }
    }
  }, [isAuthLoading, isAuthReady, showSplash, onSplashStart]);

  const handleSplashComplete = () => {
    setShowAuthSplash(false);
    if (onSplashComplete) {
      onSplashComplete();
    }
  };

  // Nếu auth đang loading, hiển thị loading đẹp hơn
  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 8 + 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }} />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            {/* Loading Spinner */}
            <div className="mb-8 relative">
              {/* Outer Ring */}
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-white/20 flex items-center justify-center">
                {/* Middle Ring */}
                <div className="w-14 h-14 rounded-full border-4 border-white/40 flex items-center justify-center animate-spin" style={{ animationDuration: '2s' }}>
                  {/* Inner Circle */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Orbiting Dots */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-25px)`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-4 animate-fadeInUp">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Initializing
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-white/70 text-lg mb-6 animate-fadeInUp animation-delay-200">
              Authentication System
            </p>

            {/* Loading Text */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <span className="text-blue-400 text-xl">⚡</span>
              <span className="text-white/80 text-sm font-medium">Checking credentials...</span>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white/30 rounded-full animate-pulse"
                  style={{ 
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: '1.2s'
                  }}
                />
              ))}
            </div>

            {/* Status */}
            <p className="text-white/50 text-xs mt-4 animate-pulse">
              Please wait while we verify your session...
            </p>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-white/20 rounded-tl-lg" />
        <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-white/20 rounded-tr-lg" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-white/20 rounded-bl-lg" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-white/20 rounded-br-lg" />
      </div>
    );
  }

  // Nếu không show splash hoặc đã hoàn thành, hiển thị app
  if (!showSplash || !showAuthSplash) {
    return children;
  }

  // Hiển thị auth splash screen
  return (
    <AuthSplashScreen
      onComplete={handleSplashComplete}
      duration={duration}
      isAuthReady={isAuthReady}
      authLoading={isAuthLoading}
    />
  );
};

export default AuthSplashManager;
