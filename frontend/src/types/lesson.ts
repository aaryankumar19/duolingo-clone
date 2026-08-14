export type ExerciseType =
  | 'multiple_choice'
  | 'word_bank'
  | 'match_pairs'
  | 'fill_blank'
  | 'type_answer';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  promptAudioUrl?: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple_choice';
  options: { id: string; text: string; imageUrl?: string }[];
  correctOptionId: string;
}

export interface WordBankExercise extends BaseExercise {
  type: 'word_bank';
  words: string[];
  correctSentence: string[];
}

export interface MatchPairsExercise extends BaseExercise {
  type: 'match_pairs';
  pairs: { left: string; right: string }[];
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill_blank';
  sentenceWithBlank: string;
  options: string[];
  correctAnswer: string;
}

export interface TypeAnswerExercise extends BaseExercise {
  type: 'type_answer';
  acceptableAnswers: string[];
}

export type Exercise =
  | MultipleChoiceExercise
  | WordBankExercise
  | MatchPairsExercise
  | FillBlankExercise
  | TypeAnswerExercise;

export interface Lesson {
  id: string;
  title: string;
  unitId: string;
  exercises: Exercise[];
  totalXP: number;
}
