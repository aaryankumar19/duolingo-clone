'use client';

import React from 'react';
import { Exercise } from '@/types/lesson';
import { MultipleChoice } from './MultipleChoice';
import { WordBank } from './WordBank';
import { MatchPairs } from './MatchPairs';
import { FillBlank } from './FillBlank';
import { TypeAnswer } from './TypeAnswer';

interface Props {
  exercise: Exercise;
  selectedAnswer: unknown;
  onAnswerChange: (answer: unknown) => void;
  disabled?: boolean;
}

export const ExerciseRenderer: React.FC<Props> = ({
  exercise,
  selectedAnswer,
  onAnswerChange,
  disabled,
}) => {
  switch (exercise.type) {
    case 'multiple_choice':
      return (
        <MultipleChoice
          exercise={exercise}
          selectedOptionId={(selectedAnswer as string) || null}
          onSelect={(optId) => onAnswerChange(optId)}
          disabled={disabled}
        />
      );

    case 'word_bank':
      return (
        <WordBank
          exercise={exercise}
          selectedWords={(selectedAnswer as string[]) || []}
          onChange={(words) => onAnswerChange(words)}
          disabled={disabled}
        />
      );

    case 'match_pairs':
      return (
        <MatchPairs
          exercise={exercise}
          onChange={(isComplete) => onAnswerChange(isComplete ? 'complete' : null)}
          disabled={disabled}
        />
      );

    case 'fill_blank':
      return (
        <FillBlank
          exercise={exercise}
          selectedOption={(selectedAnswer as string) || null}
          onSelect={(opt) => onAnswerChange(opt)}
          disabled={disabled}
        />
      );

    case 'type_answer':
      return (
        <TypeAnswer
          exercise={exercise}
          value={(selectedAnswer as string) || ''}
          onChange={(val) => onAnswerChange(val)}
          disabled={disabled}
        />
      );

    default:
      return <div>Unknown exercise type</div>;
  }
};
