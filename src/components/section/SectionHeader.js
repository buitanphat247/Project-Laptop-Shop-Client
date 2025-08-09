import React from 'react';
import { useNavigate } from "react-router";

const SectionHeader = ({ title }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/products');
    };

    return (
        <div className="flex items-center justify-between mb-4 px-4 py-2 bg-gray-100 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
                onClick={handleClick}
                className="text-blue-600 hover:underline font-medium"
            >
                Xem thêm
            </button>
        </div>
    );
};

export default SectionHeader;
