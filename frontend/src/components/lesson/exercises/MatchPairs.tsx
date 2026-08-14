'use client';

import React, { useState, useEffect } from 'react';
import { MatchPairsExercise } from '@/types/lesson';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/sounds/sound';

import { lessonApi } from '@/lib/api/lesson/api';
import { useLessonStore } from '@/store/lesson-store';
import { useAuthStore } from '@/store/use-auth-store';

interface Props {
  exercise: MatchPairsExercise;
  onChange: (result: { pairs: Record<string, string> } | null) => void;
  disabled?: boolean;
}

export const MatchPairs: React.FC<Props> = ({ exercise, onChange, disabled }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [mismatched, setMismatched] = useState<boolean>(false);

  // Shuffle right side items deterministically
  const leftItems = (exercise.pairs || []).map((p) => p.left);
  const rightItems = [...(exercise.pairs || []).map((p) => p.right)].reverse();

  const handleLeftClick = (val: string) => {
    if (disabled || matchedPairs.includes(val)) return;
    playSound('click');
    setSelectedLeft(val);
  };

  const handleRightClick = (val: string) => {
    if (disabled || matchedPairs.includes(val)) return;
    playSound('click');
    setSelectedRight(val);
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const match = exercise.pairs.find(
        (p) => p.left === selectedLeft && p.right === selectedRight
      );

      if (match) {
        playSound('correct');
        const updatedMatches = [...matchedPairs, selectedLeft, selectedRight];
        setMatchedPairs(updatedMatches);
        setSelectedLeft(null);
        setSelectedRight(null);

        if (updatedMatches.length >= exercise.pairs.length * 2) {
          const pairsMap = Object.fromEntries(
            exercise.pairs.map((p) => [p.left, p.right])
          );
          onChange({ pairs: pairsMap });
        }
      } else {
        playSound('incorrect');
        setMismatched(true);

        const leftVal = selectedLeft;
        const rightVal = selectedRight;
        lessonApi
          .submitExercise(exercise.id, { single_pair: { left: leftVal, right: rightVal } })
          .then((res) => {
            // Update hearts in stores without triggering the full feedback bar overlay
            useLessonStore.setState({ hearts: res.hearts_remaining ?? 0 });
            useAuthStore.getState().updateUser({ hearts: res.hearts_remaining ?? 0 });

            if (res.is_out_of_hearts) {
              useLessonStore.setState({ isOutOfHearts: true, isFeedbackVisible: false });
            }
          })
          .catch((err) => {
            // Fallback for local mismatch heart deduction if API fails
            const currentHearts = useLessonStore.getState().hearts;
            const newHearts = Math.max(0, currentHearts - 1);
            useLessonStore.setState({ hearts: newHearts });
            useAuthStore.getState().updateUser({ hearts: newHearts });

            if (newHearts <= 0) {
              useLessonStore.setState({ isOutOfHearts: true, isFeedbackVisible: false });
            }
            console.error('Failed to submit pair mismatch:', err);
          });

        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setMismatched(false);
        }, 500);
      }
    }
  }, [selectedLeft, selectedRight, exercise.pairs, matchedPairs, onChange, exercise.id]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-8">
        {exercise.question}
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          {leftItems.map((val) => {
            const isMatched = matchedPairs.includes(val);
            const isSelected = selectedLeft === val;

            return (
              <button
                key={`left-${val}`}
                disabled={disabled || isMatched}
                onClick={() => handleLeftClick(val)}
                className={cn(
                  'p-4 rounded-2xl border-2 border-b-4 font-bold text-base shadow-xs transition-all duration-150 text-center cursor-pointer',
                  isMatched && 'bg-gray-100 border-gray-200 text-gray-400 border-b-gray-200 cursor-default',
                  isSelected && !mismatched && 'bg-sky-50 border-[#84d8ff] text-[#1CB0F6]',
                  isSelected && mismatched && 'bg-red-50 border-red-300 text-red-500 animate-shake',
                  !isMatched && !isSelected && 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                )}
              >
                {val}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          {rightItems.map((val) => {
            const isMatched = matchedPairs.includes(val);
            const isSelected = selectedRight === val;

            return (
              <button
                key={`right-${val}`}
                disabled={disabled || isMatched}
                onClick={() => handleRightClick(val)}
                className={cn(
                  'p-4 rounded-2xl border-2 border-b-4 font-bold text-base shadow-xs transition-all duration-150 text-center cursor-pointer',
                  isMatched && 'bg-gray-100 border-gray-200 text-gray-400 border-b-gray-200 cursor-default',
                  isSelected && !mismatched && 'bg-sky-50 border-[#84d8ff] text-[#1CB0F6]',
                  isSelected && mismatched && 'bg-red-50 border-red-300 text-red-500 animate-shake',
                  !isMatched && !isSelected && 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                )}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
