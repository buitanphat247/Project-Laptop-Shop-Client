import React from 'react';
import { FaBoxOpen } from 'react-icons/fa'; // icon có thể đổi tùy danh mục

const SectionBar = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-md border border-gray-200 shadow-sm mb-4">
      <div className="text-blue-600 text-xl">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

export default SectionBar;
