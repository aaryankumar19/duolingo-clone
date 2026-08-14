'use client';

import React from 'react';
import { Lock, Crown, Star, BookOpen, Utensils, MessageCircle, Compass, Users, Dog } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SkillStatus } from '@/types/learning';

interface Props {
  id: string;
  title: string;
  iconName: string;
  status: SkillStatus;
  progress: number;
  totalLessons: number;
  crowns: number;
  index: number;
  onClick: (id: string, event: React.MouseEvent) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  MessageCircle,
  Utensils,
  Dog,
  Compass,
  Users,
};

export const SkillNode: React.FC<Props> = ({
  id,
  title,
  iconName,
  status,
  progress,
  totalLessons,
  crowns,
  index,
  onClick,
}) => {
  const IconComponent = ICON_MAP[iconName] || Star;

  // Duolingo characteristic winding path offsets
  const offsets = [0, -45, -60, -45, 0, 45, 60, 45];
  const offsetX = offsets[index % offsets.length];

  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  return (
    <div
      className="relative flex flex-col items-center my-4 select-none"
      style={{ transform: `translateX(${offsetX}px)` }}
    >
      {/* Node Button */}
      <motion.button
        whileHover={!isLocked ? { scale: 1.08 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        onClick={(e) => !isLocked && onClick(id, e)}
        disabled={isLocked}
        className={cn(
          'relative w-20 h-20 rounded-full flex items-center justify-center border-b-8 transition-all duration-150 shadow-md',
          isCompleted && 'bg-[#FFC800] border-[#E5B200] text-white',
          isActive && 'bg-[#58CC02] border-[#46A302] text-white ring-8 ring-[#58CC02]/20',
          isLocked && 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
        )}
      >
        {isLocked ? (
          <Lock className="w-8 h-8" />
        ) : (
          <IconComponent className="w-9 h-9 stroke-[2.5]" />
        )}

        {/* Crown badge */}
        {crowns > 0 && (
          <div className="absolute -top-2 -right-1 bg-[#FFC800] text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <Crown className="w-3.5 h-3.5 fill-white" />
          </div>
        )}
      </motion.button>

      {/* Progress ring or title */}
      <div className="mt-2 text-center">
        <span
          className={cn(
            'text-xs font-extrabold uppercase tracking-wide',
            isActive ? 'text-[#58CC02]' : isCompleted ? 'text-[#FFC800]' : 'text-gray-400'
          )}
        >
          {title}
        </span>
        {isActive && (
          <div className="text-[11px] font-bold text-gray-500">
            {progress}/{totalLessons} LESSONS
          </div>
        )}
      </div>
    </div>
  );
};
