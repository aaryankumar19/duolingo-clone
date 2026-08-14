'use client';

import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { getRandomCharacter } from '@/lib/constants/characters';
import { motion } from 'framer-motion';

interface Props {
  explanation?: string;
  heartsRemaining?: number;
}

export const IncorrectFeedback: React.FC<Props> = ({ explanation, heartsRemaining }) => {
  const character = React.useMemo(() => getRandomCharacter(), []);
  const maxHearts = 5;
  const showHearts = heartsRemaining !== undefined && heartsRemaining >= 0;

  return (
    <div className="flex items-center gap-4 text-[#FF4B4B]">
      <div className="w-16 h-16 relative shrink-0">
        <Image
          src={character.src}
          alt={character.name}
          width={64}
          height={64}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      <div>
        <h3 className="font-extrabold text-lg sm:text-xl leading-tight text-[#FF4B4B]">
          You got this question wrong! A heart has been deducted.
        </h3>
        <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-[#FF4B4B]/80 mt-2">
          Correct solution:
        </h4>
        <p className="text-sm font-bold text-[#EA2B2B] mb-2">
          {explanation || 'Check your spelling or order.'}
        </p>
        {showHearts && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1"
          >
            {Array.from({ length: maxHearts }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400 }}
              >
                <Heart
                  className={`w-4 h-4 transition-all ${
                    i < heartsRemaining
                      ? 'fill-[#FF4B4B] text-[#FF4B4B]'
                      : 'fill-none text-[#FF4B4B]/30 stroke-[#FF4B4B]/30'
                  }`}
                  strokeWidth={2}
                />
              </motion.div>
            ))}
            {heartsRemaining === 1 && (
              <span className="text-xs font-extrabold text-[#FF4B4B] ml-1">Last heart!</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
