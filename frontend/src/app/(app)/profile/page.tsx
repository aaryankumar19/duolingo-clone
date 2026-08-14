'use client';

import React from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { mockAchievements } from '@/lib/api/profile/api';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const username = user?.username || 'Learner';
  const stats = {
    streakDays: user?.streak || 1,
    totalXP: user?.xp || 0,
    currentLeague: 'Bronze League',
    top3Finishes: 1,
  };

  return (
    <div className="pb-12 max-w-2xl mx-auto">
      <ProfileHeader username={username} stats={stats} />

      <div className="px-4 mt-6">
        <h2 className="text-xl font-extrabold text-[#4b4b4b] mb-4 uppercase tracking-wider">
          Achievements
        </h2>
        <div className="flex flex-col gap-3">
          {mockAchievements.map((ach) => (
            <AchievementBadge key={ach.id} achievement={ach} />
          ))}
        </div>
      </div>
    </div>
  );
}
