import React from "react";
import { formatPrice } from "../../utils";
import { NavLink } from "react-router-dom";

const CardProductLarge = ({
    id,
    image,
    category,
    name,
    price,
    oldPrice,
    discount,
    rating,
    views,
    desc,
    onViewDetails,
    onAddToCart,
    onLike
}) => (
    <NavLink to={`/product/${id}`} className="bg-white rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-lg border border-gray-100 p-0 flex overflow-hidden relative group hover:shadow-2xl transition min-h-[180px] sm:min-h-[220px] lg:min-h-[260px]">
        {/* Badge */}
        <span className="absolute top-2 left-2 bg-green-100 text-green-600 font-bold px-2 sm:px-4 lg:px-4 py-1 rounded-lg text-xs sm:text-sm lg:text-sm shadow z-10">{discount}</span>
        {/* Like */}
        {/* <button onClick={onLike} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition z-10">
            <svg viewBox="64 64 896 896" focusable="false" data-icon="heart" width="24" height="24" fill="currentColor" aria-hidden="true">
                <path d="M923 283.6c0-54.2-21.1-105.2-59.4-143.5C825.2 101.8 774.2 80.7 720 80.7c-54.2 0-105.2 21.1-143.5 59.4L512 204.6l-64.5-64.5C409.2 101.8 358.2 80.7 304 80.7c-54.2 0-105.2 21.1-143.5 59.4C122.1 178.4 101 229.4 101 283.6c0 54.2 21.1 105.2 59.4 143.5l378.1 378.1c6.5 6.5 15.1 10.1 24.2 10.1s17.7-3.6 24.2-10.1l378.1-378.1c38.3-38.3 59.4-89.3 59.4-143.5z"></path>
            </svg>
        </button> */}
        {/* Ảnh chiếm toàn bộ chiều cao bên trái */}
        <div className="w-1/2 sm:w-2/5 lg:w-2/5 h-full flex items-center justify-center bg-gray-50">
            <img src={image} alt={name} loading="lazy" className="w-full h-full object-cover rounded-l-xl sm:rounded-l-2xl lg:rounded-l-2xl" />
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0 p-3 sm:p-4 lg:p-5 flex flex-col justify-center">
            <div className="text-xs sm:text-sm lg:text-sm text-green-600 font-semibold mb-1">{category}</div>
            <div className="font-bold text-base sm:text-lg lg:text-2xl mb-2 truncate">{name}</div>
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-2 mb-2">
                <span className="text-yellow-500">
                    <svg viewBox="64 64 896 896" focusable="false" data-icon="star" width="16" height="16" fill="currentColor" aria-hidden="true" className="sm:w-5 lg:w-5">
                        <path d="M908.1 353.1c-5.2-16-19.6-27.7-36.5-29.1l-211.6-18.3-82.7-197.2c-6.6-15.7-22-25.9-39.3-25.9s-32.7 10.2-39.3 25.9l-82.7 197.2-211.6 18.3c-16.9 1.5-31.3 13.2-36.5 29.1-5.2 16 .5 33.2 13.7 43.8l164.2 137.7-49.1 208.2c-3.8 16.1 2.1 33.1 15.1 43.1 13 10 30.5 11.2 44.2 3l183.2-108.7 183.2 108.7c6.2 3.7 13 5.5 19.7 5.5 8.7 0 17.3-2.8 24.5-8.5 13-10 18.9-27 15.1-43.1l-49.1-208.2 164.2-137.7c13.2-10.6 18.9-27.8 13.7-43.8z"></path>
                    </svg>
                </span>
                <span className="font-semibold text-sm sm:text-lg lg:text-lg">{rating}</span>
                <span className="text-gray-400 line-through ml-1 sm:ml-2 lg:ml-2 text-xs sm:text-base lg:text-base">{formatPrice(oldPrice)}</span>
                <span className="text-green-700 font-bold ml-1 sm:ml-2 lg:ml-2 text-base sm:text-xl lg:text-xl">{formatPrice(price)}</span>
            </div>
            <div className="text-gray-400 text-xs sm:text-base lg:text-base mb-2 sm:mb-3 lg:mb-3 line-clamp-2">{desc}</div>
            <div className="flex flex-col gap-1 sm:gap-2 lg:gap-2 mt-2 w-full">
                <NavLink to={`/product/${id}`} onClick={() => onViewDetails && onViewDetails(id)} className="hidden sm:flex w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 sm:px-5 lg:px-5 py-2 rounded-lg transition text-xs sm:text-base lg:text-base items-center justify-center gap-2">
                    Xem chi tiết <span className="text-sm sm:text-lg lg:text-lg">→</span>
                </NavLink>
                <button onClick={() => onAddToCart && onAddToCart(id)} className="hidden sm:flex w-full bg-green-50 text-green-700 font-semibold px-2 sm:px-5 lg:px-5 py-2 rounded-lg border border-green-200 hover:bg-green-100 transition text-xs sm:text-base lg:text-base items-center justify-center gap-2">
                    Add to cart
                </button>
            </div>
        </div>
    </NavLink>
);

export default CardProductLarge; 