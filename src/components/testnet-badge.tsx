'use client';

import { useState } from 'react';

export default function TestnetBadge() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="relative">
      <div 
        className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 cursor-help"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        Testnet Only
      </div>
      
      {isTooltipVisible && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-10 w-64 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm">
          Currently supporting Sepolia and Base Sepolia testnets only
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 rotate-45 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
}
