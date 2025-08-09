import React from 'react';

const CardNews = ({ title, description, imageUrl, date }) => {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden border border-transparent hover:border-blue-500 cursor-pointer">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{date}</p>
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {description}
                </p>
                <button className="mt-4 text-blue-600 hover:underline font-medium">
                    Xem thêm →
                </button>
            </div>
        </div>
    );
};

export default CardNews;
