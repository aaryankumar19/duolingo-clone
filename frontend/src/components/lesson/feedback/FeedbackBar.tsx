'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CorrectFeedback } from './CorrectFeedback';
import { IncorrectFeedback } from './IncorrectFeedback';
import { feedbackBarVariants } from '@/lib/animations/variants';

interface Props {
  type: 'correct' | 'incorrect' | null;
  explanation?: string;
  onContinue: () => void;
}

export const FeedbackBar: React.FC<Props> = ({ type, explanation, onContinue }) => {
  if (!type) return null;

  const isCorrect = type === 'correct';

  return (
    <motion.div
      variants={feedbackBarVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'fixed bottom-0 left-0 right-0 p-6 z-50 border-t-2 transition-colors duration-200',
        isCorrect ? 'bg-[#d7ffb8] border-[#b8f28b]' : 'bg-[#ffdfe0] border-[#ffc1c3]'
      )}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {isCorrect ? (
          <CorrectFeedback explanation={explanation} />
        ) : (
          <IncorrectFeedback explanation={explanation} />
        )}

        <button
          onClick={onContinue}
          className={cn(
            'w-full sm:w-auto px-10 py-3.5 rounded-2xl font-extrabold text-base uppercase tracking-wider text-white shadow-md border-b-4 active:border-b-0 active:translate-y-[2px] transition-all',
            isCorrect
              ? 'bg-[#58CC02] hover:bg-[#46A302] border-[#46A302]'
              : 'bg-[#FF4B4B] hover:bg-[#EA2B2B] border-[#EA2B2B]'
          )}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};
