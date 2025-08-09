import React from "react";
import { NavLink } from "react-router-dom";
import { FaEye, FaUser, FaClock } from "react-icons/fa";
// Import các hàm tiện ích từ utils
import { formatPrice, getStockStatus, generateProductUrl } from "../../utils";

const CardProduct = ({
    id,
    name = "Tên sản phẩm",
    imageUrl = "https://via.placeholder.com/300x240?text=No+Image",
    price = 0,
    stock = 0,
    category,
    desc,
}) => {
    // Generate product URL sử dụng hàm từ utils
    const productUrl = generateProductUrl(id);

    // Get stock status sử dụng hàm từ utils
    const stockStatus = getStockStatus(stock);

    return (
        <NavLink to={productUrl} className="block bg-white cursor-pointer rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 group">
            {/* Product Image */}
            <div className="relative">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = "https://spencil.vn/wp-content/uploads/2024/11/chup-anh-san-pham-SPencil-Agency-1.jpg";
                        }}
                    />

                {/* Category Tag - Modern style */}
                {category && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                            {category.name}
                        </span>
                    </div>
                )}

                {/* Stock overlay for out of stock */}
                {stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">HẾT HÀNG</span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                {/* Product Name */}
                <h3 className="text-gray-800 line-clamp-1 font-medium text-base leading-6 ">
                    {name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm line-clamp-2">
                    {desc}
                </p>

                {/* Price Section */}
                <div>
                    <div className="text-red-600 font-bold text-xl">
                        {formatPrice(price)}
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex items-center justify-between border-t border-gray-100">
                    {/* Stock info */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stockStatus.color}`}></div>
                        <span className={`text-xs font-medium ${stockStatus.textColor}`}>
                            {stockStatus.text}
                        </span>
                    </div>

                    {/* View count placeholder */}
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <FaEye size={12} />
                        <span>{Math.floor(Math.random() * 1000) + 100}</span>
                    </div>
                </div>

                {/* Action button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm">
                    Xem chi tiết →
                </button>
            </div>
        </NavLink>
    );
};

export default CardProduct;