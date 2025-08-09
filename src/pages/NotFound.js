import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181c2f] via-[#232946] to-[#1a1a2e] overflow-hidden">
      {/* Stars */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-30"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
      {/* Planets */}
      <div className="absolute left-[10%] top-[18%] w-40 h-40 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-full shadow-2xl planet-glow" />
      <div className="absolute left-[30%] top-[35%] w-24 h-24 bg-gradient-to-br from-purple-400 via-blue-400 to-pink-400 rounded-full shadow-xl planet-glow" />
      <div className="absolute right-[12%] top-[20%] w-32 h-32 bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 rounded-full shadow-2xl planet-glow" />
      <div className="absolute right-[8%] bottom-[10%] w-36 h-36 bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300 rounded-full shadow-2xl planet-glow" />
      <div className="absolute left-[18%] bottom-[12%] w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full shadow-xl planet-glow" />
      {/* Orbit Path & Satellite */}
      <svg className="absolute left-[22%] top-[38%]" width="420" height="180" viewBox="0 0 420 180" fill="none">
        <path d="M10 170 Q210 10 410 170" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" fill="none" />
        <circle cx="10" cy="170" r="5" fill="#fff" opacity="0.7" />
        <circle cx="410" cy="170" r="7" fill="#fff" opacity="0.3" />
        <circle cx="210" cy="30" r="8" fill="url(#satelliteGradient)" />
        <defs>
          <radialGradient id="satelliteGradient" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#fffbe6" />
            <stop offset="100%" stopColor="#f472b6" />
          </radialGradient>
        </defs>
      </svg>
      {/* Floating 404 */}
      <div className="w-full flex justify-center items-center absolute top-[18%] left-0 z-20 select-none pointer-events-none">
        <span className="text-[6rem] md:text-[8rem] font-extrabold text-white/20 animate-float404-1">4</span>
        <span className="text-[7rem] md:text-[9rem] font-extrabold text-white/30 mx-2 animate-float404-2">0</span>
        <span className="text-[6rem] md:text-[8rem] font-extrabold text-white/20 animate-float404-3">4</span>
      </div>
      {/* Main content */}
      <div className="z-10 flex flex-col items-center justify-center mt-32 animate-fadeInUp">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 drop-shadow-lg text-center">Looks like you're floating in space!<br/>Or maybe this page doesn't exist.</h2>
        <NavLink to="/" className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300">Back to homepage</NavLink>
      </div>
      {/* Custom animation keyframes */}
      <style>{`
        .planet-glow {
          box-shadow: 0 0 60px 20px rgba(255, 180, 255, 0.25), 0 0 120px 40px rgba(255, 180, 255, 0.12);
        }
        @keyframes float404-1 {
          0%, 100% { transform: translateY(0) scale(1.05); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        .animate-float404-1 {
          animation: float404-1 3.2s ease-in-out infinite;
        }
        @keyframes float404-2 {
          0%, 100% { transform: translateY(0) scale(1.15); }
          50% { transform: translateY(-22px) scale(1.22); }
        }
        .animate-float404-2 {
          animation: float404-2 3s ease-in-out infinite;
        }
        @keyframes float404-3 {
          0%, 100% { transform: translateY(0) scale(1.05); }
          50% { transform: translateY(-16px) scale(1.13); }
        }
        .animate-float404-3 {
          animation: float404-3 3.4s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
z        }
      `}</style>
    </div>
  );
}