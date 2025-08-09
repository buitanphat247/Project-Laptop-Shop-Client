import React, { useState, useEffect } from 'react';
import '../../styles/splash.css';

const AuthSplashScreen = ({ 
  onComplete, 
  duration = 2000,
  isAuthReady = false,
  authLoading = false 
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: "Initializing System", icon: "⚡" },
    { text: "Loading Components", icon: "🔧" },
    { text: "Preparing Interface", icon: "🎨" },
    { text: "Ready to Launch", icon: "🚀" }
  ];

  // Chỉ hiển thị splash screen khi auth đã sẵn sàng
  useEffect(() => {
    if (isAuthReady && !authLoading) {
      setIsVisible(true);
    }
  }, [isAuthReady, authLoading]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            onComplete && onComplete();
          }, 500);
          return 100;
        }
        
        // Update current step based on progress
        const stepIndex = Math.floor((prev / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(timer);
  }, [duration, onComplete, isVisible, steps.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Floating Orbs */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          {/* Logo Container */}
          <div className="mb-12 relative">
            {/* Outer Ring */}
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-white/20 flex items-center justify-center animate-pulse">
              {/* Middle Ring */}
              <div className="w-24 h-24 rounded-full border-4 border-white/40 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                {/* Inner Circle */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl animate-bounce">
                  <span className="text-white text-2xl font-bold">L</span>
                </div>
              </div>
            </div>
            
            {/* Orbiting Dots */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-white rounded-full animate-ping"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-40px)`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>

                     {/* App Title */}
           <h1 className="text-5xl font-bold mb-4 animate-fadeInUp">
             <span className="text-white drop-shadow-lg">
               Laptop Shop
             </span>
           </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-xl mb-8 animate-fadeInUp animation-delay-200">
            Your Premium Tech Destination
          </p>

          {/* Current Step */}
          <div className="mb-8 animate-fadeInUp animation-delay-400">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-2xl">{steps[currentStep].icon}</span>
              <span className="text-white/80 text-lg font-medium">{steps[currentStep].text}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-80 mx-auto mb-6">
            <div className="relative">
              {/* Background */}
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                {/* Animated Background */}
                <div className="h-full w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
              </div>
              
              {/* Progress Fill */}
              <div 
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              
              {/* Progress Text */}
              <div className="absolute -top-8 right-0 text-white/70 text-sm font-medium">
                {progress}%
              </div>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i <= currentStep 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 scale-125' 
                    : 'bg-white/30'
                }`}
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animation: i <= currentStep ? 'pulse 1.5s infinite' : 'none'
                }}
              />
            ))}
          </div>

          {/* Status Text */}
          <p className="text-white/50 text-sm mt-6 animate-pulse">
            Preparing your experience...
          </p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/20 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/20 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/20 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/20 rounded-br-lg" />
    </div>
  );
};

export default AuthSplashScreen;
