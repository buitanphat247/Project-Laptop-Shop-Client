import React, { useEffect, useState } from "react";

export const LOADING_DURATION_MS = 1800;

const LoadingProgressBar = () => {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFade(true), LOADING_DURATION_MS + 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center min-h-screen bg-[#131926] transition-opacity duration-700 ${fade ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
            {/* Hiệu ứng mây mờ */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none">
                <div className="w-[28rem] h-40 bg-white/20 blur-3xl rounded-full mb-24 animate-cloud" />
            </div>
            {/* Logo với glow xanh */}
            <div className="relative mb-10 flex flex-col items-center">
                <div className="absolute -inset-4 rounded-full bg-cyan-400/30 blur-2xl animate-pulse" />
                <img src="/logo192.png" alt="Logo" loading="lazy" className="w-32 h-32 rounded-full shadow-2xl border-4 border-cyan-300/60 relative z-10" />
            </div>
            {/* Chữ chào mừng nổi bật */}
            <div className="text-4xl md:text-5xl font-extrabold text-white text-center animate-fadein drop-shadow-xl tracking-wide">
                Chào mừng đến với website!
            </div>
            {/* Dòng phụ */}
            <div className="text-lg md:text-xl text-slate-300 mt-4 text-center animate-fadein-slow">
                Chúc bạn một ngày tuyệt vời 🌤️
            </div>

            <style>{`
                .animate-cloud {
                    animation: cloudMove 3s ease-in-out infinite alternate;
                }
                @keyframes cloudMove {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-10px); }
                }
                .animate-fadein {
                    animation: fadeInUp 1s cubic-bezier(.39,.575,.565,1.000) both;
                }
                .animate-fadein-slow {
                    animation: fadeInUp 1.6s cubic-bezier(.39,.575,.565,1.000) both;
                }
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default LoadingProgressBar;