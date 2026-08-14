'use client';

import React from 'react';
import { TypeAnswerExercise } from '@/types/lesson';

interface Props {
  exercise: TypeAnswerExercise;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const TypeAnswer: React.FC<Props> = ({
  exercise,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-8">
        {exercise.question}
      </h2>

      <div className="w-full">
        <textarea
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type in Spanish..."
          rows={3}
          className="w-full p-4 text-lg font-bold text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-[#1CB0F6] focus:outline-none transition-all shadow-inner resize-none"
        />
      </div>
    </div>
  );
};
