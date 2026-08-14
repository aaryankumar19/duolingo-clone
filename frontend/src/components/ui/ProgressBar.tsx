import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'bg-[#58cc02]',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        'w-full h-4 bg-[#e5e5e5] rounded-full overflow-hidden relative',
        className
      )}
    >
      <div
        className={cn('h-full transition-all duration-300 rounded-full relative', color)}
        style={{ width: `${percentage}%` }}
      >
        {percentage > 10 && (
          <div className="absolute top-1/2 left-2 -translate-y-1/2 w-4/5 h-1 bg-white/30 rounded-full" />
        )}
      </div>
    </div>
  );
};
