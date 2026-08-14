'use client';

import React from 'react';
import Image from 'next/image';

interface Props {
  explanation?: string;
}

export const IncorrectFeedback: React.FC<Props> = ({ explanation }) => {
  return (
    <div className="flex items-center gap-4 text-[#FF4B4B]">
      <div className="w-14 h-14 relative shrink-0">
        <Image
          src="/duo/9a6ea4292d92aebb9c5a.svg"
          alt="Sad Duo"
          width={56}
          height={56}
          className="object-contain"
        />
      </div>
      <div>
        <h3 className="font-extrabold text-2xl">Correct solution:</h3>
        <p className="text-sm font-bold text-[#EA2B2B]">{explanation || 'Check your spelling or order.'}</p>
      </div>
    </div>
  );
};
