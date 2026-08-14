'use client';

import React from 'react';

interface Props {
  current: number;
  total: number;
}

export const LessonProgress: React.FC<Props> = ({ current, total }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
      <div
        className="bg-[#58CC02] h-full rounded-full transition-all duration-300 relative"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30 rounded-r-full" />
      </div>
    </div>
  );
};
