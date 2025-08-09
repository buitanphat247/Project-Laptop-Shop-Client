import React from 'react';
import { FaStar } from 'react-icons/fa';

const CardReview = ({ name, avatarUrl, rating, comment }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition duration-300 p-4 max-w-sm w-full">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-3">
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                        <h4 className="text-base font-semibold text-gray-800">{name}</h4>
                        <div className="flex text-yellow-400 text-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar key={i} className={i < rating ? '' : 'text-gray-300'} />
                            ))}
                        </div>
                    </div>
            </div>

            {/* Comment */}
            <p className="text-gray-600 text-sm leading-relaxed">
                "{comment}"
            </p>
        </div>
    );
};

export default CardReview;
