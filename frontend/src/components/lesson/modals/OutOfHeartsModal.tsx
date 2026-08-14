'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gem, RotateCcw, Loader2, X } from 'lucide-react';
import { userApi } from '@/lib/api/user/api';
import { useAuthStore } from '@/store/use-auth-store';
import { useLessonStore } from '@/store/lesson-store';

interface Props {
  onRetry: () => void;
}

export const OutOfHeartsModal: React.FC<Props> = ({ onRetry }) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const gems = user?.gems ?? 0;
  const [isRefilling, setIsRefilling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startLesson = useLessonStore((s) => s.startLesson);
  const lesson = useLessonStore((s) => s.lesson);

  const canRefill = gems >= 100;

  const handleRefill = async () => {
    if (!canRefill) {
      setError('You need at least 100 💎 gems to refill hearts.');
      return;
    }
    setIsRefilling(true);
    setError(null);
    try {
      const result = await userApi.refillHearts();
      useAuthStore.getState().updateUser({ hearts: result.hearts, gems: result.gems ?? gems - 100 });
      if (lesson) {
        startLesson(lesson, result.hearts);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to refill hearts. Try again.');
    } finally {
      setIsRefilling(false);
    }
  };

  const handleEndLesson = () => {
    router.push('/learn');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Red gradient header */}
          <div className="bg-gradient-to-b from-[#FF4B4B] to-[#E02020] pt-8 pb-10 px-6 flex flex-col items-center relative">
            {/* Broken heart icon with pulse */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeInOut' }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              <span className="text-5xl select-none">💔</span>
            </motion.div>

            <h2 className="text-2xl font-extrabold text-white text-center leading-tight mb-1">
              You ran out of hearts!
            </h2>
            <p className="text-white/80 text-sm font-semibold text-center">
              Don't give up — refill and keep going!
            </p>

            {/* Empty hearts row */}
            <div className="flex items-center gap-1.5 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 400 }}
                >
                  <Heart className="w-6 h-6 text-white/30" strokeWidth={2.5} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 flex flex-col gap-3">
            {/* Gem balance */}
            <div className="flex items-center justify-between bg-[#f7f7f7] rounded-2xl px-4 py-3 border border-gray-100">
              <span className="text-sm font-bold text-gray-500">Your gems</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl">💎</span>
                <span className={`text-lg font-extrabold ${canRefill ? 'text-[#1cb0f6]' : 'text-[#ff4b4b]'}`}>
                  {gems}
                </span>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Refill hearts */}
            <button
              onClick={handleRefill}
              disabled={isRefilling || !canRefill}
              className="w-full py-4 bg-[#ff4b4b] hover:bg-[#e03e3e] disabled:bg-gray-200 disabled:text-gray-400 border-b-4 border-[#c83030] disabled:border-gray-300 active:border-b-0 active:translate-y-[2px] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isRefilling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white stroke-none" />
                  <span>Refill Hearts</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">100 💎</span>
                </>
              )}
            </button>

            {/* Try again button */}
            <button
              onClick={onRetry}
              className="w-full py-3.5 bg-[#1CB0F6] hover:bg-[#1899D6] border-b-4 border-[#1079ae] active:border-b-0 active:translate-y-[2px] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            {/* Exit */}
            <button
              onClick={handleEndLesson}
              className="w-full py-3 text-gray-400 hover:text-gray-600 font-extrabold text-sm uppercase tracking-wider rounded-2xl transition-colors cursor-pointer"
            >
              End Lesson
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
