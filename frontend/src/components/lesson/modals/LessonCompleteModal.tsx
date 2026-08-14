'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, Target, Flame, Check } from 'lucide-react';
import { ES } from 'country-flag-icons/react/3x2';
import { modalPop } from '@/lib/animations/variants';
import { playSound } from '@/lib/sounds/sound';
import { lessonApi } from '@/lib/api/lesson/api';
import { useAuthStore } from '@/store/use-auth-store';
import { useLessonStore } from '@/store/lesson-store';
import { useLearningPath } from '@/hooks/use-learning-path';

interface Props {
  lessonId: string | null;
  totalXP: number;
  accuracy: number;
  correctCount: number;
  totalExercises: number;
}

const DAYS_SHORT = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];

export const LessonCompleteModal: React.FC<Props> = ({
  lessonId,
  totalXP,
  accuracy,
  correctCount,
  totalExercises,
}) => {
  const router = useRouter();
  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);
  const setCompletionResult = useLessonStore((s) => s.setCompletionResult);
  const { data: pathData } = useLearningPath();

  const [earnedXP, setEarnedXP] = useState(totalXP || 15);
  const [streak, setStreak] = useState(user?.streak ?? 1);
  const [completed, setCompleted] = useState(false);
  const [step, setStep] = useState<number>(0); // 0: Lesson Complete, 1: Streak Milestone, 2: Unlocked Score

  const courseTitle = pathData?.courseTitle || 'Spanish';

  useEffect(() => {
    playSound('lesson-complete');
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#58cc02', '#ffc800', '#1cb0f6', '#ff4b4b', '#a855f7'],
    });

    const doComplete = async () => {
      if (!lessonId || completed) return;
      try {
        const result = await lessonApi.completeLesson(lessonId);
        const xp = result.xp_earned ?? result.xp_awarded ?? (totalXP || 15);
        const serverStreak = result.streak_count ?? result.streak;
        const newStreak = serverStreak !== undefined && serverStreak !== null ? serverStreak : Math.max(1, user?.streak ?? 1);
        setEarnedXP(xp);
        setStreak(newStreak);
        setCompletionResult(xp, newStreak);

        updateUser({
          xp: result.total_xp ?? ((user?.xp ?? 0) + xp),
          streak: newStreak,
        });
        setCompleted(true);
      } catch {
        const finalStreak = Math.max(1, user?.streak ?? 1);
        setStreak(finalStreak);
        setCompletionResult(totalXP || 15, finalStreak);
        setCompleted(true);
      }
    };


    doComplete();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayAccuracy = Math.round(
    totalExercises > 0 ? (correctCount / totalExercises) * 100 : accuracy || 100
  );

  // Compute 5-day calendar tracker starting from today
  const todayIdx = new Date().getDay();
  const streakDays = Array.from({ length: 5 }).map((_, i) => {
    const idx = (todayIdx + i) % 7;
    return {
      label: DAYS_SHORT[idx],
      isToday: i === 0,
    };
  });

  const handleNextStep = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else {
      router.push('/learn');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131f24] text-white flex flex-col items-center justify-between p-6 select-none font-sans overflow-hidden">
      {/* Top Sparkles / Loading dots */}
      <div className="w-full flex justify-center pt-4">
        <div className="flex items-center gap-1.5 opacity-60">
          <div className="w-1.5 h-1.5 bg-[#ffc800] rounded-full animate-ping" />
          <div className="w-1.5 h-1.5 bg-[#58cc02] rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-[#1cb0f6] rounded-full animate-ping" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 0: Lesson Complete Screen */}
        {step === 0 && (
          <motion.div
            key="step-0"
            variants={modalPop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-center justify-center my-auto w-full max-w-lg text-center"
          >
            {/* Mascot */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 relative mb-4">
              <Image
                src="/duo/duo_happy.svg"
                alt="Celebrating Duo"
                width={176}
                height={176}
                className="w-full h-full object-contain animate-bounce"
              />
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#ffc800] mb-8 tracking-tight">
              Lesson Complete!
            </h1>

            {/* Stats Grid Cards */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm sm:max-w-md mx-auto">
              {/* Card 1: TOTAL XP */}
              <div className="flex flex-col items-center">
                <div className="w-full bg-[#ffc800] text-[#131f24] font-black text-xs uppercase tracking-wider py-1.5 rounded-t-2xl shadow-sm text-center">
                  TOTAL XP
                </div>
                <div className="w-full bg-[#202f36] border-2 border-[#ffc800] border-t-0 rounded-b-2xl p-4 sm:p-5 flex items-center justify-center gap-2 shadow-lg">
                  <Zap className="w-6 h-6 text-[#ffc800] fill-[#ffc800]" />
                  <span className="text-2xl sm:text-3xl font-black text-[#ffc800]">
                    {earnedXP}
                  </span>
                </div>
              </div>

              {/* Card 2: AMAZING / ACCURACY */}
              <div className="flex flex-col items-center">
                <div className="w-full bg-[#58cc02] text-[#131f24] font-black text-xs uppercase tracking-wider py-1.5 rounded-t-2xl shadow-sm text-center">
                  AMAZING
                </div>
                <div className="w-full bg-[#202f36] border-2 border-[#58cc02] border-t-0 rounded-b-2xl p-4 sm:p-5 flex items-center justify-center gap-2 shadow-lg">
                  <Target className="w-6 h-6 text-[#58cc02]" />
                  <span className="text-2xl sm:text-3xl font-black text-[#58cc02]">
                    {displayAccuracy}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 1: Streak Milestone Screen (Screenshot 2) */}
        {step === 1 && (
          <motion.div
            key="step-1"
            variants={modalPop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-center justify-center my-auto w-full max-w-lg text-center"
          >
            {/* Animated Flame */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative mb-2 flex items-center justify-center">
              <Flame className="w-20 h-20 text-[#ff9600] fill-[#ff9600] animate-bounce drop-shadow-[0_0_20px_rgba(255,150,0,0.5)]" />
            </div>

            {/* Streak Number & Label */}
            <h1 className="text-6xl sm:text-7xl font-black text-[#ff9600] tracking-tight leading-none">
              {streak}
            </h1>
            <p className="text-lg sm:text-xl font-extrabold text-[#ff9600] mt-1 mb-8 tracking-wide">
              day streak
            </p>

            {/* Calendar Tracker Box */}
            <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-2xl p-5 sm:p-6 w-full max-w-sm mx-auto shadow-xl flex flex-col items-center">
              {/* Days Row */}
              <div className="flex items-center justify-between w-full px-2 mb-4">
                {streakDays.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-xs font-black text-[#778e9a] uppercase">
                      {day.label}
                    </span>
                    {day.isToday ? (
                      <div className="w-9 h-9 rounded-full bg-[#ff9600] text-[#131f24] flex items-center justify-center shadow-md">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#2b3840]" />
                    )}
                  </div>
                ))}
              </div>

              {/* Notice Subtext */}
              <p className="text-xs font-bold text-[#778e9a] leading-relaxed pt-3 border-t border-[#2b3840] w-full text-center">
                Practice each day so your streak won&apos;t reset!
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Unlocked Course Score Screen (Screenshot 1) */}
        {step === 2 && (
          <motion.div
            key="step-2"
            variants={modalPop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-center justify-center my-auto w-full max-w-lg text-center"
          >
            {/* Duo Mascot sitting/reading */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 relative mb-6">
              <Image
                src="/duo/duo_thinking.svg"
                alt="Duolingo Mascot"
                width={176}
                height={176}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Score Flag Badge */}
            <div className="flex items-center justify-center gap-3 bg-[#131f24] border-2 border-[#2b3840] rounded-2xl px-6 py-3 shadow-lg mb-6">
              <ES className="w-8 h-6 rounded-xs shadow-xs object-cover" />
              <span className="text-4xl font-black text-white">1</span>
            </div>

            {/* Unlocked Message */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-white max-w-xs leading-snug">
              You unlocked your Duolingo {courseTitle} Score!
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Footer Actions */}
      <footer className="w-full max-w-4xl mx-auto flex items-center justify-between pb-4 pt-2 border-t-2 border-[#2b3840]/60">
        {step < 2 ? (
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-3.5 bg-[#202f36] hover:bg-[#2b3840] border-2 border-[#2b3840] text-[#778e9a] hover:text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_4px_0_0_#192226] active:translate-y-[2px] transition-all cursor-pointer"
          >
            REVIEW LESSON
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNextStep}
          className={`px-10 py-3.5 border-b-4 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition cursor-pointer ${
            step === 0
              ? 'bg-[#58cc02] hover:bg-[#46a302] border-[#388401] active:border-b-0 active:translate-y-[2px]'
              : 'bg-[#1cb0f6] hover:bg-[#1899d6] border-[#1479ab] active:border-b-0 active:translate-y-[2px]'
          }`}
        >
          CONTINUE
        </button>
      </footer>
    </div>
  );
};
