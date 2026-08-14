'use client';

import React from 'react';
import { MultipleChoiceExercise } from '@/types/lesson';
import { cn } from '@/lib/utils';

interface Props {
  exercise: MultipleChoiceExercise;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  disabled?: boolean;
}

export const MultipleChoice: React.FC<Props> = ({
  exercise,
  selectedOptionId,
  onSelect,
  disabled,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-8">
        {exercise.question}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {exercise.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => onSelect(opt.id)}
              className={cn(
                'p-5 rounded-2xl border-2 border-b-4 font-bold text-lg text-gray-700 shadow-sm transition-all duration-150 flex items-center justify-center text-center',
                isSelected
                  ? 'border-[#84d8ff] bg-[#ddf4ff] text-[#1CB0F6] border-b-4'
                  : 'border-gray-200 hover:bg-gray-50 border-b-gray-300 active:border-b-2 active:translate-y-[2px]'
              )}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};
