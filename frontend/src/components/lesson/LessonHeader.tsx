'use client';

import React from 'react';
import Link from 'next/link';
import { X, Heart } from 'lucide-react';
import { LessonProgress } from './LessonProgress';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  current: number;
  total: number;
  hearts: number;
}

export const LessonHeader: React.FC<Props> = ({ current, total, hearts }) => {
  return (
    <header className="w-full max-w-4xl mx-auto flex items-center gap-4 py-4 px-4 sm:px-8">
      <Link
        href="/learn"
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
      >
        <X className="w-6 h-6 stroke-[3]" />
      </Link>

      <div className="flex-1">
        <LessonProgress current={current} total={total} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={hearts}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.25, 0.95, 1] }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-1.5 font-bold text-[#FF4B4B] select-none"
        >
          <Heart className="w-6 h-6 fill-[#FF4B4B] text-[#FF4B4B]" />
          <span className="text-lg font-extrabold">{hearts}</span>
        </motion.div>
      </AnimatePresence>
    </header>
  );
};
