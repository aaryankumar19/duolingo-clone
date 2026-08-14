'use client';

import React from 'react';
import { Achievement } from '@/types/profile';
import { Flame, Zap, GraduationCap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  achievement: Achievement;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Zap,
  GraduationCap,
};

export const AchievementBadge: React.FC<Props> = ({ achievement }) => {
  const Icon = ICON_MAP[achievement.icon] || Award;
  const progressPercent = Math.min(100, (achievement.progress / achievement.maxProgress) * 100);

  return (
    <div
      className={cn(
        'p-5 rounded-3xl border-2 flex items-center gap-5 transition-all',
        achievement.unlocked
          ? 'bg-white border-gray-200 shadow-xs'
          : 'bg-gray-50 border-gray-200 opacity-60'
      )}
    >
      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-md border-b-4',
          achievement.unlocked
            ? 'bg-[#FFC800] border-[#E5B200]'
            : 'bg-gray-300 border-gray-400'
        )}
      >
        <Icon className="w-8 h-8" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-extrabold text-base text-gray-800">{achievement.title}</h4>
          <span className="text-xs font-bold text-gray-400">
            Level {achievement.level}/{achievement.maxLevel}
          </span>
        </div>
        <p className="text-xs font-semibold text-gray-500 mb-2">{achievement.description}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#FFC800] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
