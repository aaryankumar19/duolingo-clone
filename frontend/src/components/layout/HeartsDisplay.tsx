import React from 'react';
import { Heart } from 'lucide-react';

interface Props {
  hearts: number;
}

export const HeartsDisplay: React.FC<Props> = ({ hearts }) => {
  return (
    <div className="flex items-center gap-1.5 font-bold text-[#FF4B4B] px-2.5 py-1 rounded-xl hover:bg-red-50 transition">
      <Heart className="w-5 h-5 fill-[#FF4B4B]" />
      <span>{hearts}</span>
    </div>
  );
};
