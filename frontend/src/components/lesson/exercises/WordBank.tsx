'use client';

import React from 'react';
import { WordBankExercise } from '@/types/lesson';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { playSound } from '@/lib/sounds/sound';

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
      isUsed: !wordCounts[word] || wordCounts[word] <= 0
        ? ((wordCounts[word] = (wordCounts[word] || 0) - 1), true)
        : false,
    }));
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 text-center mb-6">
        {exercise.question}
      </h2>

      {/* Target sentence drop zone */}
      <div className="w-full min-h-[72px] border-b-2 border-t-2 border-gray-200 py-3 flex flex-wrap gap-2 items-center justify-start mb-8 px-2">
        {selectedWords.map((word, idx) => (
          <button
            key={`selected-${idx}`}
            disabled={disabled}
            onClick={() => handleRemoveWord(idx)}
            className="px-4 py-2 bg-white rounded-xl border-2 border-b-4 border-gray-200 font-bold text-gray-800 shadow-xs hover:bg-gray-50 active:translate-y-[2px]"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word bank pool */}
      <div className="flex flex-wrap gap-2.5 justify-center w-full">
        {exercise.words.map((word, idx) => {
          // Count used instances up to this index
          const countInSelected = selectedWords.filter((w) => w === word).length;
          const countInWordsBefore = exercise.words.slice(0, idx).filter((w) => w === word).length;
          const isUsed = countInSelected > countInWordsBefore;

          return (
            <button
              key={`bank-${word}-${idx}`}
              disabled={disabled || isUsed}
              onClick={() => handleSelectWord(word, idx)}
              className={cn(
                'px-4 py-2.5 rounded-xl border-2 border-b-4 font-bold text-base shadow-xs transition-all duration-150',
                isUsed
                  ? 'bg-gray-100 border-gray-200 text-transparent border-b-gray-200 cursor-default'
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50 border-b-gray-300 active:translate-y-[2px]'
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
