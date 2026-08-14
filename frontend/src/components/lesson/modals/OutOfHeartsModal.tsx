'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { modalPop } from '@/lib/animations/variants';

interface Props {
  onRetry: () => void;
}

export const OutOfHeartsModal: React.FC<Props> = ({ onRetry }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        variants={modalPop}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white border-2 border-gray-200 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center"
      >
        <div className="w-24 h-24 relative mb-3">
          <Image
            src="/duo/fe225c25f1c6afe81424.svg"
            alt="Crying Duo"
            width={96}
            height={96}
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          You ran out of hearts!
        </h2>
        <p className="text-xs font-bold text-gray-500 mb-6 leading-relaxed">
          Don&apos;t worry, practice makes perfect. Try again to keep learning!
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onRetry}
            className="w-full py-3.5 bg-[#1CB0F6] hover:bg-[#1899D6] border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-[2px] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/learn"
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-extrabold text-sm uppercase tracking-wider rounded-2xl transition"
          >
            End Lesson
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
