import React from 'react';
import { Zap } from 'lucide-react';

interface Props {
  xp: number;
}

export const XPDisplay: React.FC<Props> = ({ xp }) => {
  return (
    <div className="flex items-center gap-1.5 font-bold text-[#FFC800] px-2.5 py-1 rounded-xl hover:bg-yellow-50 transition">
      <Zap className="w-5 h-5 fill-[#FFC800]" />
      <span>{xp} XP</span>
    </div>
  );
};
