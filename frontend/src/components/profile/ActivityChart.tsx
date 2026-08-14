'use client';

import React from 'react';
import { ActivityDay } from '@/types/learning';

interface ActivityChartProps {
  data: ActivityDay[];
  maxHeight?: number;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data, maxHeight = 80 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-end justify-center gap-1.5 h-20">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 bg-[#2b3840] rounded-t-lg" style={{ height: '8px' }} />
        ))}
      </div>
    );
  }

  const maxXP = Math.max(...data.map((d) => d.xp), 1);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-1.5" style={{ height: maxHeight }}>
        {data.map((day) => {
          const height = Math.max((day.xp / maxXP) * maxHeight, day.xp > 0 ? 6 : 4);
          const isEmpty = day.xp === 0;
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center justify-end gap-1">
              {day.xp > 0 && (
                <span className="text-[9px] font-black text-[#58cc02]">{day.xp}</span>
              )}
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  isEmpty ? 'bg-[#2b3840]' : 'bg-[#58cc02]'
                }`}
                style={{ height: `${height}px` }}
              />
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex justify-between gap-1.5">
        {data.map((day) => (
          <div key={day.date} className="flex-1 text-center">
            <span className="text-[10px] font-bold text-[#52656d]">
              {formatDate(day.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
