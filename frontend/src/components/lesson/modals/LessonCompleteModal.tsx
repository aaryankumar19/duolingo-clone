'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, Target, ArrowRight } from 'lucide-react';
import { modalPop } from '@/lib/animations/variants';
import { playSound } from '@/lib/sounds/sound';

interface Props {
  totalXP: number;
  accuracy: number;
}

export const LessonCompleteModal: React.FC<Props> = ({ totalXP, accuracy }) => {
  useEffect(() => {
    playSound('lesson-complete');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        variants={modalPop}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white border-2 border-gray-200 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center"
      >
        <div className="w-28 h-28 relative mb-2 animate-bounce">
          <Image
            src="/duo/215f9f8714df8f7de63c.svg"
            alt="Celebrating Duo"
            width={112}
            height={112}
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
          Lesson Complete!
        </h2>
        <p className="text-sm font-bold text-gray-400 mb-6">
          You are making great progress!
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-8 w-full">
          <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase text-amber-600 tracking-wider mb-1">
              TOTAL XP
            </span>
            <div className="flex items-center gap-1.5 font-extrabold text-2xl text-[#FFC800]">
              <Zap className="w-6 h-6 fill-[#FFC800]" />
              <span>+{totalXP}</span>
            </div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase text-emerald-600 tracking-wider mb-1">
              ACCURACY
            </span>
            <div className="flex items-center gap-1.5 font-extrabold text-2xl text-[#58CC02]">
              <Target className="w-6 h-6" />
              <span>{Math.round(accuracy)}%</span>
            </div>
          </div>
        </div>

        <Link
          href="/learn"
          className="w-full py-4 bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-[2px] text-white font-extrabold text-base uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
};
