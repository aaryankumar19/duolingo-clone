'use client';

import React from 'react';
import Image from 'next/image';

interface Props {
  explanation?: string;
}

export const CorrectFeedback: React.FC<Props> = ({ explanation }) => {
  return (
    <div className="flex items-center gap-4 text-[#58CC02]">
      <div className="w-14 h-14 relative shrink-0">
        <Image
          src="/duo/ad9ec13f2b161e008ab1.svg"
          alt="Happy Duo"
          width={56}
          height={56}
          className="object-contain"
        />
      </div>
      <div>
        <h3 className="font-extrabold text-2xl">Excellent!</h3>
        {explanation && <p className="text-sm font-bold text-[#46A302]">{explanation}</p>}
      </div>
    </div>
  );
};
