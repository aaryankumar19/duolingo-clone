'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { MultipleChoiceExercise } from '@/types/lesson';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { playSound } from '@/lib/sounds/sound';
import { getRandomCharacter } from '@/lib/constants/characters';

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
  // Support keyboard shortcuts (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= exercise.options.length) {
        const opt = exercise.options[num - 1];
        if (opt) {
          playSound('click');
          onSelect(opt.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, exercise.options, onSelect]);

  const handleOptionClick = (optId: string) => {
    if (disabled) return;
    playSound('click');
    onSelect(optId);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-start select-none">
      {/* Exercise Question Prompt */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3c3c3c] text-left mb-8 tracking-tight">
        {exercise.question}
      </h1>

      {/* Character with speech bubble prompt if available */}
      <div className="flex items-center gap-4 mb-8 w-full">
        <div className="w-20 h-20 relative shrink-0">
          <Image
            src={getRandomCharacter(exercise.id).src}
            alt="Character"
            width={80}
            height={80}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        <div className="relative bg-white border-2 border-[#e5e5e5] rounded-2xl px-5 py-3.5 shadow-sm flex items-center gap-3">
          {/* Speech bubble beak pointing left */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-l-2 border-b-2 border-[#e5e5e5] rotate-45" />
          
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-[#1cb0f6] hover:bg-[#1899d6] flex items-center justify-center text-white shrink-0 transition shadow-xs"
            onClick={() => playSound('click')}
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className="text-lg font-bold text-[#4b4b4b]">
            {(() => {
              const match = exercise.question.match(/['"](.*?)['"]/);
              return match ? match[1] : exercise.question;
            })()}
          </span>
        </div>
      </div>

      {/* Option Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {exercise.options.map((opt, idx) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => handleOptionClick(opt.id)}
              className={cn(
                'group relative p-4 sm:p-5 rounded-2xl border-2 border-b-4 font-extrabold text-lg text-gray-700 shadow-sm transition-all duration-150 flex items-center justify-between text-left cursor-pointer',
                isSelected
                  ? 'border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6] border-b-[#1cb0f6]'
                  : 'border-[#e5e5e5] bg-white hover:bg-gray-50 border-b-[#e5e5e5] active:border-b-2 active:translate-y-[2px]'
              )}
            >
              <span className={cn('text-base sm:text-lg font-extrabold', isSelected ? 'text-[#1899d6]' : 'text-[#4b4b4b]')}>
                {opt.text}
              </span>

              {/* Number key shortcut pill */}
              <span
                className={cn(
                  'w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center border transition-colors',
                  isSelected
                    ? 'border-[#84d8ff] text-[#1cb0f6] bg-white'
                    : 'border-[#e5e5e5] text-[#afafaf] group-hover:border-gray-300'
                )}
              >
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
