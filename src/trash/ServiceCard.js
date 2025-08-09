import React from "react";

const CardService = ({ icon, title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-32 shadow-sm hover:shadow-md border  transition w-full cursor-pointer">
            <div className="text-4xl text-red-500 mb-2">{icon}</div>
            <p className="text-sm text-center font-medium text-gray-700">{title}</p>
        </div>
    );
};

export default CardService;
