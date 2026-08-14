'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/use-auth-store';
import { profileApi, Achievement } from '@/lib/api/profile/api';
import { ES } from 'country-flag-icons/react/3x2';
import { AppHeader } from '@/components/layout/AppHeader';
import {
  Flame, Zap, Shield, Medal, Pencil, ChevronRight, Search,
  Mail, UserPlus, Loader2,
} from 'lucide-react';

// ─── Mock data for unsupported features ───────────────────────────────────────
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'wildfire',
    title: 'Wildfire',
    description: 'Reach a 3 day streak',
    icon: 'Flame',
    level: 1,
    maxLevel: 3,
    progress: 1,
    maxProgress: 3,
    unlocked: true,
    unlockedAt: null,
  },
  {
    id: 'sage',
    title: 'Sage',
    description: 'Earn 100 XP',
    icon: 'Zap',
    level: 1,
    maxLevel: 5,
    progress: 15,
    maxProgress: 100,
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 'champion',
    title: 'Champion',
    description: 'Unlock Leaderboards by completing 10 lessons',
    icon: 'Trophy',
    level: 1,
    maxLevel: 5,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null,
  },
];

// ─── Achievement badge colours by icon ───────────────────────────────────────
const BADGE_STYLES: Record<string, { bg: string; emoji: string }> = {
  Flame:  { bg: 'bg-[#ff4b4b]', emoji: '🔥' },
  Zap:    { bg: 'bg-[#77c200]', emoji: '🧙' },
  Trophy: { bg: 'bg-[#9c44d0]', emoji: '🛡️' },
  Star:   { bg: 'bg-[#ffc800]', emoji: '⭐' },
  Crown:  { bg: 'bg-[#ffc800]', emoji: '👑' },
  Shield: { bg: 'bg-[#1cb0f6]', emoji: '🛡️' },
  Medal:  { bg: 'bg-[#ff9600]', emoji: '🏅' },
};

function getBadgeStyle(icon: string) {
  return BADGE_STYLES[icon] ?? { bg: 'bg-[#58cc02]', emoji: '🏅' };
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex-1 bg-[#202f36] border border-[#2b3840] rounded-2xl p-4 flex items-center gap-3 min-w-0">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xl font-extrabold text-white leading-tight">{value}</p>
        <p className="text-xs font-bold text-[#778e9a]">{label}</p>
      </div>
    </div>
  );
}

// ─── Achievement badge ────────────────────────────────────────────────────────
function AchievementRow({ ach }: { ach: Achievement }) {
  const style = getBadgeStyle(ach.icon);
  const pct = ach.maxProgress > 0 ? Math.min((ach.progress / ach.maxProgress) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-[#2b3840] last:border-b-0">
      {/* Badge */}
      <div className={`w-[72px] h-[72px] rounded-2xl ${style.bg} flex items-center justify-center shrink-0 relative shadow-lg`}>
        <span className="text-3xl">{style.emoji}</span>
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 rounded-b-2xl text-center text-[8px] font-extrabold text-white uppercase tracking-widest py-0.5">
          Level {ach.level}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-extrabold text-white">{ach.title}</p>
          <p className="text-xs font-bold text-[#778e9a]">{ach.progress}/{ach.maxProgress}</p>
        </div>
        <div className="w-full h-3 bg-[#2b3840] rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? '#58cc02' : '#ffc800',
            }}
          />
        </div>
        <p className="text-xs font-bold text-[#778e9a]">{ach.description}</p>
      </div>
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuthStore();
  const [socialTab, setSocialTab] = useState<'following' | 'followers'>('following');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getUserProfile,
    staleTime: 1000 * 60,
  });

  const { data: backendAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: profileApi.getAchievements,
    staleTime: 1000 * 60 * 5,
  });

  const username = user?.username || 'Learner';
  // Extract a cleaner display name: take the first part before underscore/numbers
  const displayName = username.split(/[_\d]/)[0] || username;
  // Capitalize first letter
  const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const streak = stats?.streakDays ?? user?.streak ?? 0;
  const totalXP = stats?.totalXP ?? user?.xp ?? 0;
  const gems = stats?.gems ?? user?.gems ?? 0;
  const hearts = stats?.hearts ?? user?.hearts ?? 5;

  // Use backend achievements if available, otherwise fall back to mocked ones
  const achievements =
    backendAchievements && backendAchievements.length > 0
      ? backendAchievements
      : MOCK_ACHIEVEMENTS.map((a) => ({
          ...a,
          progress: a.id === 'sage' ? totalXP : a.id === 'wildfire' ? streak : a.progress,
        }));

  // Joined date — mock since not in backend
  const joinedDate = React.useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, []);

  return (
    <div className="w-full max-w-[1056px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-6 lg:gap-10 py-2">

      {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-0">

        {/* ── Avatar Card ────────────────────────────────────────────── */}
        <div className="bg-[#202f36] rounded-3xl overflow-hidden mb-5">
          {/* Big avatar area */}
          <div className="relative h-48 flex items-center justify-center bg-[#1a2830]">
            {/* Edit pencil */}
            <button className="absolute top-4 right-4 w-9 h-9 bg-[#202f36] border border-[#2b3840] rounded-xl flex items-center justify-center hover:bg-[#2b3840] transition cursor-pointer">
              <Pencil className="w-4 h-4 text-[#778e9a]" />
            </button>

            {user?.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={username}
                width={120}
                height={120}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#2b3840]"
              />
            ) : (
              /* Dashed silhouette placeholder — matching the screenshot */
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 144 144" className="absolute inset-0 w-full h-full" fill="none">
                  {/* Dashed border circle */}
                  <circle
                    cx="72" cy="72" r="70"
                    stroke="#4a6470"
                    strokeWidth="2.5"
                    strokeDasharray="8 5"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Person silhouette */}
                <svg viewBox="0 0 80 90" className="w-24 h-24 text-[#4a6470]" fill="currentColor">
                  {/* Head */}
                  <ellipse cx="40" cy="22" rx="18" ry="20" />
                  {/* Body */}
                  <path d="M12 72 Q12 50 40 50 Q68 50 68 72 L68 90 L12 90 Z" />
                  {/* Plus icon in center */}
                  <text x="40" y="70" textAnchor="middle" fontSize="20" fill="#778e9a" fontWeight="bold">+</text>
                </svg>
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="px-5 py-4">
            <h1 className="text-2xl font-extrabold text-white mb-0.5">{formattedName}</h1>
            <p className="text-sm font-bold text-[#778e9a] mb-0.5">{username}</p>
            <p className="text-sm font-bold text-[#778e9a] mb-3">Joined {joinedDate}</p>

            {/* Following / Followers + flag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="text-sm font-extrabold text-[#1cb0f6] hover:underline cursor-pointer">
                  <span className="text-white">0</span> Following
                </button>
                <button className="text-sm font-extrabold text-[#1cb0f6] hover:underline cursor-pointer">
                  <span className="text-white">0</span> Followers
                </button>
              </div>
              {/* Language flag SVG */}
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#2b3840] flex items-center justify-center bg-[#131f24] shrink-0">
                <ES className="w-6 h-4 rounded-xs shadow-xs object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2b3840] mb-5" />

        {/* ── Statistics ─────────────────────────────────────────────── */}
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-white mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Flame className="w-7 h-7 fill-[#ff9600] text-[#ff9600]" />}
              value={streak}
              label="Day streak"
            />
            <StatCard
              icon={<Zap className="w-7 h-7 fill-[#ffc800] text-[#ffc800]" />}
              value={totalXP.toLocaleString()}
              label="Total XP"
            />
            <StatCard
              icon={<Shield className="w-7 h-7 text-[#778e9a]" />}
              value="None"
              label="Current league"
            />
            <StatCard
              icon={<Medal className="w-7 h-7 text-[#778e9a]" />}
              value={0}
              label="Top 3 finishes"
            />
          </div>
        </div>

        {/* ── Achievements ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-white">Achievements</h2>
            <button className="text-sm font-extrabold text-[#1cb0f6] hover:underline uppercase tracking-wider cursor-pointer">
              View All
            </button>
          </div>

          {achievementsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#58cc02] animate-spin" />
            </div>
          ) : (
            <div className="bg-[#202f36] border border-[#2b3840] rounded-3xl px-5">
              {achievements.slice(0, 6).map((ach) => (
                <AchievementRow key={ach.id} ach={ach} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT COLUMN ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-4 w-[310px] shrink-0">

        {/* Stats bar */}
        <AppHeader />

        {/* Following / Followers tab card */}
        <div className="bg-[#202f36] border border-[#2b3840] rounded-3xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#2b3840]">
            {(['following', 'followers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSocialTab(tab)}
                className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-widest transition cursor-pointer ${
                  socialTab === tab
                    ? 'text-[#1cb0f6] border-b-2 border-[#1cb0f6] -mb-px'
                    : 'text-[#778e9a] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-col items-center px-5 py-6 text-center gap-3">
            {/* Duolingo friends illustration */}
            <div className="w-full overflow-hidden rounded-xl">
              <img
                src="/duo/friends_group.jpg"
                alt="Friends Group"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
            <p className="text-sm font-bold text-[#778e9a] leading-relaxed">
              Learning is more fun and effective when you connect with others.
            </p>
          </div>
        </div>

        {/* Add friends */}
        <div className="bg-[#202f36] border border-[#2b3840] rounded-3xl p-5">
          <h3 className="text-sm font-extrabold text-white mb-3">Add friends</h3>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-3 hover:bg-[#2b3840] rounded-2xl transition cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#131f24] border border-[#2b3840] flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-[#778e9a]" />
              </div>
              <span className="text-sm font-extrabold text-white flex-1 text-left">Find friends</span>
              <ChevronRight className="w-4 h-4 text-[#52656d] group-hover:text-[#778e9a]" />
            </button>
            <button className="flex items-center gap-3 px-3 py-3 hover:bg-[#2b3840] rounded-2xl transition cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#131f24] border border-[#2b3840] flex items-center justify-center shrink-0 overflow-hidden">
                <Image src="/duo/duo_happy.svg" alt="Duo" width={28} height={28} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-extrabold text-white flex-1 text-left">Invite friends</span>
              <ChevronRight className="w-4 h-4 text-[#52656d] group-hover:text-[#778e9a]" />
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 pb-4">
          {['About', 'Blog', 'Store', 'Efficacy', 'Careers', 'Investors', 'Terms', 'Privacy'].map((link) => (
            <button key={link} className="text-[11px] font-bold text-[#52656d] hover:text-[#778e9a] uppercase tracking-wider cursor-pointer transition">
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
