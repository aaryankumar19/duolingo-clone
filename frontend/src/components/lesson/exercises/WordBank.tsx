'use client';

import React from 'react';
import Image from 'next/image';
import { WordBankExercise } from '@/types/lesson';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { playSound } from '@/lib/sounds/sound';
import { getRandomCharacter } from '@/lib/constants/characters';

interface Props {
  exercise: WordBankExercise;
  selectedWords: string[];
  onChange: (words: string[]) => void;
  disabled?: boolean;
}

export const WordBank: React.FC<Props> = ({
  exercise,
  selectedWords,
  onChange,
  disabled,
}) => {
  const handleSelectWord = (word: string, index: number) => {
    if (disabled) return;
    playSound('click');
    onChange([...selectedWords, word]);
  };

  const handleRemoveWord = (index: number) => {
    if (disabled) return;
    playSound('click');
    const updated = [...selectedWords];
    updated.splice(index, 1);
    onChange(updated);
  };

  // Find remaining words available in bank
  const getAvailableWords = () => {
    const wordCounts: Record<string, number> = {};
    exercise.words.forEach((w) => {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });
    selectedWords.forEach((w) => {
      if (wordCounts[w]) wordCounts[w]--;
    });

    return exercise.words.map((word, idx) => ({
      word,
      id: `${word}-${idx}`,
      isUsed:
        !wordCounts[word] || wordCounts[word] <= 0
          ? ((wordCounts[word] = (wordCounts[word] || 0) - 1), true)
          : false,
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-start select-none">
      {/* Question prompt */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3c3c3c] text-left mb-8 tracking-tight">
        {exercise.question}
      </h1>

      {/* Character speaking prompt */}
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
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-l-2 border-b-2 border-[#e5e5e5] rotate-45" />
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-[#1cb0f6] hover:bg-[#1899d6] flex items-center justify-center text-white shrink-0 transition shadow-xs"
            onClick={() => playSound('click')}
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className="text-lg font-bold text-[#4b4b4b]">
            {exercise.question.replace(/^Translate.*?:/i, '').replace(/['"]/g, '').trim()}
          </span>
        </div>
      </div>

      {/* Target sentence drop zone */}
      <div className="w-full min-h-[80px] border-b-2 border-t-2 border-[#e5e5e5] py-3.5 flex flex-wrap gap-2.5 items-center justify-start mb-8 px-2">
        {selectedWords.map((word, idx) => (
          <button
            key={`selected-${idx}`}
            disabled={disabled}
            onClick={() => handleRemoveWord(idx)}
            className="px-4 py-2.5 bg-white rounded-2xl border-2 border-b-4 border-[#e5e5e5] font-extrabold text-base text-[#4b4b4b] shadow-xs hover:bg-gray-50 active:translate-y-[2px] transition cursor-pointer"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word bank pool */}
      <div className="flex flex-wrap gap-3 justify-center w-full">
        {exercise.words.map((word, idx) => {
          const countInSelected = selectedWords.filter((w) => w === word).length;
          const countInWordsBefore = exercise.words.slice(0, idx).filter((w) => w === word).length;
          const isUsed = countInSelected > countInWordsBefore;

          return (
            <button
              key={`bank-${word}-${idx}`}
              disabled={disabled || isUsed}
              onClick={() => handleSelectWord(word, idx)}
              className={cn(
                'px-4.5 py-2.5 rounded-2xl border-2 font-extrabold text-base shadow-xs transition-all duration-150',
                isUsed
                  ? 'bg-[#e5e5e5] border-[#e5e5e5] text-transparent border-b-[#e5e5e5] cursor-default'
                  : 'bg-white border-[#e5e5e5] border-b-4 text-[#4b4b4b] hover:bg-gray-50 active:border-b-2 active:translate-y-[2px] cursor-pointer'
              )}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
