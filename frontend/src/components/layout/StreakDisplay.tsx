import React from 'react';
import { Flame } from 'lucide-react';

interface Props {
  streak: number;
}

export const StreakDisplay: React.FC<Props> = ({ streak }) => {
  return (
    <div className="flex items-center gap-1.5 font-bold text-[#FF9600] px-2.5 py-1 rounded-xl hover:bg-orange-50 transition">
      <Flame className="w-5 h-5 fill-[#FF9600] animate-bounce" />
      <span>{streak}</span>
    </div>
  );
};
