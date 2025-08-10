import React from "react";
import { NavLink } from "react-router-dom";
import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
// Import các hàm tiện ích từ utils
import {
    generateNewsUrl,
    formatNewsDate,
    getAuthorName,
    generateViewCount,
    formatViewCount
} from "../../utils";

const NewsCard = ({
    id,
    title = "Tiêu đề tin tức",
    slug,
    desc = "Tóm tắt nội dung bài viết...",
    thumbnail = "https://caodem.com/wp-content/uploads/2019/12/phong-nen-tin-tuc-thoi-su-caodem.com_.jpg",
    createdAt,
    author = { fullName: "Admin" },
    published = true,
}) => {
    // Generate news URL sử dụng hàm từ utils
    const newsUrl = generateNewsUrl(id, slug);

    // Format date sử dụng hàm từ utils
    const formatDate = formatNewsDate;

    // Get author name sử dụng hàm từ utils
    const getAuthorNameFromProps = () => getAuthorName(author);

    // Generate random view count sử dụng hàm từ utils
    const generateViewCountFromProps = () => generateViewCount(id);

    // Format view count sử dụng hàm từ utils
    const formatViewCountFromProps = formatViewCount;

    const viewCount = generateViewCountFromProps();

    return (
        <div className="bg-white cursor-pointer rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 group">
            {/* News Image */}
            <div className="relative">
                    <img
                        src={thumbnail || 'https://caodem.com/wp-content/uploads/2019/12/phong-nen-tin-tuc-thoi-su-caodem.com_.jpg'}
                        alt={title}
                        className="w-full h-40 sm:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = "https://caodem.com/wp-content/uploads/2019/12/phong-nen-tin-tuc-thoi-su-caodem.com_.jpg";
                        }}
                    />

                {/* Published Badge - Modern style */}
                {published && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                            Đã xuất bản
                        </span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 lg:p-5">
                {/* News Title */}
                <h3 className="text-gray-800 font-medium text-sm sm:text-base lg:text-base leading-6 mb-2 sm:mb-3 line-clamp-1">
                    {title}
                </h3>

                {/* News Description */}
                <p className="text-gray-500 text-xs sm:text-sm lg:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {desc}
                </p>

                {/* Meta Info Section */}
                <div className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                            <UserOutlined />
                            <span className="text-xs sm:text-xs lg:text-xs">{getAuthorNameFromProps()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarOutlined />
                            <span className="text-xs sm:text-xs lg:text-xs">{formatDate(createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                    {/* View count */}
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <EyeOutlined />
                        <span className="text-xs sm:text-xs lg:text-xs">{formatViewCountFromProps(viewCount)} lượt xem</span>
                    </div>

                    {/* Read more indicator */}
                    <div className="text-blue-600 text-xs font-medium">
                        Đọc thêm
                    </div>
                </div>

                {/* Action button */}
                <NavLink to={newsUrl} className="hidden lg:block mt-3 sm:mt-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 lg:py-3 px-3 sm:px-4 lg:px-4 rounded-lg transition-colors duration-200 text-xs sm:text-sm lg:text-sm">
                        Xem chi tiết →
                    </button>
                </NavLink>
            </div>
        </div>
    );
};

export default NewsCard;