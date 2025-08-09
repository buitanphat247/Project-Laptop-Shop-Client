import React from "react";

const CardBanner = ({ imageUrl, title, subtitle }) => {
    return (
        <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden shadow-md border border-transparent hover:shadow-xl hover:border-blue-500 transition-all duration-300 cursor-pointer group">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {(title || subtitle) && (
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-start p-6">
                    {title && <h2 className="text-white text-2xl font-bold">{title}</h2>}
                    {subtitle && <p className="text-white mt-2 text-sm">{subtitle}</p>}
                </div>
            )}
        </div>
    );
};

export default CardBanner;
