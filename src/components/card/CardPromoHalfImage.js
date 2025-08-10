import React from "react";

const CardPromoHalfImage = ({
    title,
    desc,
    btnText = 'Shop Now',
    img,
    bg = 'bg-white',
    textColor = 'text-gray-900',
    descColor = 'text-gray-500',
    btnClass = 'bg-green-600 hover:bg-green-700',
    children
}) => (
    <div className={`relative rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl cursor-pointer min-h-[180px] sm:min-h-[200px] md:min-h-[260px] ${bg}`}>
        <div className={`relative z-30 p-4 sm:p-6 lg:p-8 flex flex-col justify-center w-full sm:w-1/2 text-white`}>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">{title}</div>
            <div className={`text-sm sm:text-base mb-4 sm:mb-6 text-gray-100`}>{desc}</div>
            <button className={`active:scale-95 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base flex items-center gap-2 shadow transition-all duration-200 w-max ${btnClass}`}>
                {btnText} <span className="text-base sm:text-lg">→</span>
            </button>
            {children}
        </div>
        {/* Black overlay layer for all devices */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/30 lg:bg-black/20 z-20"></div>
        <div className="absolute inset-0 w-full h-full z-10 overflow-hidden">
            <img src={img} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
    </div>
);

export default CardPromoHalfImage;