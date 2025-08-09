import React, { useState, useEffect } from 'react';
import '../styles/splash.css';

const SplashScreen = ({ onComplete, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsVisible(false);
          setTimeout(() => {
            onComplete && onComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-20 animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl splash-bounce splash-logo">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">L</span>
            </div>
          </div>
        </div>

        {/* App name */}
        <h1 className="text-3xl font-bold text-white mb-4 splash-fade-in splash-title">
          Laptop Shop
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-lg mb-8 splash-fade-in animation-delay-200 splash-subtitle">
          Your Premium Tech Destination
        </p>

        {/* Loading bar */}
        <div className="w-64 bg-white/20 rounded-full h-2 mb-4">
          <div 
            className="bg-white h-2 rounded-full loading-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress text */}
        <p className="text-white/70 text-sm splash-pulse">
          Loading... {progress}%
        </p>

        {/* Loading dots */}
        <div className="flex space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full splash-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>


    </div>
  );
};

export default SplashScreen;
