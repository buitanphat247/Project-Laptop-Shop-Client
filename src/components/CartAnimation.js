import React, { useState, useEffect } from 'react';

const CartAnimation = ({ show, onAnimationEnd }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationPhase, setAnimationPhase] = useState('enter');

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            setAnimationPhase('enter');
            
            // Phase 1: Enter animation (0.2s)
            const enterTimer = setTimeout(() => {
                setAnimationPhase('bounce');
            }, 200);
            
            // Phase 2: Bounce animation (0.3s)
            const bounceTimer = setTimeout(() => {
                setAnimationPhase('exit');
            }, 500); // 200ms (enter) + 300ms (bounce) = 500ms
            
            // Phase 3: Exit animation (0.2s)
            const exitTimer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    onAnimationEnd();
                }, 200);
            }, 700); // 500ms + 200ms (exit) = 700ms
            
            return () => {
                clearTimeout(enterTimer);
                clearTimeout(bounceTimer);
                clearTimeout(exitTimer);
            };
        }
    }, [show, onAnimationEnd]);

    if (!isVisible) return null;

    const getAnimationClasses = () => {
        switch (animationPhase) {
            case 'enter':
                return 'animate-fadeIn-fast scale-75 opacity-0';
            case 'bounce':
                return 'animate-bounce scale-100 opacity-100';
            case 'exit':
                return 'animate-fadeOut-fast scale-75 opacity-0';
            default:
                return '';
        }
    };

    return (
        <div className="fixed top-20 z-50 pointer-events-none md:right-20 right-16">
                            <div className={`transform transition-all duration-200 ${getAnimationClasses()}`}>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg md:text-xl font-bold px-3 md:px-4 py-1 md:py-2 rounded-full shadow-2xl border-2 border-white animate-pulse">
                    +1
                </div>
            </div>
        </div>
    );
};

export default CartAnimation;
