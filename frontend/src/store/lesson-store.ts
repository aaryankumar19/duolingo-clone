import { create } from 'zustand';
import { Lesson } from '@/types/lesson';
import { useAuthStore } from './use-auth-store';

export interface LessonScore {
  lessonId: string;
  totalXP: number;
  accuracy: number;
  correctCount: number;
  totalExercises: number;
  timestamp: number;
}

interface LessonStoreState {
  lesson: Lesson | null;
  lessonId: string | null;
  currentIndex: number;
  selectedAnswer: unknown | null;
  answers: Record<number, unknown>;
  correctCount: number;
  hearts: number;
  maxHearts: number;
  isFeedbackVisible: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  feedbackMessage: string;
  feedbackExplanation?: string;
  isCompleted: boolean;
  isOutOfHearts: boolean;
  earnedXP: number;
  newStreak: number;
  lastLessonScore: LessonScore | null;

  // Actions
  startLesson: (lesson: Lesson, initialHearts?: number) => void;
  setSelectedAnswer: (answer: unknown) => void;
  applySubmitResult: (params: {
    isCorrect: boolean;
    feedbackMessage: string;
    correctAnswer: string;
    heartsRemaining: number;
    isOutOfHearts: boolean;
  }) => void;
  submitAnswer: (isCorrect: boolean, explanation?: string) => void;
  nextExercise: () => void;
  setCompletionResult: (xp: number, streak: number) => void;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonStoreState>((set, get) => ({
  lesson: null,
  lessonId: null,
  currentIndex: 0,
  selectedAnswer: null,
  answers: {},
  correctCount: 0,
  hearts: 5,
  maxHearts: 5,
  isFeedbackVisible: false,
  feedbackType: null,
  feedbackMessage: '',
  feedbackExplanation: undefined,
  isCompleted: false,
  isOutOfHearts: false,
  earnedXP: 0,
  newStreak: 0,
  lastLessonScore: null,

  startLesson: (lesson, initialHearts = 5) => {
    set({
      lesson,
      lessonId: lesson.id,
      currentIndex: 0,
      selectedAnswer: null,
      answers: {},
      correctCount: 0,
      hearts: initialHearts,
      maxHearts: 5,
      isFeedbackVisible: false,
      feedbackType: null,
      feedbackMessage: '',
      feedbackExplanation: undefined,
      isCompleted: false,
      isOutOfHearts: false,
      earnedXP: 0,
      newStreak: 0,
      lastLessonScore: null,
    });
  },

  setSelectedAnswer: (answer) => {
    set({ selectedAnswer: answer });
  },

  applySubmitResult: ({
    isCorrect,
    feedbackMessage,
    correctAnswer,
    heartsRemaining,
    isOutOfHearts,
  }) => {
    const { currentIndex, answers, selectedAnswer, correctCount } = get();
    const newAnswers = { ...answers, [currentIndex]: selectedAnswer };

    set({
      answers: newAnswers,
      correctCount: isCorrect ? correctCount + 1 : correctCount,
      hearts: heartsRemaining,
      isFeedbackVisible: true,
      feedbackType: isCorrect ? 'correct' : 'incorrect',
      feedbackMessage,
      feedbackExplanation: isCorrect ? undefined : correctAnswer,
      // Don't show OutOfHearts yet — let the user see the red feedback bar first,
      // then trigger it when they click Continue (handled in nextExercise).
      isOutOfHearts: false,
    });

    // Synchronize auth store hearts immediately
    useAuthStore.getState().updateUser({
      hearts: heartsRemaining,
    });
  },

  submitAnswer: (isCorrect, explanation) => {
    const { currentIndex, answers, selectedAnswer, correctCount, hearts } = get();
    const newAnswers = { ...answers, [currentIndex]: selectedAnswer };
    if (isCorrect) {
      set({
        answers: newAnswers,
        correctCount: correctCount + 1,
        isFeedbackVisible: true,
        feedbackType: 'correct',
        feedbackMessage: 'Great job!',
        feedbackExplanation: explanation,
      });
    } else {
      const newHearts = Math.max(0, hearts - 1);
      set({
        answers: newAnswers,
        hearts: newHearts,
        isFeedbackVisible: true,
        feedbackType: 'incorrect',
        feedbackMessage: 'Not quite.',
        feedbackExplanation: explanation || 'Check your spelling or order.',
        isOutOfHearts: false,
      });
      useAuthStore.getState().updateUser({
        hearts: newHearts,
      });
    }
  },

  nextExercise: () => {
    const { lesson, currentIndex, hearts } = get();
    if (!lesson) return;

    // If hearts just hit zero (from the last wrong answer), show the modal now
    // (after the user has seen and dismissed the red feedback bar).
    if (hearts <= 0) {
      set({ isOutOfHearts: true, isFeedbackVisible: false });
      return;
    }

    const nextIdx = currentIndex + 1;
    if (nextIdx >= lesson.exercises.length) {
      set({ isCompleted: true, isFeedbackVisible: false });
    } else {
      set({
        currentIndex: nextIdx,
        selectedAnswer: null,
        isFeedbackVisible: false,
        feedbackType: null,
        feedbackMessage: '',
        feedbackExplanation: undefined,
      });
    }
  },

  setCompletionResult: (xp, streak) => {
    const { lessonId, correctCount, lesson } = get();
    const totalExercises = lesson?.exercises.length ?? 1;
    const accuracy = Math.round((correctCount / totalExercises) * 100);

    const scoreObj: LessonScore = {
      lessonId: lessonId || '',
      totalXP: xp,
      accuracy,
      correctCount,
      totalExercises,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem('duolingo_last_lesson_score', JSON.stringify(scoreObj));
    } catch (e) {
      console.warn('Could not save score to localStorage:', e);
    }

    set({ earnedXP: xp, newStreak: streak, lastLessonScore: scoreObj });
  },

  resetLesson: () => {
    const { lesson, maxHearts } = get();
    if (lesson) {
      get().startLesson(lesson, maxHearts);
    }
  },
}));
