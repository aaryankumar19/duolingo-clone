'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, X } from 'lucide-react';
import { SkillNodeData } from '@/types/learning';
import { modalPop } from '@/lib/animations/variants';

interface Props {
  skill: SkillNodeData;
  onClose: () => void;
}

export const LessonPopover: React.FC<Props> = ({ skill, onClose }) => {
  return (
    <motion.div
      variants={modalPop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-80 bg-white border-2 border-gray-200 rounded-3xl p-5 shadow-2xl z-50 text-center"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-16 h-16 bg-[#58CC02] rounded-2xl mx-auto flex items-center justify-center text-white mb-3 shadow-md border-b-4 border-[#46A302]">
        <BookOpen className="w-8 h-8" />
      </div>

      <h3 className="font-extrabold text-xl text-gray-800">{skill.title}</h3>
      <p className="text-xs text-gray-500 font-semibold mt-1 mb-4 leading-relaxed">
        {skill.description}
      </p>

      <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 p-2.5 rounded-xl mb-4">
        <span>Lesson {skill.progress + 1} of {skill.totalLessons}</span>
        <span className="text-[#FFC800] flex items-center gap-1 font-extrabold">
          <Sparkles className="w-4 h-4" /> +15 XP
        </span>
      </div>

      <Link
        href={`/lesson/${skill.id}`}
        className="block w-full py-3.5 bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-[2px] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition"
      >
        Start +15 XP
      </Link>
    </motion.div>
  );
};
