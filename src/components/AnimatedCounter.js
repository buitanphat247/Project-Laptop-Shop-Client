import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ 
  end, 
  start = 0, 
  duration = 2000, 
  delay = 0,
  prefix = '', 
  suffix = '',
  decimals = 0,
  className = '',
  onComplete = null
}) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const startTime = Date.now();
      const difference = end - start;

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = start + (difference * easeOutQuart);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
          if (onComplete) onComplete();
        }
      };

      updateCount();
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, end, start, duration, delay, onComplete]);

  const formatNumber = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

// Percentage counter
const AnimatedPercentage = ({ 
  end, 
  start = 0, 
  duration = 2000, 
  delay = 0,
  className = '',
  showPlus = false 
}) => {
  return (
    <AnimatedCounter
      end={end}
      start={start}
      duration={duration}
      delay={delay}
      suffix="%"
      prefix={showPlus && end > 0 ? '+' : ''}
      decimals={1}
      className={className}
    />
  );
};

// Currency counter
const AnimatedCurrency = ({ 
  end, 
  start = 0, 
  duration = 2000, 
  delay = 0,
  currency = '$',
  className = '' 
}) => {
  return (
    <AnimatedCounter
      end={end}
      start={start}
      duration={duration}
      delay={delay}
      prefix={currency}
      className={className}
    />
  );
};

export default AnimatedCounter;
export { AnimatedPercentage, AnimatedCurrency }; 