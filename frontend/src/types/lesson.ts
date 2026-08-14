// ─── Frontend Exercise Types (used by exercise components) ───────────────────

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

// ─── Backend API Shapes ───────────────────────────────────────────────────────

/** Raw exercise as returned by GET /api/skills/{skill_id}/next-lesson/ */
export interface BackendExercise {
  id: string;
  /** Backend uses UPPERCASE: MULTIPLE_CHOICE, TRANSLATE, MATCH_PAIRS, FILL_IN_BLANK, TYPE_ANSWER */
  exercise_type: string;
  prompt?: string;
  question?: string;
  audio_url?: string | null;
  content_json?: any;
  order?: number;

  // Potential alternative shapes
  options?: any;
  correct_option_id?: string;
  word_bank?: string[];
  correct_sentence?: string[];
  pairs?: any;
  sentence_with_blank?: string;
  correct_answer?: any;
  acceptable_answers?: string[];
}

/** Response from GET /api/skills/{skill_id}/next-lesson/ */
export interface BackendNextLessonResponse {
  data: {
    lesson: {
      id: string;
      title: string;
      order?: number;
      xp_reward?: number;
      total_xp?: number;
      unit?: {
        id: string;
        title: string;
      };
      unit_id?: string;
      exercises: BackendExercise[];
    };
  };
}

/** Response from POST /api/lessons/exercises/{id}/submit/ */
export interface ExerciseSubmitResponse {
  data: {
    is_correct: boolean;
    feedback: {
      type: 'CORRECT' | 'INCORRECT';
      message: string;
    };
    correct_answer: string;
    hearts_remaining: number;
    is_out_of_hearts: boolean;
  };
}

/** Response from POST /api/lessons/{id}/complete/ */
export interface LessonCompleteResponse {
  data: {
    xp_awarded?: number;
    xp_earned?: number;
    total_xp: number;
    streak?: number;
    streak_count?: number;
    hearts_remaining?: number;
    next_unit_unlocked?: boolean;
    achievements_earned?: string[];
  };
}

