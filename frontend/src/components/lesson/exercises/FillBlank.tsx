'use client';

import React from 'react';
import { FillBlankExercise } from '@/types/lesson';
import { cn } from '@/lib/utils';

interface Props {
  exercise: FillBlankExercise;
  selectedOption: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export const FillBlank: React.FC<Props> = ({
  exercise,
  selectedOption,
  onSelect,
  disabled,
}) => {
  const parts = exercise.sentenceWithBlank.split('___');

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 text-center mb-8">
        {exercise.question}
      </h2>

      {/* Sentence with Blank display */}
      <div className="flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-gray-800 mb-10 bg-gray-50 px-6 py-4 rounded-2xl border-2 border-gray-200">
        <span>{parts[0]}</span>
        <span
          className={cn(
            'inline-block px-4 py-1 rounded-xl border-b-4 border-2 font-extrabold min-w-[100px] text-center transition-all',
            selectedOption
              ? 'bg-[#ddf4ff] border-[#84d8ff] text-[#1CB0F6]'
              : 'bg-white border-gray-300 border-dashed text-transparent'
          )}
        >
          {selectedOption || '___'}
        </span>
        <span>{parts[1]}</span>
      </div>

      {/* Multiple choice options */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {exercise.options.map((opt) => {
          const isSelected = selectedOption === opt;

          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => onSelect(opt)}
              className={cn(
                'p-4 rounded-2xl border-2 border-b-4 font-bold text-lg text-gray-700 shadow-sm transition-all duration-150 text-center',
                isSelected
                  ? 'border-[#84d8ff] bg-[#ddf4ff] text-[#1CB0F6]'
                  : 'border-gray-200 hover:bg-gray-50 border-b-gray-300 active:translate-y-[2px]'
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
