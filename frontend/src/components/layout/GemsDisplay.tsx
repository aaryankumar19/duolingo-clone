import React from 'react';
import { Gem } from 'lucide-react';

interface Props {
  gems: number;
}

export const GemsDisplay: React.FC<Props> = ({ gems }) => {
  return (
    <div className="flex items-center gap-1.5 font-bold text-[#CE82FF] px-2.5 py-1 rounded-xl hover:bg-purple-50 transition">
      <Gem className="w-5 h-5 fill-[#CE82FF]" />
      <span>{gems}</span>
    </div>
  );
};
