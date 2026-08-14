'use client';

import React from 'react';
import Image from 'next/image';
import { getRandomCharacter } from '@/lib/constants/characters';

interface Props {
  explanation?: string;
}

const HEADING_PRAISES = ['Excellent!', 'Awesome!', 'Spot on!', 'You got it!', 'Fantastic!', 'Superb!'];

export const CorrectFeedback: React.FC<Props> = ({ explanation }) => {
  const character = React.useMemo(() => getRandomCharacter(), []);
  const heading = React.useMemo(() => HEADING_PRAISES[Math.floor(Math.random() * HEADING_PRAISES.length)], []);

  return (
    <div className="flex items-center gap-4 text-[#58CC02]">
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
        <h3 className="font-extrabold text-2xl">{heading}</h3>
        {explanation && <p className="text-sm font-bold text-[#46A302]">{explanation}</p>}
      </div>
    </div>
  );
};


