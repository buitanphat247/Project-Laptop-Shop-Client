import React from 'react';
import { FaFacebook, FaBehance } from 'react-icons/fa';

const items = [
  { icon: <FaBehance />, label: 'Behance' },
  { icon: <FaFacebook />, label: 'Facebook' },
  { icon: <FaBehance />, label: 'Behance' },
  { icon: <FaFacebook />, label: 'Facebook' },
  { icon: <FaBehance />, label: 'Behance' },
  { icon: <FaFacebook />, label: 'Facebook' },
  { icon: <FaBehance />, label: 'Behance' },
  { icon: <FaFacebook />, label: 'Facebook' },
];

const MarqueeBar = () => (
  <div className="fixed top-0 left-0 w-full z-50 bg-neutral-800 overflow-hidden h-10 flex items-center border-b border-neutral-700">
    <div className="whitespace-nowrap animate-marquee text-white font-semibold text-base flex items-center">
      {items.map((item, idx) => (
        <span key={idx} className="mx-8 flex items-center gap-2">
          {item.icon} {item.label}
        </span>
      ))}
      {/* Lặp lại để tạo hiệu ứng liên tục */}
      {items.map((item, idx) => (
        <span key={idx + items.length} className="mx-8 flex items-center gap-2">
          {item.icon} {item.label}
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeBar;