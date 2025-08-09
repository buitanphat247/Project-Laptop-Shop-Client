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
    <div className={`relative rounded-2xl shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl cursor-pointer min-h-[220px] md:min-h-[260px] ${bg}`}>
        <div className={`relative z-20 p-8 flex flex-col justify-center w-1/2 ${textColor}`}>
            <div className="text-2xl md:text-3xl font-bold mb-2">{title}</div>
            <div className={`text-base mb-6 ${descColor}`}>{desc}</div>
            <button className={`active:scale-95 text-white font-semibold px-6 py-2 rounded-lg text-base flex items-center gap-2 shadow transition-all duration-200 w-max ${btnClass}`}>
                {btnText} <span className="text-lg">→</span>
            </button>
            {children}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full z-10 overflow-hidden">
            <img src={img} alt={title} loading="lazy" className="w-full h-full object-cover rounded-r-2xl transition-transform duration-300 group-hover:scale-110" />
        </div>
    </div>
);

export default CardPromoHalfImage;