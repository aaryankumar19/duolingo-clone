'use client';

import React from 'react';
import { CheckCircle2, Lock, Star } from 'lucide-react';
import { Achievement } from '@/lib/api/profile/api';

const ICON_MAP: Record<string, string> = {
  Flame: '🔥',
  Zap: '⚡',
  GraduationCap: '🎓',
  Star: '⭐',
  Trophy: '🏆',
  Heart: '❤️',
  Crown: '👑',
  Gem: '💎',
  Target: '🎯',
  Shield: '🛡️',
  Sparkles: '✨',
  BookOpen: '📖',
};

interface Props {
  achievement: Achievement;
}

export const AchievementBadge: React.FC<Props> = ({ achievement }) => {
  const emoji = ICON_MAP[achievement.icon] || '🏅';
  const pct = achievement.maxProgress > 0
    ? Math.min((achievement.progress / achievement.maxProgress) * 100, 100)
    : 0;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
        achievement.unlocked
          ? 'bg-[#202f36] border-[#2b3840]'
          : 'bg-[#1a2830] border-[#202f36] opacity-70'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${
          achievement.unlocked
            ? 'bg-[#131f24] border-[#37464f] shadow-inner'
            : 'bg-[#131f24] border-[#2b3840]'
        }`}
      >
        {achievement.unlocked ? emoji : <Lock className="w-5 h-5 text-[#52656d]" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-extrabold text-white truncate">{achievement.title}</p>
          {achievement.unlocked && (
            <CheckCircle2 className="w-4 h-4 text-[#58cc02] shrink-0" />
          )}
        </div>
        <p className="text-xs font-bold text-[#778e9a] mb-2">{achievement.description}</p>

        {/* Progress bar */}
        {achievement.maxProgress > 0 && (
          <div className="w-full h-2 bg-[#131f24] rounded-full overflow-hidden border border-[#2b3840]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                achievement.unlocked ? 'bg-[#58cc02]' : 'bg-[#37464f]'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}

        {achievement.maxProgress > 0 && (
          <p className="text-[10px] font-bold text-[#52656d] mt-1">
            {achievement.progress} / {achievement.maxProgress}
          </p>
        )}

        {achievement.unlocked && achievement.unlockedAt && (
          <p className="text-[10px] font-bold text-[#58cc02]/70 mt-1">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Level stars */}
      {achievement.maxLevel > 1 && (
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          {Array.from({ length: Math.min(achievement.maxLevel, 5) }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < achievement.level ? 'text-[#ffc800] fill-[#ffc800]' : 'text-[#2b3840] fill-[#2b3840]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
